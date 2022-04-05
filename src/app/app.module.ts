import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MsalBroadcastService, MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth/shared/middlewares/auth-interceptor.service';
import { MSALGuardConfigFactory } from './auth/shared/middlewares/msalGuardConfigFactory.service';
import { MSALInstanceFactory } from './auth/shared/middlewares/msalInstanceFactory.service';
import { MSALInterceptorConfigFactory } from './auth/shared/middlewares/msalInterceptorConfigFactory.service';
import { NotificationComponent } from './main/notification/notification.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorInterceptor } from './auth/shared/middlewares/error-interceptor.service';
import { ToastsContainer } from './shared/toast/toasts-container.component';

@NgModule({
  declarations: [
    AppComponent,
    ToastsContainer
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MsalModule,
    NgbModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    // MsalGuard,
    MsalBroadcastService,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
