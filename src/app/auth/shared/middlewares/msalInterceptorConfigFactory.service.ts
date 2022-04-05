import { MsalInterceptorConfiguration } from "@azure/msal-angular";
import { InteractionType } from "@azure/msal-browser";
import { apiConfig } from "src/app/auth/shared/config/b2c-config";

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, null>();
  // protectedResourceMap.set(apiConfig.uri, apiConfig.scopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}
