import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotificationComponent } from "./notification.component";

const notificationRoutes: Routes = [
  { path: "", component: NotificationComponent },
]

@NgModule({
    imports: [RouterModule.forChild(notificationRoutes)],
    exports: [RouterModule]
})
export class NotificationRoutingModule {}
