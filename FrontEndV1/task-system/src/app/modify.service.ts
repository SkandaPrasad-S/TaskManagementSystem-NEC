import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { createFormObject } from './crud-task/createmodel';
@Injectable({
  providedIn: 'root'
})
export class ModifyService {
  constructor(private http:HttpClient) { }

  getTaskDetails(id){
    return this.http.get('http://localhost:3000/taskDetails/'+id,{responseType: 'json'});
  }

  sendModifyDetails(id,value:createFormObject){
    console.log(value)
    return this.http.put('http://localhost:3000/update/'+id,value)
  }
}
