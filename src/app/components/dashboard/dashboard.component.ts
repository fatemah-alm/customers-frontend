import { Component, ElementRef, inject, Renderer2 } from '@angular/core';
import { CustomerCardComponent } from '../customer-card/customer-card.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  template: ` <button (click)="openPopup()">Open Popup</button> `,
})
export class DashboardComponent {
  customers: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 5;
  duplicateError: boolean = false;
  duplicateErrorMessage: string = '';
  generalError: boolean = false;
  generalErrorMessage: string = '';

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
      validators: [Validators.required],
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

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService
      .getCustomers(this.currentPage, this.limit)
      .subscribe((data: any) => {
        this.customers = data.customers;
        this.totalPages = data.totalPages;
        console.log(this.customers);
      });
  }

  onPageChanged(page: number) {
    this.currentPage = page;
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
        // add here toast for customer added succesfully
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
  }
}
