/**
 * Enter here the user flows and custom policies for your B2C application
 * To learn more about user flows, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies = {
    names: {
      signUpSignIn: "B2C_1_SuperTeamSignupSignin",
      signUp: "B2C_1_SuperTeamSignup",
    },
    authorities: {
      signUpSignIn: {
        authority: "https://superteamrenov.b2clogin.com/superteamrenov.onmicrosoft.com/B2C_1_SuperTeamSignupSignin",
      },
      signUp: {
        authority: "https://superteamrenov.b2clogin.com/superteamrenov.onmicrosoft.com/B2C_1_SuperTeamSignup",
      }
    },
    authorityDomain: "superteamrenov.b2clogin.com"
}

/**
 * Enter here the coordinates of your web API and scopes for access token request
 * The current application coordinates were pre-registered in a B2C tenant.
 */
export const apiConfig: { scopes: string[]; uri: string } = {
    scopes: ['https://superteamrenov.onmicrosoft.com/api/read_data'],
    uri: ''
};
