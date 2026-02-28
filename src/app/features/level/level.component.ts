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
import {Group, GroupPost} from '@core/domains/group/group.model';
import {GroupFormComponent} from '@features/level/components/group-form/group-form.component';

type ViewMode = 'levels' | 'groups';

@Component({
  selector: 'app-level-container',
  standalone: true,
  imports: [CommonModule, TableComponent, LucideAngularModule, ButtonComponent, LevelFormComponent, ModalComponent, GroupFormComponent],
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.css']
})
export class LevelComponent implements OnInit {
  currentView: ViewMode = 'levels';
  levels$ ;
  groups$;
  isLoading$;

  isModalLevelOpen = false;
  selectedLevel: Level | null = null;

  isGroupModalOpen = false;
  selectedGroup: Group | null = null;

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

  openAddModal(){
    if (this.currentView === 'levels') {
      this.selectedLevel = null;
      this.isModalLevelOpen = true;
    }
    else {
      this.selectedGroup = null;
      this.isGroupModalOpen = true;
    }
  }

  onSaveLevel(levelData: LevelPost): void {
    if (this.selectedLevel) {
      this.levelService.updateLevel(this.selectedLevel.id, levelData);
    } else {
      this.levelService.createLevel(levelData);
    }
    this.isModalLevelOpen = false;
  }

  onDeleteLevel(level: Level): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le niveau "${level.name}" ?`)) {
      this.levelService.deleteLevel(level.id);
    }
  }

  onSaveGroup(groupPayload: GroupPost) {
    if (this.selectedGroup) {
      this.groupService.updateGroup(this.selectedGroup.id, groupPayload);
    } else {
      this.groupService.createGroup(groupPayload);
    }
    this.isGroupModalOpen = false;
  }

  onDeleteGroup(group: Group): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le groupe "${group.name}" ?`)) {
      this.groupService.deleteGroup(group.id);
    }
  }
}
