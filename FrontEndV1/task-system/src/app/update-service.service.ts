import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Details } from './working-hours/model';

@Injectable({
  providedIn: 'root'
})
export class UpdateServiceService {

  constructor(private http:HttpClient) { }
  updateWorkHours(dId:string,details:Details){
    console.log(details)
    return this.http.post('http://127.0.0.1:3000/setWorkingHours/'+dId,details);
  }
}
