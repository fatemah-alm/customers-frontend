import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CustomerCardComponent } from '../customer-card/customer-card.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  imports: [CustomerCardComponent, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  template: ` <button (click)="openPopup()">Open Popup</button> `,
})
export class DashboardComponent {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

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

  addCustomerForm = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true }),
    number: new FormControl<number>(0, { nonNullable: true }),
    dob: new FormControl<string>('', { nonNullable: true }),
    gender: new FormControl<string>('', { nonNullable: true }),
  });

  onFormSubmit() {
    console.log(this.addCustomerForm.value);
    this.hideDialog();
  }

  validateNumberInput(event: KeyboardEvent) {
    const charCode = event.key;
    if (!/^\d$/.test(charCode)) {
      event.preventDefault();
    }
  }
}
