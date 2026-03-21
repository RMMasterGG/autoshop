import {Routes} from '@angular/router';
import {LayoutComponent} from './layout/main-layout/main.layout';
import {HomeComponent} from './features/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full',
      },
    ]
  }
];
