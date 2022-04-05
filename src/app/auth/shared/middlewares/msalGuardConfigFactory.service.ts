import { Injectable } from "@angular/core";
import { MsalGuardConfiguration } from "@azure/msal-angular";
import { InteractionType } from "@azure/msal-browser";
import { apiConfig } from "src/app/auth/shared/config/b2c-config";

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [...apiConfig.scopes],
    },
    loginFailedRoute: 'login-failed'
  };
}
