
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ContactUsComponent } from "./contact-us.component";

const contactUsRoutes: Routes = [
  { path: "", component: ContactUsComponent },
]

@NgModule({
    imports: [RouterModule.forChild(contactUsRoutes)],
    exports: [RouterModule]
})
export class ContactUsRoutingModule {}
