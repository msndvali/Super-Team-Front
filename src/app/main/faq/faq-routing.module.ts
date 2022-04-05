import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FaqComponent } from "./faq.component";

const faqRoutes: Routes = [
  { path: "", component: FaqComponent },
]

@NgModule({
    imports: [RouterModule.forChild(faqRoutes)],
    exports: [RouterModule]
})
export class FaqRoutingModule {}
