import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { B2CService } from './auth/shared/services/b2c.service';
import { SignalRService } from './signalr/signalr.service';

import SwiperCore, { Pagination } from "swiper";

SwiperCore.use([Pagination]);
import * as AOS from 'aos';
import { HomeService } from './main/shared/services/home.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(
    private homeService: HomeService,
    private b2cService: B2CService,
    private signalRService: SignalRService
    ) { }

  ngOnInit(): void {
    this.b2cService.init();

    this.homeService.organization
      .subscribe(res => {
        if(res) {
          this.homeService.createOrganization(res)
            .subscribe(response => window.location.reload());
        }
      });

    AOS.init();

    this.signalRService.startConnection();
    this.signalRService.addNotificationListener();
  }

  ngOnDestroy(): void {
    this.b2cService.destroy();
  }
}
