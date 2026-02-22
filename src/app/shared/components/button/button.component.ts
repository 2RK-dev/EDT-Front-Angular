import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {

  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() fullWidth: boolean = false;

  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() type: ButtonType = 'button';

  @Output() btnClick = new EventEmitter<Event>();

  onClick(event: Event): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.btnClick.emit(event);
  }

  get buttonClasses(): { [key: string]: boolean } {
    return {
      'btn-base': true,
      [`btn-${this.size}`]: true,
      [`btn-${this.variant}`]: true,
      'btn-full': this.fullWidth,
      'is-loading': this.loading
    };
  }
}
