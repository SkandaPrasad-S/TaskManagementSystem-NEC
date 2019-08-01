import { Component, OnInit } from '@angular/core';
import { ModifyService } from '../modify.service';
import { modifyObject } from './model';
import { CreateService } from '../create.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'display',
  templateUrl: './display-modify.component.html',
  styleUrls: ['./display-modify.component.css']
})
export class DisplayModifyComponent implements OnInit {
  constructor(private modifyService:ModifyService,private createSer:CreateService,private router:Router ){}
  taskIdFromURL;
  viewFlag=false;
  statuscontentedit=true;
  displayObj:any={};
  storeStartDate:String;
  storeEndDate:String;
  buttonaction1="Modify";
  statusobj;
  projectsobj;
  dateStatus=false;
  responseFromModify;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.Displaypage();
    this.taskIdFromURL = location.pathname.valueOf().split('/display/').pop();
    console.log(this.taskIdFromURL);
    this.displayDetails(this.taskIdFromURL);
    this.getProjectDetails();
    this.getStatusDetails();

  }
  gotomodify(){
    this.viewFlag=true;
    // this.Displaypage();
    this.buttonaction1="Save";
    this.statuscontentedit=false;
  }
  displayDetails(id){
    let obs=this.modifyService.getTaskDetails(id);
    obs.subscribe((response)=>{
      console.log(response);
      this.displayObj=response;
      this.storeStartDate=(this.displayObj.startDate+"").slice(0,10);
      console.log(this.storeStartDate);
      this.storeEndDate=(this.displayObj.endDate+"").slice(0,10);
      console.log(this.storeEndDate);
    })
  }
  getStatusDetails(){
    let obs=this.createSer.getStatusId()
    obs.subscribe((response)=>{
      this.statusobj=response;
      console.log(response);   
    });
  }
  getProjectDetails(){
    let obs1=this.createSer.getProjects()
    obs1.subscribe((response)=>{
      this.projectsobj=response;
      console.log(response);
    });
  }
  updateTask(modifyTask:NgForm){
    if(this.checkForm(modifyTask)){
      let obs=this.modifyService.sendModifyDetails(this.taskIdFromURL,modifyTask.value);
      obs.subscribe((response)=>{
        this.responseFromModify=response;
        alert("Modified Successfully");
        this.router.navigateByUrl("home");
        console.log(response);

      })
    }

  }
  checkForm(createTask:NgForm){
    if(createTask.valid && this.dateStatus==false){
      console.log("no error")
      return true;
    }
    else
    {
      console.log("Error");
      alert("Please enter proper details")
      return false;
    }
  }
  checkDate(sd,ed){
    console.log(ed);
    console.log(sd);
    if(ed<sd){
      this.dateStatus=true;
    }
    else{
    this.dateStatus=false;
    }
  }


}
