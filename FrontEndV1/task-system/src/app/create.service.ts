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

    var httpOptions= new HttpHeaders({
      'Content-type':'application/json',
    });
    return this.http.post('http://localhost:3001/createORcopy/3',value);
  }


  
}
