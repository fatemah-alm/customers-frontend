import { Component, ElementRef, inject, Renderer2 } from '@angular/core';
import { CustomerCardComponent } from '../customer-card/customer-card.component';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
  FormsModule,
} from '@angular/forms';
import { CustomerService } from '../../core/services/customer/customer.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CustomerCardComponent,
    ReactiveFormsModule,
    CommonModule,
    PaginationComponent,
    FormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  template: ` <button (click)="openPopup()">Open Popup</button> `,
})
export class DashboardComponent {
  customers: any[] = [];
  allCustomers: any[] = [];
  filteredCustomers: any[] = [];
  selectedGender = '';
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 5;
  duplicateError: boolean = false;
  duplicateErrorMessage: string = '';
  generalError: boolean = false;
  generalErrorMessage: string = '';
  maxDate: string = new Date().toISOString().split('T')[0];
  searchQuery: string = '';

  addCustomerForm = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    number: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(9)],
    }),
    dob: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, this.futureDateValidator()],
    }),
    gender: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  get name() {
    return this.addCustomerForm.controls.name;
  }
  get number() {
    return this.addCustomerForm.controls.number;
  }
  get dob() {
    return this.addCustomerForm.controls.dob;
  }
  get gender() {
    return this.addCustomerForm.controls.gender;
  }
  validateNumberInput(event: KeyboardEvent) {
    const charCode = event.key;
    if (!/^\d$/.test(charCode)) {
      event.preventDefault();
    }
  }
  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return null; // If no date, no validation needed

      const selectedDate = new Date(control.value);
      const today = new Date();

      if (selectedDate > today) {
        return { futureDate: true }; // Validation error
      }
      return null; // Valid date
    };
  }

  ngOnInit() {
    const savedState = sessionStorage.getItem('customerFilters');
    if (savedState) {
      const state = JSON.parse(savedState);
      this.currentPage = state.currentPage;
      this.limit = state.limit;
      this.searchQuery = state.searchQuery;
      this.selectedGender = state.selectedGender;
    }
    this.loadCustomers();
  }

  updateFilters(): void {
    const state = {
      currentPage: this.currentPage,
      limit: this.limit,
      searchQuery: this.searchQuery,
      selectedGender: this.selectedGender,
    };

    sessionStorage.setItem('customerFilters', JSON.stringify(state));

    this.loadCustomers();
  }
  loadCustomers() {
    this.customerService
      .getCustomers(
        this.currentPage,
        this.limit,
        this.searchQuery,
        this.selectedGender
      )
      .subscribe((data: any) => {
        this.customers = data.customers;
        this.allCustomers = data.allCustomers;
        this.totalPages = data.totalPages;
        console.log(this.customers);
      });
  }
  onSearchChange(): void {
    this.currentPage = 1;
    this.updateFilters();
    this.loadCustomers();
  }

  onPageChanged(page: number) {
    this.currentPage = page;
    this.updateFilters();

    this.loadCustomers();
  }
  onFilterChange(): void {
    this.currentPage = 1;
    this.updateFilters();

    this.loadCustomers();
  }

  showDialog() {
    const dialog = this.el.nativeElement.querySelector('#dialog');
    this.renderer.removeClass(dialog, 'hidden');

    setTimeout(() => {
      this.renderer.removeClass(dialog, 'opacity-0');
      this.renderer.addClass(dialog, 'opacity-100');
    }, 10);
  }

  hideDialog() {
    const dialog = this.el.nativeElement.querySelector('#dialog');
    this.renderer.removeClass(dialog, 'opacity-100');
    this.renderer.addClass(dialog, 'opacity-0');

    setTimeout(() => {
      this.renderer.addClass(dialog, 'hidden');
    }, 500);
  }

  onFormSubmit() {
    let payload = {
      name: this.addCustomerForm.value.name,
      number: Number(this.addCustomerForm.value.number),
      dob: this.addCustomerForm.value.dob,
      gender: this.addCustomerForm.value.gender,
    };

    this.customerService.addCustomer(payload).subscribe({
      next: (v) => console.log(v),
      error: (e: HttpErrorResponse) => {
        console.log(e);
        if (e.status === 409) {
          this.duplicateError = true;
          this.duplicateErrorMessage = 'This customer number already exists.';
        } else if (e.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.generalError = true;
          this.generalErrorMessage =
            'An error occurred while adding the customer.';
        }
        setTimeout(() => {
          this.duplicateError = false;
        }, 5000);
      },
      complete: () => {
        this.loadCustomers();
        this.hideDialog();
      },
    });
  }

  onDeleteCustomer(customerId: string) {
    this.customerService.deleteCustomer(customerId).subscribe(() => {
      console.log('Customer deleted');
    });
    this.customers = this.customers.filter(
      (customer) => customer.id !== customerId
    );
    this.allCustomers = this.allCustomers.filter(
      (customer) => customer.id !== customerId
    );
  }
}
