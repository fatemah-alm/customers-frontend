import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CustomerService } from '../../core/services/customer/customer.service';
import { CommonModule } from '@angular/common';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-edit-customer-dialog',
  templateUrl: './edit-customer-dialog.component.html',
  styleUrls: ['./edit-customer-dialog.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class EditCustomerDialogComponent {
  editCustomerForm: FormGroup;
  @Output() customerUpdated = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<EditCustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private customerService: CustomerService
  ) {
    this.editCustomerForm = new FormGroup({
      name: new FormControl<string>(data.customer.name, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      number: new FormControl<string>(data.customer.number, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(9)],
      }),
      dob: new FormControl<string>(this.formatDate(data.customer.dob), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      gender: new FormControl<string>(data.customer.gender, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }
  formatDate(isoString: string): string {
    if (!isoString) return ''; // Handle empty case
    return isoString.split('T')[0]; // Extract only YYYY-MM-DD
  }

  onSubmit() {
    if (this.editCustomerForm.valid) {
      const updatedCustomer = {
        ...this.data.customer,
        ...this.editCustomerForm.value,
        number: Number(this.editCustomerForm.value.number),
        dob: new Date(this.editCustomerForm.value.dob).toISOString(),
      };

      this.customerService
        .updateCustomer(this.data.customer.id, updatedCustomer)
        .subscribe({
          next: (v) => console.log(v),
          error: (e) => console.log(e),
          complete: () => {
            this.data.onSuccess();
            this.dialogRef.close(updatedCustomer);
            console.log(updatedCustomer);
          },
        });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  validateNumberInput(event: KeyboardEvent) {
    const charCode = event.key;
    if (!/^\d$/.test(charCode)) {
      event.preventDefault();
    }
  }

  get numberControl() {
    return this.editCustomerForm.controls['number'];
  }
}
