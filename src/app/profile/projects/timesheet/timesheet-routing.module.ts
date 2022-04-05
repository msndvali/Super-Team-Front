import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TimesheetComponent } from "./timesheet.component";

const timesheetRoutes: Routes = [
  { path: "", component: TimesheetComponent },
]

@NgModule({
    imports: [RouterModule.forChild(timesheetRoutes)],
    exports: [RouterModule]
})
export class TimesheetRoutingModule {}
