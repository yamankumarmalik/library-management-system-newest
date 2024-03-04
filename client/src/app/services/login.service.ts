import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { login } from '../models/login';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private toast: NgToastService
  ) {}

  // signal which store userAdmin Login value if logged in or not (by default Log In)
  userAdmin = signal(false);

  //Loading-Spinner Variable
  isLoading = false;

  //base url for the json object
  url = 'http://localhost:4000/user-api/login';

  //function to check user credential from userLogin.json file
  checkUser(loginForm: any) {
    this.httpClient.post<any>(this.url, loginForm).subscribe({
      next: (res) => {
        this.isLoading = true;
        if (res.message === 'Invalid username') {
          this.isLoading = false;
          return this.toast.error({
            detail: 'Please Enter a valid Username',
            summary: 'Username is invalid',
            sticky: true,
            position: 'topCenter',
          });
        }
        if (res.message === 'Invalid password') {
          this.isLoading = false;
          return this.toast.error({
            detail: 'Please Enter the correct Password',
            summary: 'Password is incorrect!',
            sticky: true,
            position: 'topCenter',
          });
        }
        if (res.message === 'login success') {
          //store token in local/session storage
          localStorage.setItem('token', res.token);
          //set user status & current user to service
          this.userAdmin.set(true);
          //pop up message for success
          this.toast.success({
            detail: 'Login Success',
            summary: 'Admin Login is successful!',
            position: 'topCenter',
            duration: 5000,
          });
          //navigate to books
          this.router.navigate(['/books']);
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      },
    });
  }

  //function to add new user on the json server
  addNewUser(user: login) {
    return this.httpClient.post<any>(
      'http://localhost:4000/user-api/create-user',
      user
    );
  }

  //variable for the search service (a signal so the user knows when the status changes)
  searchStatus = signal('');
}
