import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TimesheetService } from '../../shared/services/timesheet.service';
import { NgxSpinnerService } from 'ngx-spinner';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit, OnDestroy {
  private routeSub: Subscription;
  projectId: number;
  timesheetSearchForm: FormGroup;

  project: any = [];
  totalArea: any;

  timesheetList: any = [];

  usersList: any[] = [];
  role: string;
  userId: string;

  pageNumber: number = 1;
  pageSize: number = 15;

  noData: boolean = false;
  viewMore: boolean = false;
  noMoreData: boolean = false;

  timesheetSpinner: string = 'timesheet';

  constructor(
    private route: ActivatedRoute,
    private timesheetService: TimesheetService,
    private spinner: NgxSpinnerService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.projectId = +params['id'];
    });

    const token = localStorage.getItem('JwtToken');
    const tokenInfo = this.getDecodedAccessToken(token);
    this.role = tokenInfo.extension_Role;
    this.userId = tokenInfo.oid;

    this.getProject();

    this.timesheetSearchForm = new FormGroup({
      dateFrom: new FormControl(formatDate(new Date(),'yyyy-MM-dd','en')),
      dateTo: new FormControl(formatDate(new Date().setDate(new Date().getDate() + 7),'yyyy-MM-dd','en')),
      userId: new FormControl(this.userId)
    });

    this.timesheetService.getUsers()
      .subscribe(usersData => {
        let users: any = [];
        Object.values(usersData).forEach((user: any) => {
          users.push({ name: user.givenName + ' ' + user.surname, id: user.id });
        });
        this.usersList = users;
      });

    this.getTimesheet(this.timesheetSearchForm.value, 'custom');
  }

  ngAfterViewInit() {
    document.querySelectorAll("ng-select input").forEach(function(el) {
      el.setAttribute("autocomplete", "chrome-off")
    })
  }

  getDecodedAccessToken(token: any): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }

  goBackToProject(id: number) {
    this.router.navigate(['profile', 'projects', id]);
  }

  getProject() {
    this.spinner.show('loading');
    this.timesheetService.getProject(this.projectId)
      .subscribe(res => {
        this.project = res.project;
        this.totalArea = res.project.property.totalArea;
        this.spinner.hide('loading');
      });
  }

  getTimesheet(formData: any, type: string) {
    if(type == 'search') {
      this.timesheetList = [];
    }
    this.spinner.show('timesheet');

    let pageNumber = this.pageNumber;
    let pageSize = this.pageSize;
    let projectId = this.projectId;

    let timeSheet = { ...this.timesheetSearchForm.value, pageNumber, pageSize, projectId }

    this.timesheetService.getTimesheet(timeSheet)
      .subscribe(data => {

        if(type == 'load-more') {
          this.pageNumber += 1;
        } else {
          this.pageNumber = 1;
        }
        this.viewMore = true;
        let countData = 0;
        Object.values(data.timeSheet).forEach(timesheet => {
          countData++;
          this.timesheetList.push(timesheet);
        });
        if(countData < 15) {
          this.viewMore = false;
        }
        if(countData == 0) {
          this.viewMore = false;
          if (type == 'load-more') {
            this.noMoreData = true;
          }
        }
        this.spinner.hide('timesheet');
        if(this.timesheetList.length == 0) {
          this.noData = true;
        } else {
          this.noData = false;
        }
      });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
