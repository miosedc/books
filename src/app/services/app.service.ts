import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AppService {

  constructor(private http: Http) { }

  getData() {
    return this.http.get('../../assets/data/books.json')
      .map((response: Response) => {
        return response.json();
      });
  }

  getBooks() {
    return this.http.get('../../assets/data/authorsBook.json')
      .map((response: Response) => {
        return response.json();
      });
  }


}
