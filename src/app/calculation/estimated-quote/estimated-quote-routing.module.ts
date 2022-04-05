import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EstimatedQuoteComponent } from "./estimated-quote.component";

const estimatedQuoteRoutes: Routes = [
  { path: "", component: EstimatedQuoteComponent },
]

@NgModule({
    imports: [RouterModule.forChild(estimatedQuoteRoutes)],
    exports: [RouterModule]
})
export class EstimatedQuoteRoutingModule {}
