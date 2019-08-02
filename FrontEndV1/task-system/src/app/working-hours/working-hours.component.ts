import { Component, OnInit } from '@angular/core';
import { TasklistService } from '../tasklist.service';
import { UpdateServiceService } from '../update-service.service';
import { Details } from './model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.css']
})
export class WorkingHoursComponent implements OnInit {
  details=new Details();
  constructor(private taskService: TasklistService, private updateService:UpdateServiceService) { }

  ngOnInit() {
    var obs = this.taskService.getTasks(this.details.dId);
    console.log(this.details.dId);
    obs.subscribe((response) => {
      this.details.items = response;
      console.log(this.details.items);
        })
        
  }
  updateTask(workingHoursForm:NgForm){
    var obs = this.updateService.updateWorkHours(this.details.dId,workingHoursForm.value);
    obs.subscribe((response) => {
    if(response['result']=="insert successful")
    {
      alert("Updated Successfully!");
      
      workingHoursForm.reset();
    }
    else
    {
      alert("Try again!");
    }
    })  
  }

}
