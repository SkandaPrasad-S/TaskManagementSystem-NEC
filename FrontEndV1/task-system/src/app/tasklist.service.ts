import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { dateObject, Project, Developer } from './home-page/leaveModel';
import { logDetails, Details } from './working-hours/model';

@Injectable({

 providedIn: 'root'
}
)
export class TasklistService {

  constructor(private http:HttpClient) { }
  getTasks(dId:string) {
    return this.http.post('http://127.0.0.1:3000/allTasks/'+dId,null);
  }
  getTasksByDate(value:dateObject){

    return this.http.post('http://127.0.0.1:3000/allTasksByDate/',value);
  }
  applyLeave(dId:string,leave:dateObject){
    console.log(leave.fromDate)
    return this.http.post('http://127.0.0.1:3000/takeLeave/'+dId,leave);
  }
  sortByDate(dId:string,dateRange:dateObject){
    return this.http.post('http://127.0.0.1:3000/allTasksByDate/'+dId,dateRange);
  }
  sortByProject(dId:string,project:Project){
    return this.http.post('http://127.0.0.1:3000/allTasksByProject/'+dId,project);
  }
  sortByDeveloper(dId:Developer){
    console.log(dId)
    return this.http.post('http://127.0.0.1:3000/allTasksByDeveloper/',dId);
  }
  logout(){
    return this.http.get('http://127.0.0.1:3000/logOut/'); 
  }
  //This is for Update page
  sendUpdateDate(dateValue,dId){
    return this.http.post('http://127.0.0.1:3000/getWorkingHours/'+dId,{"date":dateValue});
  }
  sendWorkingHours(details:any,dId){
    return this.http.put('http://127.0.0.1:3000/updateWorkingHours/'+dId,details);
  }
  getLog(dateValue,dId){
    return this.http.post('http://127.0.0.1:3000/getLog/'+dId,{"date":dateValue})
  }
  deleteLog(details:any,dId){
    return this.http.post('http://127.0.0.1:3000/deleteLog/'+dId,details)
  }  
}
