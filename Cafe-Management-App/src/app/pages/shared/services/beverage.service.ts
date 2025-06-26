import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Beverage, BeverageDTO } from 'src/app/models/beverage.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BeverageService {
  private apiUrl = `${environment.apiUrl}/beverages`;

  constructor(private http: HttpClient) {}

  // Beverages
  getBeverages(): Observable<Beverage[]> {
    return this.http.get<Beverage[]>(`${this.apiUrl}`);
  }

  updateBeverage(
    id: string,
    unitsInStock: number,
    newPrice = 0
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${id}?unitsInStock=${unitsInStock}&newPrice=${newPrice}`,
      {}
    );
  }

  addBeverage(beverageDto: BeverageDTO): Observable<Beverage> {
    return this.http.post<Beverage>(`${this.apiUrl}`, beverageDto);
  }

  deleteBeverage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
