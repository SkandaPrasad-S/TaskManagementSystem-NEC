import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crud-task',
  templateUrl: './crud-task.component.html',
  styleUrls: ['./crud-task.component.css']
})
export class CrudTaskComponent implements OnInit {
  title = 'taskcopy1';
  pagetitle = "Create Task";
  taskid:number;
  type = "";
  devname = "";
  sdate:string;
  edate:string;
  sprint = "";
  pname="";
  remhours = 0;
  totalhrs = 0;
  comments = "";
  buttonaction1="Create";
  buttonaction2="";
  buttonaction3="";
  statuscontentedit:boolean=true;

  
  createflag: string="create";

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.Displaypage();
  }
  Displaypage(){
    if(this.createflag=="create")
    {
      this.pagetitle = "Create Task"
      this.type = "";
      this.devname = "";
      this.sdate=""
      this.edate=""
      this.sprint = "";
      this.pname="";
      this.remhours=0;
      this.totalhrs = 0;
      this.comments = "";
      this.buttonaction1="Create";
      this.statuscontentedit=false;
    }
    if (this.createflag =="display") {
      this.pagetitle = "Task Details"
      this.taskid = 0;
      this.type = "Sample";
      this.devname = "Sample";
      this.sdate="2019-07-23"
      this.edate="2019-07-24"
      this.sprint = "Sample";
      this.pname="Sample";
      this.remhours = 20;
      this.totalhrs = 10;
      this.comments = "SampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSample";
      this.buttonaction1="Modify";
      this.buttonaction2="Copy To Create";
      this.buttonaction3="Delete"; 
      this.statuscontentedit=true;    
    }
    if (this.createflag =="modify") {
      this.pagetitle = "Task Details"
      this.taskid = 0;
      this.type = "Sample";
      this.devname = "Sample";
      this.sdate="2019-07-23"
      this.edate="2019-07-24"
      this.sprint = "Sample";
      this.pname="Sample";
      this.remhours = 20;
      this.totalhrs = 10;
      this.comments = "SampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSample";
      this.buttonaction1="Save";
      this.statuscontentedit=false;
           
    }
  }


  gotomodify()
  {
    this.createflag="modify";
    this.Displaypage();

  }
}
