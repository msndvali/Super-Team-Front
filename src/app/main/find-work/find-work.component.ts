import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FindWorkService } from '../shared/services/find-work.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-find-work',
  templateUrl: './find-work.component.html',
  styleUrls: ['./find-work.component.scss']
})
export class FindWorkComponent implements OnInit {
  findWorkSearchForm: FormGroup;

  loadingSpinner: string = 'loading';
  noData: boolean = false;
  projects: any[] = [];

  pageNumber: number = 1;
  pageSize: number = 12;

  viewMore: boolean = false;
  noMoreData: boolean = false;

  constructor(
    private findWorkService: FindWorkService,
    private spinner: NgxSpinnerService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.findWorkSearchForm = new FormGroup({
      term:  new FormControl(''),
      city:  new FormControl(''),
      startDate:  new FormControl('0001-01-01T00:00:00Z'),
    });
    this.getProjects('custom');
  }

  getProjects(type: string) {
    if(type == 'search') {
      this.projects = [];
    }
    this.spinner.show('loading');
    let term = this.findWorkSearchForm?.value.term;
    let city = this.findWorkSearchForm?.value.city;
    let startDate = this.findWorkSearchForm?.value.startDate;
    if(this.findWorkSearchForm?.value.startDate) {
      let date = new Date(this.findWorkSearchForm?.value.startDate);
      startDate = date.toISOString();
    }
    this.findWorkService.getProjects(term, city, startDate, this.pageNumber, this.pageSize)
      .subscribe(data => {
        this.pageNumber += 1;
        this.viewMore = true;
        let countData = 0;
        Object.values(data.projects).forEach(project => {
          countData++;
          this.projects.push(project);
        });
        if(countData < 12) {
          this.viewMore = false;
        }
        if(countData == 0) {
          this.viewMore = false;
          if (type == 'load-more') {
            this.noMoreData = true;
          }
        }
        this.spinner.hide('loading');
        if(this.projects.length == 0) {
          this.noData = true;
        } else {
          this.noData = false;
        }
      });
  }

  redirectToScopeOfWork(id: number) {
    this.router.navigate(['profile', 'scope-of-work', id]);
  }

  getProjectEndDate(startDate: Date, length: number) {
    var parsedDate = new Date(startDate);
    parsedDate.setDate(parsedDate.getDate() + length);
    return parsedDate;
  }

  loadMore() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      this.viewMore = false;
      this.spinner.hide();
    }, 3000);
  }

}
