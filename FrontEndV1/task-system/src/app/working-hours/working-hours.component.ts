import { Component, OnInit } from '@angular/core';
import { TasklistService } from '../tasklist.service';
import { UpdateServiceService } from '../update-service.service';
import { Details, logDetails } from './model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.css']
})
export class WorkingHoursComponent implements OnInit {
  details = new Details();
  logDetails = new logDetails();
  // workedHours;
  tempString = [];
  date: string;
  constructor(private taskService: TasklistService, private updateService: UpdateServiceService) { }

  ngOnInit() {
    var obs = this.taskService.getTasks(this.details.dId);
    obs.subscribe((response) => {
      this.details.items = response;
      for (var i = 0; i < this.details.items.length - 1; i++)
        this.tempString[i] = "";
      console.log(this.details.items);
    })

  }
  // updateTask(workingHoursForm: NgForm) {
  //   var obs = this.updateService.updateWorkHours(this.details.dId, workingHoursForm.value);
  //   obs.subscribe((response) => {
  //     if (response['result'] == "insert successful") {
  //       alert("Updated Successfully!");

  //       workingHoursForm.reset();
  //     }
  //     else {
  //       alert("Try again!");
  //     }
  //   })
  // }
  sendWorkHours(itemDetails: Details, workedHours) {
    var flag=0;
    itemDetails.date = this.date;
    itemDetails.workedHours = workedHours;
    console.log("-------------------------------------------------")
    console.log(itemDetails.taskId);
    var obs = this.taskService.sendWorkingHours(itemDetails, this.details.dId);
    console.log(this.details.dId);
    obs.subscribe((response) => {
      for(let i=0;i<this.logDetails.items.length;i++)
      {
        if(itemDetails.taskId===this.logDetails.items[i].taskId)
          flag=1;
      }
      if((response['result']=="update successful" || response['result']=="insert successful") && flag===0)
      {
        alert("Update successful")
        this.getLog(this.date);
      }
      else if(flag!=0)
      {
        alert("Delete the previous log before updation");
      }
      else
      {
        alert("Update failed");
      }
      console.log(this.details.items)
    })

    console.log(this.tempString);

  }

  dateSelect(date) {
    console.log("1",date);
    if (date == null) {
      alert("Enter a valid date");
    }
    else {
      this.updateWorkingHours();
    }
  }

  getLog(date) {
    console.log("3",date)
    var obs = this.taskService.getLog(date, this.logDetails.dId);
    console.log(this.logDetails.dId);
    obs.subscribe((response) => {
      this.logDetails.items = response;
      for (let i = 0; i < this.logDetails.items.length; i++) {
        this.logDetails.items[i].startDate = ("" + this.logDetails.items[i].startDate).slice(0, 10);
        this.logDetails.items[i].endDate = ("" + this.logDetails.items[i].endDate).slice(0, 10);
      }
      console.log("123",response);
    })
  }

  deleteLog(details: Details) {
    console.log(details)
    this.details.date = this.date;
    console.log("qwer",this.details.date);
    var obs = this.taskService.deleteLog(details, this.details.dId);
    console.log(this.logDetails.dId);
    obs.subscribe((response) => {
      if(response['result']=="delete successful")
      {
        alert("Delete successful");
        this.getLog(this.date);
      }
      else
      {
        alert("Delete unseccessful");
      }
    })
  }
  updateWorkingHours(){
    var obs = this.taskService.sendUpdateDate(this.date, this.details.dId);
      console.log("akjsojasnd",this.details.dId);
      obs.subscribe((response) => {
        console.log("2",response)
        this.details.items=response;
        for (let i = 0; i < this.details.items.length; i++) {
          this.details.items[i].startDate = ("" + this.details.items[i].startDate).slice(0, 10);
          this.details.items[i].endDate = ("" + this.details.items[i].endDate).slice(0, 10);
        }
      })
      this.details.displayTable = true;
      this.getLog(this.date);
      this.logDetails.displayTable = true;
  }
}
