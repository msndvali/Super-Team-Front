import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileService } from './shared/services/profile.service';

import jwt_decode from 'jwt-decode';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    )
  ],
})
export class ProfileComponent implements OnInit {
  loadInfo: boolean = false;

  name: string;
  email: string;
  address: string;
  role: string;
  userId: string;

  uploadedProfile: any;
  img: any;

  imagePath: any;
  message: any;
  url: any;

  verifyFirstSpinner: string = 'isVerifiedFirst';
  verifySecondSpinner: string = 'isVerifiedSecond';
  verifyThirdSpinner: string = 'isVerifiedThird';

  verifyUploads: any = {
    isVerifiedFirst: 'normal',
    isVerifiedSecond: 'normal',
    isVerifiedThird: 'normal'
  };

  checkUploads: any = {
    isVerifiedFirst: false,
    isVerifiedSecond: false,
    isVerifiedThird: false
  };

  organizationId: number;
  organizationName: string;
  isVerified: boolean = false;

  uploadCategories: any = {
    insuranceDocumentUrl: '',
    workerCompensationDocumentUrl: '',
    generalLiabilityDocumentUrl: ''
  }

  constructor(
    private modalService: NgbModal,
    private profileService: ProfileService,
    private spinner: NgxSpinnerService,
    ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('JwtToken');
    if (!token) {
      return;
    }
    const tokenInfo = this.getDecodedAccessToken(token);
    this.name = tokenInfo.given_name + ' ' + tokenInfo.family_name;
    this.email = tokenInfo.emails[0];
    this.address = tokenInfo.postalCode;
    this.role = tokenInfo.extension_Role;
    this.userId = tokenInfo.oid;

    if(this.role == 'leader') {
      this.getOrganization();
    } else {
      this.loadInfo = true;
    }

  }

  getDecodedAccessToken(token: any): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }

  getOrganization() {
    this.profileService.getOrganizationId()
      .subscribe(data => {
        let org = data.organization;
        this.organizationId = org.id;
        this.isVerified = org.isVerified;
        this.organizationName = org.title;

        const defaultPath = 'https://superteam.blob.core.windows.net/documents/';

        if(org.insuranceDocumentUrl) {
          this.uploadCategories.insuranceDocumentUrl = defaultPath + org.insuranceDocumentUrl;
        }
        if(org.workerCompensationDocumentUrl) {
          this.uploadCategories.workerCompensationDocumentUrl = defaultPath + org.workerCompensationDocumentUrl;
        }
        if(org.generalLiabilityDocumentUrl) {
          this.uploadCategories.generalLiabilityDocumentUrl = defaultPath + org.generalLiabilityDocumentUrl;
        }
        this.loadInfo = true;
      });
  }

  openChooseImage(choose: any) {
    this.modalService.open(choose, { centered: true, windowClass: 'choose-image' });
  }

  viewUploadedImage(event) {
    const files = event.target.files;
    if (files.length === 0)
      return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    this.uploadedProfile = event;

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
    }
  }

  onFileChanged(event) {
    const files = event.target.files;
    if (files.length === 0)
      return;

    const formData = new FormData();
    formData.append('file', files[0], this.userId);

    this.profileService.addImage(formData)
      .subscribe(res => {
        window.location.reload();
        this.modalService.dismissAll();
      });
  }

  openVerificationUpload(verify: any) {
    this.modalService.open(verify, { centered: true, windowClass: 'verify-upload' });
  }

  verifyFileChanged(event, name: string, value: string, source: string) {
    const files = event.target.files;
    if (files.length === 0)
      return;

    this.verifyUploads[name] = 'sending';

    this.spinner.show(name);
    const formData = new FormData();
    formData.append('file', files[0], source + '-' + this.organizationId);

    this.profileService.addFile(formData)
      .subscribe(res => {
        let upload: {} = this.checkUploadedFiles();

        Object.keys(upload).forEach(key => {
          upload[key] = upload[key].substring(upload[key].lastIndexOf('/') + 1);
        });

        upload = { ...upload, [value]: source + '-' + this.organizationId, id: this.organizationId };

        this.profileService.updateOrganizarion(upload)
          .subscribe(res => {
            this.spinner.hide(name);
            this.verifyUploads[name] = 'normal';
            this.checkUploads[name] = true;
            setTimeout(() => {
              this.checkUploads[name] = false;
            }, 3000);
            this.getOrganization();
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

}
