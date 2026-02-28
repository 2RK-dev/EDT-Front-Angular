import {Routes} from '@angular/router';
import {LevelComponent} from '@features/level/level.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'level',
    pathMatch: 'full',
  },
  {
    path: 'level',
    component: LevelComponent,
  },
];
