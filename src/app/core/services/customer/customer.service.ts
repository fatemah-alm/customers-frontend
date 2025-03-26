import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = 'http://localhost:8000/customers'; // API URL (Express Backend)

  constructor(private http: HttpClient) {}

  getCustomers(
    page: number,
    limit: number,
    searchTerm: string = '',
    selectedGender: string = ''
  ): Observable<any> {
    const params: any = {
      page,
      limit,
    };

    if (!isNaN(parseInt(searchTerm))) {
      params.number = parseInt(searchTerm);
    } else if (searchTerm) {
      params.search = searchTerm;
    }

    if (selectedGender) {
      params.gender = selectedGender;
    }

    return this.http.get(`${this.apiUrl}`, { params });
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
  searchCustomers(searchTerm: string = ''): Observable<any[]> {
    return this.http.get<any[]>(
      `http://localhost:8000/customers?search=${searchTerm}`
    );
  }
}
