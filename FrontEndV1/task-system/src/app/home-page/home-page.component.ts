import { Component, OnInit } from '@angular/core';
import { TasklistService } from '../tasklist.service';
import { NgForm } from '@angular/forms';
import { Details } from './leaveModel';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  details=new Details();

  constructor(private taskService: TasklistService) {
  }

  firstDisplay() {
    var obs = this.taskService.getTasks(this.details.dId);
    console.log(this.details.dId);
    obs.subscribe((response) => {
      this.details.items = response;
      for(let i=0;i<this.details.items.length;i++)
      {
        this.details.items[i].startDate=(""+this.details.items[i].startDate).slice(0,10);
        this.details.items[i].endDate=(""+this.details.items[i].endDate).slice(0,10);
      }
        })
  }
  ngOnInit() {
    this.firstDisplay();
  }
  myFunctionSingleDay() {
    this.details.showCalendar = true;
    this.details.singleCalendarField = true;
    this.details.showSortingCalendar = false;
    this.details.projectInput = false;
    this.details.developerInput = false;
  }
  myFunctionMultipleDays() {
    this.details.showCalendar = true;
    this.details.singleCalendarField = false;
    this.details.showSortingCalendar = false;
    this.details.projectInput = false;
    this.details.developerInput = false;
  }
  myFunctionMultipleDaysSelect() {
    this.details.showSortingCalendar = true;
    this.details.projectInput = false;
    this.details.developerInput = false;
    this.details.showCalendar = false;
    this.details.singleCalendarField = false;
  }
  myFunctionDeveloperSelect() {
    this.details.developerInput = true;
    this.details.showSortingCalendar = false;
    this.details.projectInput = false;
    this.details.showCalendar = false;
    this.details.singleCalendarField = false;
  }
  collapse() {
    this.details.showCalendar = false;
    this.details.singleCalendarField=false;
    this.details.developerInput = false;
    this.details.showSortingCalendar = false;
    this.details.projectInput = false;
    this.firstDisplay();
  }
  takeLeave(leave: NgForm) {
    var obs = this.taskService.applyLeave(this.details.dId, leave.value);
    obs.subscribe((response) => {
      if(response['result']=="update successful")
    {
      alert("Updated Successfully!");
    }
    else
    {
      alert("Re-submit!");
    }
    })
  }

  sortingInput(sorting: NgForm) {
    this.details.showSortingCalendar = true;
    this.details.projectInput = !this.details.projectInput;
    this.details.showCalendar = false;
    this.details.singleCalendarField = false;
  }

  myFunctionProjectSelect() {
    this.details.showSortingCalendar = false;
    this.details.projectInput = true;
    this.details.developerInput = false;
    this.details.showCalendar = false;
    this.details.singleCalendarField = false;
  }

  sortingDate(dateRange: NgForm) {
    var obs = this.taskService.sortByDate(this.details.dId, dateRange.value);
    obs.subscribe((response) => {
      this.details.items = response;
      if(response['result']=="unsuccessful")
      {
        this.details.items=null;
      }
      for(let i=0;i<this.details.items.length;i++)
      {
        this.details.items[i].startDate=(""+this.details.items[i].startDate).slice(0,10);
        this.details.items[i].endDate=(""+this.details.items[i].endDate).slice(0,10);
      }
    })
  }
  sortingProject(project: NgForm) {
    var obs = this.taskService.sortByProject(this.details.dId, project.value);
    obs.subscribe((response) => {
      this.details.items = response;
      if(response['result']=="unsuccessful")
      {
        this.details.items=null;
      }
      for(let i=0;i<this.details.items.length;i++)
      {
        this.details.items[i].startDate=(""+this.details.items[i].startDate).slice(0,10);
        this.details.items[i].endDate=(""+this.details.items[i].endDate).slice(0,10);
      }
    })
  }
  sortingDeveloper(developer: NgForm) {
    console.log(developer.value)
    var obs = this.taskService.sortByDeveloper(developer.value);
    obs.subscribe((response) => {
      this.details.items = response;
      if(response['result']=="unsuccessful")
      {
        this.details.items=null;
      }
      for(let i=0;i<this.details.items.length;i++)
      {
        this.details.items[i].startDate=(""+this.details.items[i].startDate).slice(0,10);
        this.details.items[i].endDate=(""+this.details.items[i].endDate).slice(0,10);
      }
    })
  }
  logout(){
    var obs = this.taskService.logout();
    obs.subscribe((response) => {
      console.log(response);
    })  
  }

}
