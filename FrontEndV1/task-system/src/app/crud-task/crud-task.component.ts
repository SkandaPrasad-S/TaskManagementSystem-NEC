import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CreateService } from '../create.service';
// import {FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-crud-task',
  templateUrl: './crud-task.component.html',
  styleUrls: ['./crud-task.component.css']
})

export class CrudTaskComponent implements OnInit {
  // fn:FormGroup;
  constructor(private createSer:CreateService){
    // this.fn=fb.group({});
  }
  pagetitle = "Create Task"; 
  buttonaction1 = "Create";
  statuscontentedit: boolean = false;
  items;
  statusobj;
  projectsobj;
  selected="some";
  valprojectId;
  status2 = false;
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class
    this.getProjectDetails();
    this.getStatusDetails();
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
      this.selected=response[0].projectName;
      
    });
  }
 
  makeNewTask(createTask:NgForm){

    if(this.checkForm(createTask)){
    let obs=this.createSer.sendDetails(createTask.value)
    obs.subscribe((response)=>{
      this.items=response;
      console.log(response);
    })
  }
  }
  checkForm(createTask:NgForm){
    if(createTask.valid && this.status2==false){
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
      this.status2=true;
    }
    else{
    this.status2=false;
    }
  }
}
