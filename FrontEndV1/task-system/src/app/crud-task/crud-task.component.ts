import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CreateService } from '../create.service';
import { Router } from '@angular/router';
// import {FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-crud-task',
  templateUrl: './crud-task.component.html',
  styleUrls: ['./crud-task.component.css']
})

export class CrudTaskComponent implements OnInit {
  // fn:FormGroup;
  constructor(private createSer:CreateService,private router:Router){
    // this.fn=fb.group({});
  }
  pagetitle = "Create Task"; 
  buttonaction1 = "Create";
  statusContentEdit: boolean = false;
  items;
  statusObject;
  projectsObject;
  typesObject;
  dateStatus = false;
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class
    this.getProjectDetails();
    this.getStatusDetails();
    this.getTypeDetails();
  }
 
  
  getStatusDetails(){
    let obs=this.createSer.getStatusId()
    obs.subscribe((response)=>{
      this.statusObject=response;
      console.log(response);
      
    });
  }

  getProjectDetails(){
    let obs1=this.createSer.getProjects()
    obs1.subscribe((response)=>{
      this.projectsObject=response;
      console.log(response);
      
    });
  }

  getTypeDetails(){
    let obs1=this.createSer.getTypes()
    obs1.subscribe((response)=>{
      this.typesObject=response;      
    });
  }
 
  makeNewTask(createTask:NgForm){

    if(this.checkForm(createTask)){
    let obs=this.createSer.sendDetails(createTask.value)
    obs.subscribe((response)=>{
      this.items=response;
      console.log(response);
      this.router.navigateByUrl("home");
    })
  }
  }
  checkForm(createTask:NgForm){
    if(createTask.valid && this.dateStatus==false){
      console.log("no error")
      alert('Task Created');
      return true;
    }
    else
    {
      console.log("Error");
      alert("Please enter proper details")
      return false;
    }
  }
  checkDate(startdate,enddate){
    if(enddate<startdate){
      this.dateStatus=true;
    }
    else{
    this.dateStatus=false;
    }
  }
}
