
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProfileComponent } from "./profile.component";

const profileRoutes: Routes = [
  {
    path: "",
    component: ProfileComponent,
    pathMatch: 'prefix',
    children:
    [
      {
        path: '',
        redirectTo : 'projects',
        pathMatch : 'full'
      },
      {
        path: 'projects',
        loadChildren: () =>
          import("./projects/projects.module").then(m => m.ProjectsModule)
      },
      {
        path: 'projects/:id',
        loadChildren: () =>
          import("./projects/status/status.module").then(m => m.StatusModule)
      },
      {
        path: 'projects/:id/timesheet',
        loadChildren: () =>
          import("./projects/timesheet/timesheet.module").then(m => m.TimesheetModule)
      },
      {
        path: 'scope-of-work/:id',
        loadChildren: () =>
          import("./projects/scope-of-work/scope-of-work.module").then(m => m.ScopeOfWorkModule)
      }
    ]
  },
]

@NgModule({
    imports: [RouterModule.forChild(profileRoutes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule {}
