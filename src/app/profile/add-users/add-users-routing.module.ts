import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddUsersComponent } from "./add-users.component";

const addUsersRoutes: Routes = [
  { path: "", component: AddUsersComponent },
]

@NgModule({
    imports: [RouterModule.forChild(addUsersRoutes)],
    exports: [RouterModule]
})
export class AddUsersRoutingModule {}
