import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { HomeService } from '../shared/services/home.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { B2CService } from 'src/app/auth/shared/services/b2c.service';
import { SwiperOptions } from 'swiper';

import Swiper, { Autoplay } from 'swiper';
Swiper.use([Autoplay]);

import SwiperCore, { Pagination, Navigation } from "swiper";
SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy {
  role: string;
  creatingProjectSpinner: string = 'creating';

  config: SwiperOptions = {
    autoplay: { delay: 2000 },
    slidesPerView: 1,
    loop: true,
    navigation: true,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
  };

  configCards: SwiperOptions = {
    autoplay: { delay: 4000 },
    slidesPerView: 3,
    spaceBetween: 30,
    slidesPerGroup: 3,
    loop: true,
    navigation: true,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
  };

  constructor(
    private spinner: NgxSpinnerService,
    private b2cService: B2CService
    ) { }

  ngOnInit(): void {
    this.setLoginDisplay();
  }

  setLoginDisplay() {
    this.b2cService.loginDisplay
      .subscribe(res => {
        if(res) {
          const token = localStorage.getItem('JwtToken');
          if (!token) {
            return;
          }
          const estimatedProperty = localStorage.getItem("estimated-property");
          const propertyOptions = localStorage.getItem("property-options");
          if(estimatedProperty && propertyOptions) {
            this.spinner.show('creating');
            if (!token) {
              this.spinner.hide('creating');
              localStorage.removeItem("estimated-property");
              localStorage.removeItem("property-options");
              localStorage.removeItem("floor-plan");
            }
          }
          const tokenInfo = this.getDecodedAccessToken(token);
          this.role = tokenInfo.extension_Role;
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

  ngOnDestroy(): void {
    this.spinner.hide('creating');
  }
}
