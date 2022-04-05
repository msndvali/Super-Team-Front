import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Observer, Subscription } from 'rxjs';
import { ScopeOfWorkService } from '../../shared/services/scope-of-work.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import jwt_decode from 'jwt-decode';
import { QuoteService } from '../../shared/services/quote.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

@Component({
  selector: 'app-scope-of-work',
  templateUrl: './scope-of-work.component.html',
  styleUrls: ['./scope-of-work.component.scss']
})
export class ScopeOfWorkComponent implements OnInit, OnDestroy {
  private routeSub: Subscription;
  projectId: number;
  project: any = [];
  projectStatus: number;
  totalArea: any;

  users: any = [];

  isJunehomes: boolean = false;

  uploadCategories: any = {
    accessVideoUrl: '',
    garbageVideoUrl: '',
    mailboxPhotoUrl: '',
    routerPhotoUrl: '',
    electricSwitchboxPhotoUrl: '',
    additionalFile1Url: '',
    additionalFile2Url: '',
    additionalFile3Url: ''
  }
  base64Image: any;

  floorPlanUrl: any;

  @ViewChild('contractPDF') contractPDF: ElementRef;
  @ViewChild('junehomesPDF') junehomesPDF: ElementRef;

  furnitures: any[] = [];
  roomTotals: any[] = [];
  furnitureTotal: number;

  renderedScopesOfWork: any[] = [];
  scopesOfWork: any[] = [];
  scopesOfWorkRooms: any[] = [];
  apartmentScopesOfWork: any[] = [];

  selectedScopes: any[] = [];
  selectedPDF: any[] = [];
  notSelected: any[] = [];

  roomTypes = {
    1: 'Living Room',
    2: 'Bedroom',
    3: 'Bathroom',
    4: 'Kitchen'
  };

  uploadSpinner: string = 'upload';
  checkSpinner: string = 'check';
  changeStatus: string = 'status';
  furnitureStatus: string = 'furniture';

  role: string;
  name: string;
  email: string;
  postalCode: string;
  assignedOrganization: any;

  calculatedData: any;
  totalFurniturePrice: number = 0;
  totalLaborCost: number = 0;
  totalLaborHours: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private scopeOfWorkService: ScopeOfWorkService,
    private quoteService: QuoteService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    const token = localStorage.getItem('JwtToken');
    if (!token) {
      return;
    }
    const tokenInfo = this.getDecodedAccessToken(token);
    this.role = tokenInfo.extension_Role;
    this.name = tokenInfo.given_name + ' ' + tokenInfo.family_name;
    this.email = tokenInfo.emails[0];
    this.postalCode = tokenInfo.postalCode;


    this.scopeOfWorkService.checkJunehomes()
      .subscribe(res => {
        this.isJunehomes = res;
      });

    this.getProject();
    this.getQuote();
    this.getFurniture();
    this.getScopeOfWork();
    this.getSelected();
    this.getUploadedFiles();
  }

  getDecodedAccessToken(token: any): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  getQuote() {
    this.quoteService.getQuote(this.projectId)
      .subscribe(res => {
        this.calculatedData = res.quote;
        this.totalFurniturePrice = res.totalFurniturePrice;
      });
  }

  goBackToProject(id: number) {
    this.router.navigate(['profile', 'projects', id]);
  }

  goBackToMyProjects() {
    this.router.navigate(['profile', 'projects']);
  }

  openQuoteModal(quote: any) {
    this.modalService.open(quote, { centered: true });
  }

  openFilesModal(files: any) {
    this.modalService.open(files, { centered: true });
  }

  openFurnitureModal(furniture: any) {
    this.modalService.open(furniture, { centered: true });
  }

  getProject() {
    this.spinner.show('check');
    this.scopeOfWorkService.getProject(this.projectId)
      .subscribe(data => {

        if (this.role == 'leader') {
          this.scopeOfWorkService.getOrganizationId()
            .subscribe(org => {
              if (data.project.organizationId != org.organization.id && this.projectStatus == 3) {
                this.router.navigate(['/home']);
                this.spinner.hide('check');
                return;
              }
            });
        }

        if (data.project.organization) {
          this.assignedOrganization = data.project.organization;
        }
        this.project = data.project;
        this.floorPlanUrl = data.project.property.floorPlanUrl;
        this.projectStatus = data.project.statusId;
        this.totalArea = data.project.property.totalArea;
      });
  }

  getScopeOfWork() {
    this.scopeOfWorkService.getScopeOfWorkSelected(this.projectId)
      .subscribe(res => {
        this.selectedScopes = res;
      });
    this.scopeOfWorkService.getScopeOfWork(this.projectId)
      .subscribe(res => {
        this.apartmentScopesOfWork = res.apartmentScopesOfWork;
        this.renderedScopesOfWork = res.roomIdAndScopesOfWork;

        Object.values(res.roomIdAndScopesOfWork).forEach((rooms: any, index) => {
          Object.values(rooms).forEach((room: any, index) => {
            this.scopesOfWorkRooms.push(room);
          });
        });

        this.calculateTotalLaborCost();

        this.spinner.hide('check');
        this.spinner.hide('status');
      });
  }

  getSelected() {
    this.scopeOfWorkService.getScopeOfWork(this.projectId)
      .subscribe(res => {
        Object.values(res.roomIdAndScopesOfWork).forEach((rooms: any, index) => {
          Object.values(rooms).forEach((room: any, index) => {
            if (room.isAssignedToProject == true) {
              this.selectedPDF.push(room);
            }
          });
        });
      });
  }

  calculateTotalLaborCost() {
    this.totalLaborCost = 0;
    this.scopeOfWorkService.getScopeOfWork(this.projectId)
      .subscribe(res => {
        Object.values(res.roomIdAndScopesOfWork).forEach((rooms: any, indexes) => {
          Object.values(rooms).forEach((room: any, index) => {
            if (room.isAssignedToProject == true) {
              this.totalLaborHours += room.laborHours;
              this.totalLaborCost += room.laborCost;
            }
          });
        });

        Object.values(res.apartmentScopesOfWork).forEach((aprt: any, indexes) => {
          this.totalLaborHours += aprt.laborHours;
          this.totalLaborCost += aprt.laborCost;
        });
      });
  }

  getUploadedFiles() {
    this.spinner.show('upload');
    this.scopeOfWorkService.getProject(this.projectId)
      .subscribe(data => {
        const project = data.project;
        const defaultPath = 'https://superteam.blob.core.windows.net/images/';

        if (project.accessVideoUrl) {
          this.uploadCategories.accessVideoUrl = defaultPath + project.accessVideoUrl;
        }
        if (project.garbageVideoUrl) {
          this.uploadCategories.garbageVideoUrl = defaultPath + project.garbageVideoUrl;
        }
        if (project.mailboxPhotoUrl) {
          this.uploadCategories.mailboxPhotoUrl = defaultPath + project.mailboxPhotoUrl;
        }
        if (project.routerPhotoUrl) {
          this.uploadCategories.routerPhotoUrl = defaultPath + project.routerPhotoUrl;
        }
        if (project.electricSwitchboxPhotoUrl) {
          this.uploadCategories.electricSwitchboxPhotoUrl = defaultPath + project.electricSwitchboxPhotoUrl;
        }
        if (project.additionalFile1Url) {
          this.uploadCategories.additionalFile1Url = defaultPath + 'document/' + project.additionalFile1Url;
        }
        if (project.additionalFile2Url) {
          this.uploadCategories.additionalFile2Url = defaultPath + 'document/' + project.additionalFile2Url;
        }
        if (project.additionalFile3Url) {
          this.uploadCategories.additionalFile3Url = defaultPath + 'document/' + project.additionalFile3Url;
        }
        this.spinner.hide('upload');
      });
  }

  additionalFileChanged(event: any, fileName: string) {
    const files = event.target.files[0];
    if (files.length === 0)
      return;

    const name = fileName + '-' + this.projectId;

    const formData = new FormData();
    formData.append('file', files, name);

    this.scopeOfWorkService.addFiles(formData, 'document')
      .subscribe(res => {
        const path = res.path;

        let parameter;

        if (fileName == 'additional-file-1') {
          parameter = 'additionalFile1Url';
        }
        else if (fileName == 'additional-file-2') {
          parameter = 'additionalFile2Url';
        }
        else if (fileName == 'additional-file-3') {
          parameter = 'additionalFile3Url';
        }

        let upload: {} = this.checkUploadedFiles();

        Object.keys(upload).forEach(key => {
          upload[key] = upload[key].substring(upload[key].lastIndexOf('/') + 1);
        });

        upload = { ...upload, [parameter]: name, id: this.projectId };

        this.scopeOfWorkService.updateproject(upload)
          .subscribe(res => {
            this.getUploadedFiles();
          });

      });
  }

  checkUploadedFiles() {
    for (var propName in this.uploadCategories) {
      if (!this.uploadCategories[propName] || this.uploadCategories[propName] == '') {
        delete this.uploadCategories[propName];
      }
    }
    return this.uploadCategories;
  }

  exportContractPDF() {
    const doc = new jsPDF();

    const contractPDF = this.contractPDF.nativeElement;

    var html = htmlToPdfmake(contractPDF.innerHTML);

    const documentDefinition = {
      content: [
        html
      ],
      styles: {
        body: {
          marginTop: 45,
        },
        list: {
          marginBottom: 45,
        },
        listItem: {
          marginBottom: 8
        },
        header: {
          marginBottom: 20,
          decoration: 'underline'
        },
        content: {
          marginBottom: 45,
        },
        table: {
          width: 514
        },
        signature: {
          marginTop: 45,
        }
      }
    };
    // pdfMake.createPdf(documentDefinition).open();
    pdfMake.createPdf(documentDefinition).download();
  }

  exportJunehomesPDF() {
    const doc = new jsPDF();

    const junehomesPDF = this.junehomesPDF.nativeElement;

    var html = htmlToPdfmake(junehomesPDF.innerHTML);

    const documentDefinition = {
      content: [
        html
      ],
      styles: {
        body: {
          marginTop: 45,
        },
        list: {
          marginBottom: 45,
        },
        listItem: {
          marginBottom: 8
        },
        header: {
          marginBottom: 20,
          decoration: 'underline'
        },
        content: {
          marginBottom: 45,
        },
        table: {
          width: 514
        },
        signature: {
          marginTop: 45,
        }
      }
    };
    // pdfMake.createPdf(documentDefinition).open();
    pdfMake.createPdf(documentDefinition).download();
  }

  openFile(url: string, downloadName: string) {
    let imageUrl = url;

    this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {
      this.base64Image = "data:image/jpg;base64," + base64data;

      var link = document.createElement("a");

      document.body.appendChild(link);

      link.setAttribute("href", this.base64Image);
      link.setAttribute("download", downloadName + '-' + this.projectId + ".jpg");
      link.click();
    });

  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      const img: HTMLImageElement = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = err => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx: any = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const dataURL: string = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  getFurniture() {
    this.spinner.show('furniture');
    this.scopeOfWorkService.getFurniture(this.projectId)
      .subscribe(data => {
        this.furnitures = data.roomIdAndFurniture;
        this.roomTotals = data.roomTotals;
        this.furnitureTotal = data.total;
        this.spinner.hide('furniture');
      });
  }

  changeFurnitureStatus(furnitureId: number, status: string, roomId: any) {
    this.scopeOfWorkService.changeFurnitureStatus(this.projectId, status, roomId, furnitureId)
      .subscribe(res => {
        this.getFurniture();
        this.getQuote();
      });
  }

  changeScopeStatus(ScopeOfWorkId: number, status: string, roomId: any) {
    this.spinner.show('status');
    this.scopeOfWorkService.changeScopeStatus(this.projectId, status, roomId, ScopeOfWorkId)
      .subscribe(res => {
        this.getScopeOfWork();
        this.getQuote();
      });
  }

  confirmProject() {
    let scopeIdArray: any = [];
    Object.values(this.scopesOfWorkRooms).forEach((scope: any) => {
      if (scope.isAssignedToProject) {
        scopeIdArray.push(scope);
      }
    });

    let scopesObject: any = {};
    Object.keys(this.scopesOfWork).forEach(key => {
      Object.values(scopeIdArray).forEach((selected: any) => {
        Object.values(this.scopesOfWork[key]).forEach((element: any) => {
          if (element.isAssignedToProject) {
            if (element.id == selected.id) {
              if (scopesObject.hasOwnProperty(key)) {
                if (scopesObject[key].includes(selected.id)) {
                  console.log();
                } else {
                  scopesObject[key].push(selected.id);
                }
              } else {
                scopesObject = { ...scopesObject, [key]: [selected.id] };
              }
            }
          }
        });
      });
    });
    Swal.fire({
      title: 'Are you sure?',
      text: "Your project will be visible!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, confirm it!'
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.scopeOfWorkService.confirmProject(this.projectId, scopesObject)
            .subscribe(res => {
              this.router.navigate(['/profile']);
              Swal.fire(
                'Confirmed!',
                'Your project has been confirmed.',
                'success'
              )
            });
        }
      });
  }

  acceptProject() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Project will be accepted!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, accept it!'
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.scopeOfWorkService.acceptProject(this.projectId)
            .subscribe(res => {
              this.router.navigate(['/profile/projects']);
              Swal.fire(
                'Accepted!',
                'Project has been successfully accepted.',
                'success'
              )
            });
        }
      });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
