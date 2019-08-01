import { Component, OnInit } from '@angular/core';
import { TasklistService } from '../tasklist.service';
import { NgForm } from '@angular/forms';
import { ModifyService } from '../modify.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  items;
  showCalendar: boolean = false;
  singleCalendarField: boolean = false;
  showSortingCalendar: boolean = false;
  projectInput: boolean = false;
  dId = "nec03";
  dName;
  startDate:string;
  endDate:string;
  dateUpdate: boolean;
  managerView: boolean = true;
  developerInput: boolean = false;
  result;

  constructor(private taskService: TasklistService,private modifyService:ModifyService, private router:Router) {
  }

  firstDisplay() {
    var obs = this.taskService.getTasks(this.dId);
    obs.subscribe((response) => {
      this.items = response;
      for(let i=0;i<this.items.length;i++)
      {
        this.items[i].startDate=(""+this.items[i].startDate).slice(0,10);
        this.items[i].endDate=(""+this.items[i].endDate).slice(0,10);
      }
        })
  }
  ngOnInit() {
    this.firstDisplay();
  }
  myFunctionSingleDay() {
    this.showCalendar = true;
    this.singleCalendarField = true;
    this.showSortingCalendar = false;
    this.projectInput = false;
    this.developerInput = false;
  }
  myFunctionMultipleDays() {
    this.showCalendar = true;
    this.singleCalendarField = false;
    this.showSortingCalendar = false;
    this.projectInput = false;
    this.developerInput = false;
  }
  myFunctionMultipleDaysSelect() {
    this.showSortingCalendar = true;
    this.projectInput = false;
    this.developerInput = false;
    this.showCalendar = false;
    this.singleCalendarField = false;
  }
  myFunctionDeveloperSelect() {
    this.developerInput = true;
    this.showSortingCalendar = false;
    this.projectInput = false;
    this.showCalendar = false;
    this.singleCalendarField = false;
  }
  collapse() {
    this.showCalendar = false;
    this.singleCalendarField=false;
    this.developerInput = false;
    this.showSortingCalendar = false;
    this.projectInput = false;
    this.firstDisplay();
  }
  takeLeave(leave: NgForm) {
    var obs = this.taskService.applyLeave(this.dId, leave.value);
    obs.subscribe((response) => {
      console.log(response)
      //this.result=response.result;
    })
  }

  sortingInput(sorting: NgForm) {
    this.showSortingCalendar = true;
    this.projectInput = !this.projectInput;
    this.showCalendar = false;
    this.singleCalendarField = false;
  }

  myFunctionProjectSelect() {
    this.showSortingCalendar = false;
    this.projectInput = true;
    this.developerInput = false;
    this.showCalendar = false;
    this.singleCalendarField = false;
  }

  sortingDate(dateRange: NgForm) {
    var obs = this.taskService.sortByDate(this.dId, dateRange.value);
    obs.subscribe((response) => {
      this.items = response;
      for(let i=0;i<this.items.length;i++)
      {
        this.items[i].startDate=(""+this.items[i].startDate).slice(0,10);
        this.items[i].endDate=(""+this.items[i].endDate).slice(0,10);
      }
    })
  }
  sortingProject(project: NgForm) {
    var obs = this.taskService.sortByProject(this.dId, project.value);
    obs.subscribe((response) => {
      this.items = response;
      for(let i=0;i<this.items.length;i++)
      {
        this.items[i].startDate=(""+this.items[i].startDate).slice(0,10);
        this.items[i].endDate=(""+this.items[i].endDate).slice(0,10);
      }
    })
  }
  sortingDeveloper(developer: NgForm) {
    console.log(developer.value)
    var obs = this.taskService.sortByDeveloper(developer.value);
    obs.subscribe((response) => {
      this.items = response;
      for(let i=0;i<this.items.length;i++)
      {
        this.items[i].startDate=(""+this.items[i].startDate).slice(0,10);
        this.items[i].endDate=(""+this.items[i].endDate).slice(0,10);
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
