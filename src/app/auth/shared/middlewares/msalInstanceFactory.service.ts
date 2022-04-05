import { IPublicClientApplication, PublicClientApplication, BrowserCacheLocation, LogLevel } from "@azure/msal-browser";
import { b2cPolicies } from "src/app/auth/shared/config/b2c-config";

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: '201084d6-11ae-4379-b602-c94db15091e6',
      authority: b2cPolicies.authorities.signUpSignIn.authority,
      redirectUri: '/',
      postLogoutRedirectUri: '/',
      knownAuthorities: [b2cPolicies.authorityDomain]
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false
      }
    }
  });
}


export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}
