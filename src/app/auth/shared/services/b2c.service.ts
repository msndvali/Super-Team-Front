import { Inject, Injectable } from "@angular/core";
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService, MsalBroadcastService } from "@azure/msal-angular";
import { RedirectRequest, PopupRequest, InteractionType, AuthenticationResult, EventMessage, EventType, InteractionStatus } from "@azure/msal-browser";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { filter, takeUntil } from 'rxjs/operators';
import { b2cPolicies } from "../config/b2c-config";

import jwt_decode from 'jwt-decode';
import { HomeService } from "src/app/main/shared/services/home.service";

interface Payload extends AuthenticationResult {
  idTokenClaims: {
    tfp?: string
  }
}

@Injectable({ providedIn: 'root' })
export class B2CService {
  isIframe = false;
  loginDisplay = new BehaviorSubject(false);
  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private homeService: HomeService
    ) { }

  init() {

    this.isIframe = window !== window.parent && !window.opener;
    this.setLoginDisplay();

    this.msalBroadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.setLoginDisplay();
      this.checkAndSetActiveAccount();
    });

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS || msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        let payload: Payload = <AuthenticationResult>result.payload;

        localStorage.setItem('JwtToken', payload?.accessToken);

        this.loginDisplay.next(true);

        /**
         * For the purpose of setting an active account for UI update, we want to consider only the auth response resulting
         * from SUSI flow. "tfp" claim in the id token tells us the policy (NOTE: legacy policies may use "acr" instead of "tfp").
         * To learn more about B2C tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
         */

        return result;
      });

      this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_FAILURE || msg.eventType === EventType.ACQUIRE_TOKEN_FAILURE),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        // Add your auth error handling logic here
      });

      this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        let payload: Payload = <AuthenticationResult>result.payload;
        if(payload.authority == 'https://superteamrenov.b2clogin.com/superteamrenov.onmicrosoft.com/b2c_1_superteamsignup/') {
          const tokenInfo = this.getDecodedAccessToken(payload.idToken);
          if(tokenInfo.newUser == true && tokenInfo.extension_Role == 'leader') {
            let organization = {
              name: tokenInfo.extension_Organization,
              identificationCode: tokenInfo.extension_IdentificationCode,
              cityIds: tokenInfo.extension_CityIds
            }
            this.homeService.passOrganization(organization);
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

  setLoginDisplay() {
    const log = this.authService.instance.getAllAccounts().length > 0
    this.loginDisplay.next(log);
  }

  checkAndSetActiveAccount(){
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    let activeAccount = this.authService.instance.getActiveAccount();

    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  login(userFlowRequest?: RedirectRequest | PopupRequest) {
    if (this.msalGuardConfig.authRequest){
      this.authService.loginRedirect({...this.msalGuardConfig.authRequest, ...userFlowRequest} as RedirectRequest);
    } else {
      this.authService.loginRedirect(userFlowRequest);
    }
  }

  signUp() {
    let signUpFlowRequest = {
      scopes: ["openid https://superteamrenov.onmicrosoft.com/api/read_data https://superteamrenov.onmicrosoft.com/api/write_data"],
      authority: b2cPolicies.authorities.signUp.authority,
    };

    this.login(signUpFlowRequest);
  }

  logout() {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      this.authService.logoutPopup({
        mainWindowRedirectUri: "/"
      });
    } else {
      this.authService.logoutRedirect();
    }

    localStorage.removeItem('JwtToken');
  }

  destroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
