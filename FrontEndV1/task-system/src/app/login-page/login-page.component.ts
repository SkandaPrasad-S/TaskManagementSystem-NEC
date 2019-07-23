import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  items;
  constructor(private loginSer:LoginServiceService) { }

  authentication(login:NgForm){
    let obs=this.loginSer.getLogin(login.value);
    obs.subscribe((response)=>{
      this.items=response;
      console.log(response);
    })
  }
  ngOnInit() {
    
  }

}
