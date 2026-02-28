import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableColumn, TableComponent} from '@shared/components/table/table.component';
import {LevelService} from '@core/domains/level/level.service';
import {GroupService} from '@core/domains/group/group.service';
import {LucideAngularModule, SquarePen, Trash2} from 'lucide-angular';
import {ButtonComponent} from '@shared/components/button/button.component';
import {Level, LevelPost} from '@core/domains/level/level.model';
import {LevelFormComponent} from '@features/level/components/form-level/level-form.component';
import {ModalComponent} from '@shared/components/modal/modal.component';

type ViewMode = 'levels' | 'groups';

@Component({
  selector: 'app-level-container',
  standalone: true,
  imports: [CommonModule, TableComponent, LucideAngularModule, ButtonComponent, LevelFormComponent, ModalComponent],
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.css']
})
export class LevelComponent implements OnInit {
  currentView: ViewMode = 'levels';
  levels$ ;
  groups$;
  isLoading$;

  isModalOpen = false;
  selectedLevel: Level | null = null;

  readonly SquarePen= SquarePen;
  readonly Trash2= Trash2;

  constructor(private levelService: LevelService, private groupService: GroupService) {
    this.levels$ = this.levelService.levels$;
    this.groups$ = this.groupService.groups$;
    this.isLoading$ = this.levelService.isLoading$;
  }

  levelColumns: TableColumn[] = [
    { key: 'id', header: 'ID', filterable: true },
    { key: 'name', header: 'Nom du Niveau', filterable: true },
    { key: 'abr', header: 'Abreviation' },
    { key: 'actions', header: 'Actions' }
  ];

  groupColumns: TableColumn[] = [
    { key: 'id', header: 'ID', filterable: true },
    { key: 'name', header: 'Nom du Groupe', filterable: true },
    { key: 'classe', header: 'Classe / Parcours', filterable: true },
    { key: 'levelName', header: 'Niveau Parent', filterable: true },
    { key: 'actions', header: 'Actions' }
  ];

  ngOnInit(): void {
    this.levelService.loadLevels();
    this.groupService.loadAllGroups();
  }

  switchView(view: ViewMode) {
    this.currentView = view;
  }

  openAddModal() {
    this.selectedLevel = null;
    this.isModalOpen = true;
  }

  openEditModal(level: Level): void {
    this.selectedLevel = level;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedLevel = null;
  }

  onSaveLevel(levelData: LevelPost): void {
    if (this.selectedLevel) {
      this.levelService.updateLevel(this.selectedLevel.id, levelData);
    } else {
      this.levelService.createLevel(levelData);
    }
    this.closeModal();
  }

  onDeleteLevel(level: Level): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le niveau "${level.name}" ?`)) {
      this.levelService.deleteLevel(level.id);
    }
  }
}
