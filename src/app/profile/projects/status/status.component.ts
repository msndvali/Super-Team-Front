import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectsStatusService } from 'src/app/profile/shared/services/projects-status.service';
import { ExpensesModel } from '../../shared/models/expenses.model';
import { WorkHoursModel } from '../../shared/models/work-hours.model';
import Swal from 'sweetalert2';
import { Observable, Observer, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { Guid } from 'guid-typescript';
import { QuoteService } from '../../shared/services/quote.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit, OnDestroy {
  private routeSub: Subscription;
  projectId: number;

  public expenseCheckName: Guid;
  fileValidation: string;
  currentExpense: string;

  projectNumber: number;
  projectStatus: string;

  addWorkHoursWorkersForm: FormGroup;
  workHoursForm: FormGroup;
  expensesForm: FormGroup;

  workHoursCreate: boolean;
  workHoursCreateStatus: boolean;
  workHoursUsers: boolean = false;
  workHoursStartCreate: any;
  workHoursStartUpdate: any;
  workHoursEnd: any;
  isCreatingStart: boolean;
  isCreatingEnd: boolean;
  expenseCreate: boolean;

  timesheetsList: any = [];
  totalDeliveryHours: number = 0;
  totalHandsOnHours: number = 0;
  expensesList: any = [];
  expenseTypes: any = [];
  expensesTotal: number = 0;

  workHours: any;
  workHoursId: number;

  timesheetUpdateId: number;

  checkSpinner: string = 'check';
  timesheetSpinner: string = 'timesheet';
  expensesSpinner: string = 'expenses';
  uploadSpinner: string = 'upload';

  weekDays: any = [];

  users: any = [];
  role: string;
  userId: string;
  userName: string;
  assignedUsers: any = [];

  workHoursModel: WorkHoursModel;
  expensesModel: ExpensesModel;

  maxTime: any;

  currentDate = new Date();
  currentISOStringDate: any;

  public animation: boolean = true;
  public multiple: boolean = false;

  private filesControl = new FormControl(null, FileUploadValidators.filesLimit(2));

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

  calculatedData: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsStatusService: ProjectsStatusService,
    private quoteService: QuoteService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.currentISOStringDate = this.currentDate.toISOString();
    this.routeSub = this.route.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    const token = localStorage.getItem('JwtToken');
    if (!token) {
      return;
    }
    this.spinner.show('check');
    this.projectsStatusService.getProject(this.projectId)
      .subscribe(data => {
        this.projectsStatusService.getOrganizationId()
          .subscribe(org => {
            if(data.project.organizationId != org.organization.id) {
              this.router.navigate(['/home']);
              this.spinner.hide('check');
              return;
            }
            this.spinner.hide('check');
          });
        this.projectNumber = data.project.projectNumber;
        this.projectStatus = data.project.statusName;
      });

    const tokenInfo = this.getDecodedAccessToken(token);
    this.role = tokenInfo.extension_Role;
    this.userId = tokenInfo.oid;
    this.userName = tokenInfo.family_name + ' ' + tokenInfo.given_name;

    this.projectsStatusService.getUsers()
      .subscribe(users => {
        this.users = users;
      });

    this.quoteService.getQuote(this.projectId)
      .subscribe(res => {
        this.calculatedData = res.quote;
      });

    this.getTimesheet();
    this.getExpenses();
    this.getExpenseTypes();

    let curr = new Date;
    for(let i=0; i<=8; i++) {
      let firstDay = new Date(curr.setDate(curr.getDate() - curr.getDay() + i));
      firstDay.setHours(1,0,0,0);
      this.weekDays.push(firstDay.toISOString());
    }

    this.getUploadedFiles();

    const datePipe = new DatePipe('en-Us');
    this.workHoursStartCreate = datePipe.transform(new Date(), 'h:mm a');

    const datePipe2 = new DatePipe('en-Us');
    this.workHoursEnd = datePipe2.transform(new Date(), 'h:mm a');

    this.workHoursModel = new WorkHoursModel();
    this.expensesModel = new ExpensesModel();

    this.addWorkHoursWorkersForm = new FormGroup({
      workerId:  new FormControl(null),
    });

    this.workHoursForm = new FormGroup({
      userId: new FormControl(null),
      categoryId: new FormControl(null),
      date: new FormControl(null),
      hours: new FormControl(null),
      start: new FormControl(null),
      end: new FormControl(null),
    });

    this.expensesForm = new FormGroup({
      updateId: new FormControl(null),
      userId: new FormControl(null),
      expenseTypeId: new FormControl(null),
      cost: new FormControl(null),
      date: new FormControl(null),
      files: this.filesControl
    });
  }

  getDecodedAccessToken(token: any): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }

  openTotalsModal(totals: any) {
    this.modalService.open(totals, { centered: true });
  }

  completeProject() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, complete it!'
    })
    .then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Completed!',
          'Your project has been completed.',
          'success'
        )
      }
    });
  }

  redirectToScopeOfWork(id: number) {
    this.router.navigate(['profile', 'scope-of-work', id]);
  }

  ///// Adding Work Hours Users /////
  submitAddingWorkHoursUsers() {
    let workerId = this.addWorkHoursWorkersForm.value.workerId;

    Object.values(this.users).forEach((user: any) => {
      if(user.id == workerId) {
        let fullName = user.givenName + ' ' + user.surname;

        this.projectsStatusService.AddWorkHoursUsers(workerId, fullName, this.projectId)
          .subscribe(res => {
            this.addWorkHoursWorkersForm.reset();
            this.modalService.dismissAll();
            this.getTimesheet();
          });
      }
    })
  }
  ///// End of Adding Work Hours Users /////

  ///// Start Timesheet /////
  getTimesheet() {
    this.spinner.show('timesheet');
    this.projectsStatusService.getTimesheet(this.projectId)
      .subscribe(data => {

        let tempTimesheetsListArray: any = [];
        if (data.timeSheet) {
          Object.values(data.timeSheet).forEach((item: any) => {
            let handsOnTime: number = 0;
            let deliveryTime: number = 0;
            if(item.timeSheet) {
              Object.values(item.timeSheet).forEach((time: any) => {
                if(time.categoryId == 1) {
                  handsOnTime += time.hoursWorked;
                } else if(time.categoryId == 2) {
                  deliveryTime += time.hoursWorked;
                }
              });
            }
            item = { ...item, handsOnTime, deliveryTime };
            tempTimesheetsListArray.push(item);
          });
        }
        this.timesheetsList = tempTimesheetsListArray;

        this.totalDeliveryHours = data.totalDeliveryHours.toFixed(2);
        this.totalHandsOnHours = data.totalHandsOnHours.toFixed(2);
        if(this.role == 'leader') {
          this.projectsStatusService.getUsers()
            .subscribe(users => {
              if(this.timesheetsList.length > 0) {
                let tempTimesheet: any = [];
                let tempUsers: any = [];
                if(true) {
                  Object.values(this.timesheetsList).forEach((timesheet: any) => {
                    tempTimesheet.push(timesheet.workerId);
                  });
                  Object.values(users).forEach((user: any) => {
                    tempUsers.push(user.id);
                  });
                }
                const res = tempUsers.filter((f) => !tempTimesheet.includes(f));
                res.forEach(element => {
                  Object.values(users).forEach((user: any) => {
                    if(element == user.id) {
                      this.assignedUsers.push(user);
                    }
                  });
                });
              } else {
                Object.values(users).forEach((user: any) => {
                  this.assignedUsers.push(user);
                });
              }
            });
        }

        this.spinner.hide('timesheet');
      });
  }

  addWorkHours(hours: any) {
    this.workHoursForm.reset();
    this.isCreatingStart = true;
    this.isCreatingEnd = true;
    this.workHoursStartCreate = null;
    this.workHoursStartUpdate = null;
    this.workHoursEnd = null;
    if(this.role == 'worker') {
      const date = new Date().setHours(10,0,0,0);
      let now = new Date();
      let hours = ("0" + now.getHours()).slice(-2);
      let minutes = ("0" + now.getMinutes()).slice(-2);
      let str = hours + ':' + minutes;
      this.workHoursStartCreate = str;
      this.workHoursForm.patchValue({
        userId: this.userId,
        date: new Date(date).toISOString().substring(0,10)
      });
      this.workHoursCreate = false;
    } else {
      let now = new Date();
      let hours = ("0" + now.getHours()).slice(-2);
      let minutes = ("0" + now.getMinutes()).slice(-2);
      let str = hours + ':' + minutes;
      this.workHoursStartCreate = str;
      this.workHoursCreate = true;
    }
    this.workHoursCreateStatus = true;
    this.modalService.open(hours, { centered: true });
  }

  checkSelectedUser(value: string) {
    if(value == this.userId) {
      const date = new Date().setHours(10,0,0,0);
      let now = new Date();
      let hours = ("0" + now.getHours()).slice(-2);
      let minutes = ("0" + now.getMinutes()).slice(-2);
      let str = hours + ':' + minutes;
      this.workHoursStartCreate = str;
      this.workHoursForm.patchValue({
        date: new Date(date).toISOString().substring(0,10),
      });
      this.workHoursCreate = false;
      this.workHoursUsers = true;
    } else {
      this.workHoursCreate = true;
      this.workHoursUsers = false;
    }
  }

  startTimeChanged() {
    this.workHoursForm.patchValue({
      end: null,
      hours: null
    });

    this.workHoursEnd = this.workHoursForm.value.start;
  }

  calculateHours() {
    let convertedStartTime: any = this.convertTime12to24(this.workHoursForm.value.start);
    let convertedEndTime: any = this.convertTime12to24(this.workHoursForm.value.end);

    let startTime = this.split(convertedStartTime);
    let endTIme = this.split(convertedEndTime);

    if(startTime && endTIme) {
      let totalHours: any;
      if (startTime < endTIme) {
        totalHours = Math.round(((endTIme-startTime) / 60) * 100) / 100;
      }
      this.workHoursForm.patchValue({
        hours: totalHours
      });
    }
  }

  split(time) {
    var t = time.split(":");
    let tt: any = t[0] * 60;
    return parseInt((tt), 10) + parseInt(t[1], 10);
  }

  convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(" ");

    let [hours, minutes] = time.split(":");

    if (hours === "12") {
      hours = "00";
    }

    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  };

  submitWorkHours() {
    let hours = this.workHoursForm.value.hours;

    let date = this.workHoursForm.value.date;

    let convertedStartTime = this.convertTime12to24(this.workHoursForm.value.start);
    let tempStart = convertedStartTime.substring(0, convertedStartTime.indexOf(":"));
    if(tempStart.length == 1) {
      var startHour = +'0' + tempStart;
      var startMinute = convertedStartTime.slice(2);
    } else {
      var startHour = convertedStartTime.slice(0, 2);
      var startMinute = convertedStartTime.slice(3);
    }

    let start = new Date(date);

    start.setHours(+startHour,+startMinute,1,0);
    let startDate = start.toISOString();

    let convertedEndTime = this.convertTime12to24(this.workHoursForm.value.end);
    let tempEnd = convertedEndTime.substring(0, convertedEndTime.indexOf(":"));
    if(tempEnd.length == 1) {
      var endHour = +'0' + tempEnd;
      var endMinute = convertedEndTime.slice(2);
    } else {
      var endHour = convertedEndTime.slice(0, 2);
      var endMinute = convertedEndTime.slice(3);
    }
    let end = new Date(date);
    end.setHours(+endHour,+endMinute,1,0);
    let endDate = end.toISOString();

    let categoryId = this.workHoursForm.value.categoryId;

    let userId = this.workHoursForm.value.userId;

    Object.values(this.users).forEach((user: any) => {
      if(user.id == userId) {
        let fullName = user.givenName + ' ' + user.surname;
        this.projectsStatusService.addWorkHours(hours, startDate, endDate, categoryId, userId, fullName, this.projectId)
          .subscribe(res => {
            this.workHoursForm.reset();
            this.modalService.dismissAll();
            this.getTimesheet();
          });
      }
    });
  }

  passWorkHours(hours: any, id: any) {
    this.workHours = hours;
    this.workHoursId = id;
  }

  openWorkHoursModal(hours: any, id: any) {
    this.workHoursForm.reset();
    this.isCreatingStart = false;
    this.isCreatingEnd = false;
    this.workHoursCreate = false;
    this.workHoursCreateStatus = false;
    this.workHoursStartCreate = null;
    this.workHoursStartUpdate = null;
    this.workHoursEnd = null;
    Object.values(this.timesheetsList).forEach((workHours: any) => {
      Object.values(workHours.timeSheet).forEach((hours: any) => {
        if(hours.id == id) {
          let startHour = hours.startTime.slice(11, 16);
          let endHour = hours.endTime.slice(11, 16);
          const date = new Date(hours.startTime).setHours(10,0,0,0);
          this.workHoursForm.patchValue({
            userId: workHours.workerId,
            categoryId: hours.categoryId,
            date: new Date(date).toISOString().substring(0,10),
            hours: hours.hoursWorked,
            start: startHour,
            end: endHour,
          });
        }
      });
    });
    this.timesheetUpdateId = id;
    this.modalService.open(hours, { centered: true });
  }

  updateWorkHours() {
    let hours = this.workHoursForm.value.hours;

    let date = this.workHoursForm.value.date;

    let convertedStartTime = this.convertTime12to24(this.workHoursForm.value.start);
    let tempStart = convertedStartTime.substring(0, convertedStartTime.indexOf(":"));
    if(tempStart.length == 1) {
      var startHour = +'0' + tempStart;
      var startMinute = convertedStartTime.slice(2);
    } else {
      var startHour = convertedStartTime.slice(0, 2);
      var startMinute = convertedStartTime.slice(3);
    }

    let start = new Date(date);

    start.setHours(+startHour,+startMinute,1,0);
    let startDate = start.toISOString();

    let convertedEndTime = this.convertTime12to24(this.workHoursForm.value.end);
    let tempEnd = convertedEndTime.substring(0, convertedEndTime.indexOf(":"));
    if(tempEnd.length == 1) {
      var endHour = +'0' + tempEnd;
      var endMinute = convertedEndTime.slice(2);
    } else {
      var endHour = convertedEndTime.slice(0, 2);
      var endMinute = convertedEndTime.slice(3);
    }

    let end = new Date(date);
    end.setHours(+endHour,+endMinute,1,0);
    let endDate = end.toISOString();

    let userId = this.workHoursForm.value.userId;
    Object.values(this.users).forEach((user: any) => {
      if(user.id == userId) {
        this.projectsStatusService.updateWorkHours(hours, startDate, endDate, this.timesheetUpdateId)
          .subscribe(res => {
            this.workHoursForm.reset();
            this.modalService.dismissAll();
            this.getTimesheet();
          });
      }
    });
  }

  deleteWorkHours(id: number) {
    Swal.fire({
      title: 'Are you sure want to delete?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ff5f5f',
      cancelButtonColor: '#CECECE',
      confirmButtonText: 'Yes, delete it!'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.projectsStatusService.deleteWorkHours(id)
          .subscribe(del => {
            this.getTimesheet();
            Swal.fire(
              'Completed!',
              'successfully deleted.'
            );
          });
      }
    });
  }
  ///// End Timesheet /////

  ///// Start Expenses /////
  getExpenses() {
    this.spinner.show('expenses');
    this.expensesTotal = 0;
    this.projectsStatusService.getExpenses(this.projectId)
      .subscribe(data => {
        this.expensesList = data.expenses;
        Object.values(this.expensesList).forEach((expense: any) => {
          this.expensesTotal += expense.cost;
        });
        this.spinner.hide('expenses');
      });
  }

  getExpenseTypes() {
    this.projectsStatusService.getExpenseTypes()
      .subscribe(types => {
        this.expenseTypes = types.expenseTypes;
      })
  }

  openAddExpensesModal(expenses: any) {
    this.expensesForm.reset();
    this.expenseCreate = true;
    this.modalService.open(expenses, { centered: true, windowClass: 'add-exp' });
  }

  addExpenses() {
    let fileName: any;
    if(!this.expensesForm.value.files) {
      this.fileValidation = 'Please Attach Check';

    } else {
      this.expenseCheckName = Guid.create();
      fileName = this.expenseCheckName.toString();
      const file = this.expensesForm.value.files[0];
      const formData = new FormData();
      formData.append('file', file, fileName);

      this.projectsStatusService.addFiles(formData, 'expense')
        .subscribe(res => {
          let category = +this.expensesForm.value.expenseTypeId;
          let cost = this.expensesForm.value.cost;
          let date = new Date(this.expensesForm.value.date);
          let isoStringDate = date.toISOString();
          let userId = this.expensesForm.value.userId;
          Object.values(this.users).forEach((user: any) => {
            if(user.id == userId) {
              let fullName = user.givenName + ' ' + user.surname;
              this.projectsStatusService.addExpenses(category, cost, isoStringDate, userId, fullName, this.projectId, fileName)
                .subscribe(res => {
                  this.modalService.dismissAll();
                  this.getExpenses();
                });
            }
          });
        });
    }
  }

  openUpdateExpensesModal(expenses: any, id: number) {
    this.expensesForm.reset();
    this.expenseCreate = false;
    Object.values(this.expensesList).forEach((expense: any) => {
      if(expense.id = id) {
        const date = new Date(expense.date).setHours(10,0,0,0);
        this.currentExpense = expense.checkUrl;
        this.expensesForm.patchValue({
          updateId: id,
          userId: expense.receiptHolderId,
          expenseTypeId: expense.expenseTypeId,
          cost: expense.cost,
          date: new Date(date).toISOString().substring(0,10)
        });
      }
    });

    this.modalService.open(expenses, { centered: true, windowClass: 'add-exp' });
  }

  updateExpenses() {
    if(!this.expensesForm.value.files) {
      let updateId = +this.expensesForm.value.updateId;
      let category = +this.expensesForm.value.expenseTypeId;
      let cost = this.expensesForm.value.cost;
      let date = new Date(this.expensesForm.value.date);
      let isoStringDate = date.toISOString();
      let userId = this.expensesForm.value.userId;
      Object.values(this.users).forEach((user: any) => {
        if(user.id == userId) {
          let fullName = user.givenName + ' ' + user.surname;

          this.projectsStatusService.updateExpenses(category, cost, isoStringDate, userId, fullName, updateId, this.currentExpense)
            .subscribe(res => {
              this.expensesForm.reset();
              this.modalService.dismissAll();
              this.getExpenses();
            });
        }
      });
    } else {
      const file = this.expensesForm.value.files[0];
      const formData = new FormData();
      formData.append('file', file, this.currentExpense);

      this.projectsStatusService.addFiles(formData, 'expense')
        .subscribe(res => {
          let updateId = +this.expensesForm.value.updateId;
          let category = +this.expensesForm.value.expenseTypeId;
          let cost = this.expensesForm.value.cost;
          let date = new Date(this.expensesForm.value.date);
          let isoStringDate = date.toISOString();
          let userId = this.expensesForm.value.userId;
          Object.values(this.users).forEach((user: any) => {
            if(user.id == userId) {
              let fullName = user.givenName + ' ' + user.surname;

              this.projectsStatusService.updateExpenses(category, cost, isoStringDate, userId, fullName, updateId, this.currentExpense)
                .subscribe(res => {
                  this.expensesForm.reset();
                  this.modalService.dismissAll();
                  this.getExpenses();
                });
            }
          });
        });
    }
  }

  deleteExpenses(id: string) {
    Swal.fire({
      title: 'Are you sure want to delete?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ff5f5f',
      cancelButtonColor: '#CECECE',
      confirmButtonText: 'Yes, delete it!'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.projectsStatusService.deleteExpenses(id)
          .subscribe(del => {
            this.getExpenses();
            Swal.fire(
              'Completed!',
              'successfully deleted.'
            );
          });
      }
    });
  }
  ///// End Expenses /////

  ///// Start Uploads /////
  getUploadedFiles() {
    this.spinner.show('upload');
    this.projectsStatusService.getProject(this.projectId)
      .subscribe(data => {
        const project = data.project;
        const defaultPath = 'https://superteam.blob.core.windows.net/';

        if(project.accessVideoUrl) {
          this.uploadCategories.accessVideoUrl = defaultPath + 'videos/' + project.accessVideoUrl;
        }
        if(project.garbageVideoUrl) {
          this.uploadCategories.garbageVideoUrl = defaultPath + 'videos/'  + project.garbageVideoUrl;
        }
        if(project.mailboxPhotoUrl) {
          this.uploadCategories.mailboxPhotoUrl = defaultPath + 'images/'  + project.mailboxPhotoUrl;
        }
        if(project.routerPhotoUrl) {
          this.uploadCategories.routerPhotoUrl = defaultPath + 'images/'  + project.routerPhotoUrl;
        }
        if(project.electricSwitchboxPhotoUrl) {
          this.uploadCategories.electricSwitchboxPhotoUrl = defaultPath + 'images/'  + project.electricSwitchboxPhotoUrl;
        }
        if(project.additionalFile1Url) {
          this.uploadCategories.additionalFile1Url = defaultPath + 'document/'  + project.additionalFile1Url;
        }
        if(project.additionalFile2Url) {
          this.uploadCategories.additionalFile2Url = defaultPath + 'document/'  + project.additionalFile2Url;
        }
        if(project.additionalFile3Url) {
          this.uploadCategories.additionalFile3Url = defaultPath + 'document/'  + project.additionalFile3Url;
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

    this.projectsStatusService.addFiles(formData, 'document')
      .subscribe(res => {
        const path = res.path;

        let parameter;

        if(fileName == 'additional-file-1') {
          parameter = 'additionalFile1Url';
        }
        else if(fileName == 'additional-file-2') {
          parameter = 'additionalFile2Url';
        }
        else if(fileName == 'additional-file-3') {
          parameter = 'additionalFile3Url';
        }

        let upload: {} = this.checkUploadedFiles();

        Object.keys(upload).forEach(key => {
          upload[key] = upload[key].substring(upload[key].lastIndexOf('/') + 1);
        });

        upload = { ...upload, [parameter]: name, id: this.projectId };

        this.projectsStatusService.updateproject(upload)
          .subscribe(res => {
            this.getUploadedFiles();
          });

      });
  }

  onFileChanged(event: any, value: string, source: string) {
    const files = event.target.files;
    if (files.length === 0)
      return;

    const name = value + '-' + this.projectId;

    const formData = new FormData();
    formData.append('file', files[0], name);

    this.projectsStatusService.addFiles(formData, source)
      .subscribe(res => {
        const path = res.path;

        let parameter;

        if(value == 'access-video') {
          parameter = 'accessVideoUrl';
        }
        else if(value == 'garbage-video') {
          parameter = 'garbageVideoUrl';
        }
        else if(value == 'mailbox-photo') {
          parameter = 'mailboxPhotoUrl';
        }
        else if(value == 'router-photo') {
          parameter = 'routerPhotoUrl';
        }
        else if(value == 'electric-switchbox-photo') {
          parameter = 'electricSwitchboxPhotoUrl';
        }

        let upload: {} = this.checkUploadedFiles();

        Object.keys(upload).forEach(key => {
          upload[key] = upload[key].substring(upload[key].lastIndexOf('/') + 1);
        });

        upload = { ...upload, [parameter]: name, id: this.projectId };

        this.projectsStatusService.updateproject(upload)
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

  openFile(url: string, downloadName: string) {
    let imageUrl = url;

    this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {
      this.base64Image = "data:video/mp4;base64," + base64data;

      var link = document.createElement("a");

      document.body.appendChild(link);

      link.setAttribute("href", this.base64Image);
      link.setAttribute("download", downloadName + '-' + this.projectId + ".mp4");
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
  ///// End Uploads /////

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
