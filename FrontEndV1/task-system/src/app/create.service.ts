import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  createFormObject } from './crud-task/createmodel';


@Injectable({
  providedIn: 'root'
})

export class CreateService {

  constructor(private http:HttpClient) { }

  sendDetails(value:createFormObject){
    console.log(value.taskId);
    console.log(value.startDate);
    console.log(value.endDate);
    console.log(value.statusId);
    const httpOptions= new HttpHeaders({
      'Content-type':'application/json',
    });
    return this.http.post('http://localhost:3000/createORcopy/nec03',value);
  }
  getStatusId(){
    return this.http.get('http://localhost:3000/getStatus')
  }
  getProjects(){
    return this.http.get('http://localhost:3000/getProjects')
  }
  getTypes(){
    return this.http.get('http://localhost:3000/getTypes')
  }
}
