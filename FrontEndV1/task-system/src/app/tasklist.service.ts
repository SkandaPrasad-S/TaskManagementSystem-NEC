import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { dateObject, Project, Developer } from './home-page/leaveModel';

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
}
