import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn} from '@angular/forms';
import {ButtonComponent} from '@shared/components/button/button.component';

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'textarea';
  options?: { label: string, value: any }[];
  validators?: ValidatorFn[];
  errorMessages?: { [key: string]: string };
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnChanges {

  @Input() fields: FormField[] = [];

  @Input() initialData: any = null;

  @Input() isLoading: boolean = false;
  @Input() submitLabel: string = 'Sauvegarder';

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData'] && this.form) {
      if (this.initialData) {
        this.form.patchValue(this.initialData);
      } else {
        this.form.reset();
      }
    }
  }

  private buildForm(): void {
    const group: any = {};

    this.fields.forEach(field => {
      group[field.key] = ['', field.validators || []];
    });

    this.form = this.fb.group(group);

    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.value);
    this.form.reset();
  }

  hasError(field: FormField, errorType: string): boolean {
    const control = this.form.get(field.key);
    return !!(control && control.invalid && control.touched && control.hasError(errorType));
  }
}
