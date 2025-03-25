import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = 'http://localhost:8000/customers'; // API URL (Express Backend)

  constructor(private http: HttpClient) {}

  getCustomers(page: number, limit: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  addCustomer(customer: any): Observable<any> {
    return this.http.post(this.apiUrl, customer);
  }

  updateCustomer(id: string, customer: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
