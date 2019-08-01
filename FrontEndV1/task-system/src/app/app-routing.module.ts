import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrudTaskComponent } from './crud-task/crud-task.component';
import { HomePageComponent } from './home-page/home-page.component';
import { DisplayModifyComponent } from './display-modify/display-modify.component';


const routes: Routes = [
  {path:"createTask",component:CrudTaskComponent},
  {path:"home",component:HomePageComponent},
  {path:"display/:taskId",component:DisplayModifyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
