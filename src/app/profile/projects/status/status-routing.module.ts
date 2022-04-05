
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StatusComponent } from "./status.component";

const statusRoutes: Routes = [
  { path: "", component: StatusComponent },
]

@NgModule({
    imports: [RouterModule.forChild(statusRoutes)],
    exports: [RouterModule]
})
export class StatusRoutingModule {}
