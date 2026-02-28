import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Validators} from '@angular/forms';
import {FormComponent, FormField} from '@shared/components/form/form.component';
import {Level} from '@core/domains/level/level.model';
import {Group, GroupPost} from '@core/domains/group/group.model';

@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [CommonModule, FormComponent],
  templateUrl: './group-form.component.html',
})
export class GroupFormComponent implements OnChanges {

  @Input() group: Group | null = null;

  @Input() levels: Level[] = [];

  @Input() isLoading: boolean = false;

  @Output() save = new EventEmitter<GroupPost>();
  @Output() cancel = new EventEmitter<void>();

  groupFields: FormField[] = [
    {
      key: 'name',
      label: 'Nom du groupe',
      type: 'text',
      validators: [Validators.required, Validators.minLength(2)],
      errorMessages: { required: 'Le nom est obligatoire.', minlength: 'Minimum 2 caractères.' }
    },
    {
      key: 'type',
      label: 'Type de groupe',
      type: 'select',
      options: [
        { label: 'Cours Magistral (CM)', value: 'CM' },
        { label: 'Travaux Pratiques (TP)', value: 'TP' },
        { label: 'Travaux Dirigés (TD)', value: 'TD' }
      ],
      validators: [Validators.required],
      errorMessages: { required: 'Veuillez sélectionner un type.' }
    },
    {
      key: 'classe',
      label: 'Classe / Parcours',
      type: 'text',
      validators: [Validators.required],
      errorMessages: { required: 'La classe est obligatoire.' }
    },
    {
      key: 'size',
      label: 'Capacité (Nombre d\'élèves)',
      type: 'number',
      validators: [Validators.required, Validators.min(1)],
      errorMessages: { required: 'La capacité est requise.', min: 'La capacité doit être au moins de 1.' }
    },
    {
      key: 'levelId',
      label: 'Niveau associé',
      type: 'select',
      options: [],
      validators: [Validators.required],
      errorMessages: { required: 'Vous devez lier ce groupe à un niveau.' }
    }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['levels'] && this.levels) {

      const levelField = this.groupFields.find(f => f.key === 'levelId');

      if (levelField) {
        levelField.options = this.levels.map(level => ({
          label: level.abr,
          value: level.id
        }));
      }
    }
  }

  onFormSubmit(formData: any) {
    const payload: GroupPost = {
      name: formData.name,
      type: formData.type,
      classe: formData.classe,
      size: +formData.size,
      levelId: +formData.levelId
    };

    this.save.emit(payload);
  }
}
