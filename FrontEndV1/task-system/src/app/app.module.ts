import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { LoginServiceService } from './login-service.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule} from '@angular/forms';
import { HomePageComponent } from './home-page/home-page.component';
import { CrudTaskComponent } from './crud-task/crud-task.component';
import { GetStatsReportComponent } from './get-stats-report/get-stats-report.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MaterialModule } from './material/material.module';
import { HeaderComponent } from './header/header.component';
import { DisplayModifyComponent } from './display-modify/display-modify.component';
import { ModifyService } from './modify.service';
import { CreateService } from './create.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomePageComponent,
    CrudTaskComponent,
    GetStatsReportComponent,
    HeaderComponent,
    DisplayModifyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [LoginServiceService,ModifyService,CreateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
