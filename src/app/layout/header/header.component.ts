import { Component, OnInit, HostListener } from '@angular/core';
import { B2CService } from 'src/app/auth/shared/services/b2c.service';
import jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SignalRService } from 'src/app/signalr/signalr.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isScrolled = false;
  loginDisplay = false;
  role: string;
  userId: string;

  notificationCount: number;

  isVerified: boolean = false;

  img: any;

  isHamburgerActive: boolean = false;

  @HostListener("window:scroll")

  scrollEvent() {
    window.pageYOffset >= 1 ? (this.isScrolled = true) : (this.isScrolled = false);
  }

  constructor(
    private b2cService: B2CService,
    private signalRService: SignalRService,
    private http: HttpClient
    ) {}

  ngOnInit(): void {
    this.setLoginDisplay();
    this.signalRService.unreadNotificationCount.subscribe(count => this.notificationCount = count);
  }

  setLoginDisplay() {
    this.b2cService.loginDisplay
      .subscribe(res => {
        if(res) {
          this.loginDisplay = res;

          const token = localStorage.getItem('JwtToken');
          if (!token) {
            return;
          }
          const tokenInfo = this.getDecodedAccessToken(token);
          this.role = tokenInfo.extension_Role;
          this.userId = tokenInfo.oid;

          if(this.role == 'leader') {
            if (!token) {
              return;
            }
            this.getOrganization()
              .subscribe(data => {
                this.isVerified = data.organization.isVerified;
              });
          }
        }
      });
  }

  getDecodedAccessToken(token: any): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }

  getOrganization(): Observable<any> {
    return this.http.get<any>(`${environment.ApiUrl}Organization`)
  }

  login() {
    this.b2cService.login();
  }

  signUp() {
    this.b2cService.signUp();
  }

  logout() {
    this.b2cService.logout();
  }

  hamburgerActive() {
    this.isHamburgerActive = !this.isHamburgerActive;
  }

}
