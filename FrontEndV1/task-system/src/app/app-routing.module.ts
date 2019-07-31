import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrudTaskComponent } from './crud-task/crud-task.component';
import { HomePageComponent } from './home-page/home-page.component';


const routes: Routes = [
  {path:"app-crud-task",component:CrudTaskComponent},
  {path:"app-home-page",component:HomePageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
