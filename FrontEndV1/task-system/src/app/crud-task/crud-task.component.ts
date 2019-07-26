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
  taskid: number;
  type = "";
  devname = "";
  sdate: string;
  edate: string;
  sprint = "";
  pname = "";
  remhours = 0;
  totalhrs = 0;
  comments = ""; 
  buttonaction1 = "Create";
  buttonaction2 = "";
  buttonaction3 = "";
  statuscontentedit: boolean = true;
  createflag: string = "create";
  items;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.Displaypage();
  }
  Displaypage() {
    if (this.createflag == "create") {
      this.pagetitle = "Create Task"
      this.type = "";
      this.devname = "";
      this.sdate = ""
      this.edate = ""
      this.sprint = "";
      this.pname = "";
      this.remhours = 0;
      this.totalhrs = 0;
      this.comments = "";
      this.buttonaction1 = "Create";
      this.statuscontentedit = false;
    }
    if (this.createflag == "display") {
      this.pagetitle = "Task Details"
      this.taskid = 0;
      this.type = "Sample";
      this.devname = "Sample";
      this.sdate = "2019-07-23"
      this.edate = "2019-07-24"
      this.sprint = "Sample";
      this.pname = "SampleProject";
      this.remhours = 20;
      this.totalhrs = 10;
      this.comments = "SampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSample";
      this.buttonaction1 = "Modify";
      this.buttonaction2 = "Copy To Create";
      this.buttonaction3 = "Delete";
      this.statuscontentedit = true;
    }
  }
  makeNewTask(createTask:NgForm){
    let obs=this.createSer.sendDetails(createTask.value);
    obs.subscribe((response)=>{
      this.items=(response);
      console.log(response);
    })
  }
}
