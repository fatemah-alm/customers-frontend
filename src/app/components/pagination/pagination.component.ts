import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChanged = new EventEmitter<number>();

  previousPage() {
    if (this.currentPage > 1) {
      this.pageChanged.emit(this.currentPage - 1); // Emit the page number directly
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.pageChanged.emit(this.currentPage + 1); // Emit the page number directly
    }
  }
}
