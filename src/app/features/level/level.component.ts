import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableColumn, TableComponent} from '@shared/components/table/table.component';
import {LevelService} from '@core/domains/level/level.service';
import {GroupService} from '@core/domains/group/group.service';
import {LucideAngularModule, SquarePen, Trash2} from 'lucide-angular';
import {ButtonComponent} from '@shared/components/button/button.component';

type ViewMode = 'levels' | 'groups';

@Component({
  selector: 'app-level-container',
  standalone: true,
  imports: [CommonModule, TableComponent, LucideAngularModule, ButtonComponent],
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.css']
})
export class LevelComponent implements OnInit {
  currentView: ViewMode = 'levels';
  levels$ ;
  groups$;
  isLoading$;

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
}
