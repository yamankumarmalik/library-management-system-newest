import { Component, OnInit, inject, signal } from '@angular/core';
//booksService import
import { BooksService } from '../services/books.service';
//loginService import
import { LoginService } from '../services/login.service';
//httpClient import
import { HttpClient } from '@angular/common/http';
//books Model import
import { Books } from '../models/books';
// import router
import { Router } from '@angular/router';
// import pipe search
import { SearchPipe } from '../search.pipe';
//import ng-popup
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
})
export class BooksComponent implements OnInit {
  //inject login service
  loginService = inject(LoginService);
  //inject book service
  bookService = inject(BooksService);
  //inject httpClient
  httpClient = inject(HttpClient);
  //inject router
  router = inject(Router);
  //ng-popup service
  toast = inject(NgToastService);

  constructor() {}
  //signal variable declaration
  loginStatus;
  //array to store books array returned from the json server
  book: any[] = []; //array where the data is stored from json server [[{book data}]]
  //baseUrl for books array
  baseUrl: string = 'http://localhost:4000/books-api/all-books';

  //ngOnInit function initializes the values when the component is loaded
  ngOnInit(): void {
    this.httpClient.get<any>(this.baseUrl).subscribe({
      next: (books) => {
        if (books.message === books) {
          for (let book of books.payload) {
            this.book.push(book);
          }
        } else {
          this.toast.error({
            detail: 'Some error occurred on the server!',
            summary: 'Please reload the page!',
            position: 'topCenter',
            sticky: true,
          });
        }
      },
      error: (err) => console.log(err),
    });
    this.loginStatus = this.loginService.userAdmin;
  }

  //function to be called when user click deleteBook button
  deleteBook(id: string) {
    if (window.confirm('Are you sure you want to delete this book entry?')) {
      this.bookService.deleteBook(id).subscribe({
        next: (res) => {
          if (res.message === 'Book Deleted') {
            this.toast.success({
              detail: 'Book Deleted',
              summary:
                'Book with tile' + res.payload.title + 'deleted successfully.',
              position: 'topCenter',
              duration: 5000, //duration in ms
            });
            //to delete the book from local array created
            let index;
            for (let i = 0; i < this.book.length; i++) {
              if (this.book[i].id === id) {
                index = i;
                break;
              }
            }
            this.book.splice(index, 1);
          }
        },
        error: (err) => console.log(err),
      });
    }
  }

  // when the user click on update book we route him to the updateBook component
  showBook(id: string) {
    this.bookService.bookId.set(id);
    this.router.navigate(['/updateBook']);
  }
}
