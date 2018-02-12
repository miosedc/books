import {Component, OnInit, ViewChild} from '@angular/core';
import { AppService } from './services/app.service';
import { Book } from './book.model';
import { PageEvent } from '@angular/material';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('pagin') pagin;

  dataLength = 0;
  pageSize;

  // Counters
  countFrom: number;
  countTo: number;

  type: string;

  data: Book[] = [];

  books: Book[] = [];

  authorBooks = [];

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.getData()
      .subscribe((data) => {
        this.books = data;
        this.countFrom = 0;
        this.countTo = 10;
      });
    this.appService.getBooks()
      .subscribe((item) => {
        this.authorBooks = item;
      });
  }

  onSubmit(form: NgForm) {
    this.pagin.pageIndex = 0;
    this.countFrom = 0;
    this.countTo = 10;
    this.search(form.value.searchData, form.value.selectedData);
  }

  search(searchValue: string, selectedValue: string) {
    if (selectedValue === 'allData') {
      this.data = this.books.filter(d =>
        d['author'].toLowerCase().indexOf(searchValue.toLowerCase().trim()) >= 0 ||
        d['title'].toLowerCase().indexOf(searchValue.toLowerCase().trim()) >= 0
      );
    } else {
      this.data = this.books.filter(d =>
        d[selectedValue].toLowerCase().indexOf(searchValue.toLowerCase().trim()) >= 0
      );
    }
    this.dataLength = this.data.length;
    if (this.type !== undefined) {
      this.onSortData(this.type);
    }
  }

  onSortData(type: string) {
    // if (this.type === type) {
    //   return;
    // }
    this.data.sort((a, b) => {
      const nameA = a[type].toLowerCase();
      const nameB = b[type].toLowerCase();
      if (nameA < nameB) {
        return - 1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    this.type = type;
  }

  onChangePage(pageEvent: PageEvent) {
    pageEvent.length = Math.max(pageEvent.length, 0);
    this.countFrom = pageEvent.pageIndex * pageEvent.pageSize;
    this.countTo = this.countFrom < pageEvent.length ?
      Math.min(this.countFrom + pageEvent.pageSize, pageEvent.length) :
      this.countFrom + pageEvent.pageSize;
  }

  onAuthorHover(author: string) {
    return this.authorBooks.filter(item => item.author === author)
      .map(book => `${author} have ${book.books} ${+book.books > 1 ? 'books' : 'book'}`);
  }

}
