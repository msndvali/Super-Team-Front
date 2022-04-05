import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CalculateQuoteComponent } from "./calculate-quote.component";

const calculateQuoteRoutes: Routes = [
  { path: "", component: CalculateQuoteComponent },
]

@NgModule({
    imports: [RouterModule.forChild(calculateQuoteRoutes)],
    exports: [RouterModule]
})
export class CalculateQuoteRoutingModule {}
