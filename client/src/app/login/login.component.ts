import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
//login service
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginService = inject(LoginService);

  //declaring the form group
  loginForm: FormGroup;

  //creating form Group
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  //on submit check whether the user is correct or not if correct route to the admin component
  onSubmit() {
    //send loginForm object as argument
    this.loginService.checkUser(this.loginForm.value);
  }
}
