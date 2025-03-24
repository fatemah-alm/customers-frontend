import {
  Component,
  ElementRef,
  Renderer2,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-customer-card',
  imports: [],
  templateUrl: './customer-card.component.html',
  styleUrl: './customer-card.component.css',
})
export class CustomerCardComponent {
  private listElement: HTMLElement | null = null;
  @Input() customer: any;
  @Output() deleteCustomer = new EventEmitter<string>();
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  toggleList(event: Event) {
    this.listElement = (event.currentTarget as HTMLElement)
      .nextElementSibling as HTMLElement;

    if (this.listElement.classList.contains('hidden')) {
      // Show the list
      this.renderer.removeClass(this.listElement, 'hidden');
      setTimeout(() => {
        this.renderer.removeClass(this.listElement, 'opacity-0');
        this.renderer.addClass(this.listElement, 'opacity-100');
      }, 10);

      // Delay adding the outside click listener to prevent instant closing
      setTimeout(() => {
        document.addEventListener('click', this.handleOutsideClick);
      }, 100);
    } else {
      this.closeList();
    }
  }

  closeList() {
    if (this.listElement) {
      this.renderer.removeClass(this.listElement, 'opacity-100');
      this.renderer.addClass(this.listElement, 'opacity-0');
      setTimeout(() => {
        this.renderer.addClass(this.listElement, 'hidden');
      }, 300);
    }

    // Remove the event listener
    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleOutsideClick = (event: Event) => {
    if (this.listElement && !this.listElement.contains(event.target as Node)) {
      this.closeList();
    }
  };

  showWarning() {
    const warning = this.el.nativeElement.querySelector('#warning');
    this.renderer.removeClass(warning, 'hidden');

    setTimeout(() => {
      this.renderer.removeClass(warning, 'opacity-0');
      this.renderer.addClass(warning, 'opacity-100');
    }, 10);
  }

  hideWarning() {
    const warning = this.el.nativeElement.querySelector('#warning');
    this.renderer.removeClass(warning, 'opacity-100');
    this.renderer.addClass(warning, 'opacity-0');

    setTimeout(() => {
      this.renderer.addClass(warning, 'hidden');
    }, 500);
  }

  onDelete() {
    this.deleteCustomer.emit(this.customer.id);
    this.hideWarning();
  }
}
