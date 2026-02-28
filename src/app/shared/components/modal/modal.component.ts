import {Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnChanges, OnDestroy {
  @Input() isOpen: boolean = false;

  @Input() title: string = '';
  @Input() size: ModalSize = 'md';
  @Input() closeOnBackdropClick: boolean = true;

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() onClose = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  close(): void {
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);
    this.onClose.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdropClick && (event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: Event): void {
    if (this.isOpen && this.closeOnBackdropClick) {
      this.close();
    }
  }

  get modalSizeClass(): string {
    return `modal-${this.size}`;
  }
}
