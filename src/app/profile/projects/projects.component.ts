import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectsService } from '../shared/services/projects.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects: any = [];

  loadingSpinner: string = 'loading';
  noData: boolean = false;

  role: string;

  viewMore: boolean = true;

  constructor(
    private projectsService: ProjectsService,
    private spinner: NgxSpinnerService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    this.spinner.show('loading');
    const token = localStorage.getItem('JwtToken');
    if (!token) {
      return;
    }
    const tokenInfo = this.getDecodedAccessToken(token);
    this.role = tokenInfo.extension_Role;

    if (this.role == 'worker') {
      this.projectsService.getOrganizationId()
        .subscribe(id => {
          this.projectsService.getWorkerProjects(id.organization.id)
            .subscribe(data => {
              this.projects = data.projects;
              this.spinner.hide('loading');
              if(this.projects.length == 0) {
                this.noData = true;
              }
            });
        });
    } else if (this.role == 'leader') {
      this.projectsService.getOrganizationId()
        .subscribe(id => {
          this.projectsService.getLeaderProjects(id.organization.id)
            .subscribe(data => {
              this.projects = data.projects;
              this.spinner.hide('loading');
              if(this.projects.length == 0) {
                this.noData = true;
              }
            });
        });
    } else {
      this.projectsService.getUserProjects()
        .subscribe(data => {
          this.projects = data.projects;
          this.spinner.hide('loading');
          if(this.projects.length == 0) {
            this.noData = true;
          }
        });
    }
  }

  getDecodedAccessToken(token: any): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }

  getProjectEndDate(startDate: Date, length: number) {
    var parsedDate = new Date(startDate);
    parsedDate.setDate(parsedDate.getDate() + length);
    return parsedDate;
  }

  getColor(id): any {
    switch (id) {
      case 1:
        return '#d9534f';
      case 2:
        return '#f0ad4e';
      case 3:
        return '#0275d8';
      case 4:
        return '#5cb85c';
    }
  }

  openProject(id: number) {
    if(this.role == 'customer') {
      this.router.navigate(['profile', 'scope-of-work', id]);
    } else {
      this.router.navigate(['profile', 'projects', id]);
    }
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
