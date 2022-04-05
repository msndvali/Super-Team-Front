import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MsalGuard } from "@azure/msal-angular";
import { RoleGuard } from "../auth/shared/middlewares/role.guard";
import { LayoutComponent } from "./layout.component";

const layoutRoutes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    pathMatch: 'prefix',
    children:
    [
      {
        path: '',
        redirectTo : 'home',
        pathMatch : 'full'
      },
      {
        path : 'home',
        loadChildren: () =>
          import("../main/home/home.module").then(m => m.HomeModule)
      },
      {
        path : 'about-us',
        loadChildren: () =>
          import("../main/about-us/about-us.module").then(m => m.AboutUsModule)
      },
      {
        path : 'contact-us',
        loadChildren: () =>
          import("../main/contact-us/contact-us.module").then(m => m.ContactUsModule)
      },
      {
        path : 'faq',
        loadChildren: () =>
          import("../main/faq/faq.module").then(m => m.FaqModule)
      },
      {
        path : 'calculation',
        loadChildren: () =>
          import("../calculation/calculation.module").then(m => m.CalculationModule)
      },
      {
        path : 'find-work',
        canActivate: [RoleGuard],
        data: {
          role: "leader"
        },
        loadChildren: () =>
          import("../main/find-work/find-work.module").then(m => m.FindWorkModule)
      },
      {
        path : 'notification',
        loadChildren: () =>
          import("../main/notification/notification.module").then(m => m.NotificationModule)
      },
      {
        path : 'profile',
        canActivate: [RoleGuard],
        loadChildren: () =>
          import("../profile/profile.module").then(m => m.ProfileModule)
      },
      {
        path : 'add-users',
        canActivate: [RoleGuard],
        data: {
          role: "leader"
        },
        loadChildren: () =>
          import("../profile/add-users/add-users.module").then(m => m.AddUsersModule)
      },
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(layoutRoutes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
