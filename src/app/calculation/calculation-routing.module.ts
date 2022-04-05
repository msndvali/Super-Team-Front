import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RoleGuard } from "../auth/shared/middlewares/role.guard";
import { CalculationComponent } from "./calculation.component";

const calculationRoutes: Routes = [
  {
    path: "",
    component: CalculationComponent,
    pathMatch: 'prefix',
    children:
    [
      {
        path: '',
        redirectTo: '/calculation/calculate-quote',
        pathMatch: 'full'
      },
      {
        path: 'estimated-quote',
        data: { id:'1' },
        loadChildren: () =>
          import("./estimated-quote/estimated-quote.module").then(m => m.EstimatedQuoteModule)
      },
    ]
  },
]

@NgModule({
    imports: [RouterModule.forChild(calculationRoutes)],
    exports: [RouterModule]
})
export class CalculationRoutingModule {}
