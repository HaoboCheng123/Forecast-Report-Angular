import { HttpClient } from '@angular/common/http';
import { Data_outer } from './dataClass';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/*
Service Name:    DataService
Utility:         Handle Http request data
Function:        getData()
*/
@Injectable()
export class DataService {
  constructor(private http: HttpClient) {}

  getData(_url?: string): Observable<Data_outer[]> {
    return this.http.get<Data_outer[]>(_url);
  }
}
