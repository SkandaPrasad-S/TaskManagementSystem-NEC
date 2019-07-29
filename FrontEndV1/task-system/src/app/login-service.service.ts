import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { loginObject } from './login-page/model';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private http: HttpClient) { }

  getLogin(value:loginObject) 
  {
    console.log(value.employeeId)
    console.log(value.password)
    var httpOptions=new HttpHeaders(
      {'Content-Type': 'application/json',}
      )
      
    return this.http.post('http://127.0.0.1:3000/login',value)
  }
}
