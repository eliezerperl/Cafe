import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Beverage } from '../models/beverage.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private apiUrl = `${environment.apiUrl}/beverages`;

  constructor(private http: HttpClient) {}

  getBeverages(): Observable<Beverage[]> {
    return this.http.get<Beverage[]>(this.apiUrl);
  }
}
