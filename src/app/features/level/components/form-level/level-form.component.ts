import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Validators} from '@angular/forms';
import {FormComponent, FormField} from '@shared/components/form/form.component';
import {Level, LevelPost} from '@core/domains/level/level.model';

@Component({
  selector: 'app-level-form',
  standalone: true,
  imports: [CommonModule, FormComponent],
  templateUrl: './level-form.component.html',
})
export class LevelFormComponent {

  @Input() level: Level | null = null;

  @Input() isLoading: boolean = false;

  @Output() save = new EventEmitter<LevelPost>();
  @Output() cancel = new EventEmitter<void>();

  levelFields: FormField[] = [
    {
      key: 'name',
      label: 'Nom du niveau',
      type: 'text',
      validators: [Validators.required, Validators.minLength(3)],
      errorMessages: {
        required: 'Le nom du niveau est obligatoire.',
        minlength: 'Le nom doit faire au moins 3 caractères.'
      }
    },
    {
      key: 'abr',
      label: 'Abréviation',
      type: 'text',
      validators: [Validators.required, Validators.maxLength(5)],
      errorMessages: {
        required: 'L\'abréviation est obligatoire.',
        maxlength: 'Maximum 5 caractères autorisés.'
      }
    }
  ];

  onFormSubmit(formData: any) {
    const payload: LevelPost = {
      name: formData.name,
      abr: formData.abr
    };
    this.save.emit(payload);
  }
}
