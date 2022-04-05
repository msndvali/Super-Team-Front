import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BrowserUtils } from "@azure/msal-browser";

const appRoutes: Routes = [
    {
      path: "",
      loadChildren: () =>
        import("./layout/layout.module").then(m => m.LayoutModule),
    },
    {
      path: 'calculation/calculate-quote',
      loadChildren: () =>
        import("./calculation/calculate-quote/calculate-quote.module").then(m => m.CalculateQuoteModule)
    },
    {
      path: '**',
      redirectTo: 'home',
      pathMatch: 'full'
    }
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {
      useHash: true,
      // Don't perform initial navigation in iframes or popups
      initialNavigation: !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup() ? 'enabled' : 'disabled'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
