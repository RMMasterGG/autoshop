import {Routes} from '@angular/router';
import {LayoutComponent} from './layout/main-layout/main.layout';
import {LandingComponent} from './features/landing/landing.component';
import {AuthComponent} from './features/auth/auth.component';
import {LoginFormComponent} from './features/auth/forms/login-form/login-form.component';
import {RegisterFormComponent} from './features/auth/forms/register-form/register-form.component';
import {ShopComponent} from './features/shop/shop.component';
import {BookingComponent} from './features/booking/booking.component';
import {AdminLayout} from './layout/admin-layout/admin-layout';
import {AdminDashboardComponent} from './features/admin-panel/components/dashboard/dashboard';
import {AdminShopComponent} from './features/admin-panel/components/shop/shop';
import {AdminUsersComponent} from './features/admin-panel/components/users/users';
import {AdminServicesComponent} from './features/admin-panel/components/services/services';
import {AdminGuard} from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: LandingComponent,
        pathMatch: 'full',
      },
      {
        path: 'shop',
        component: ShopComponent,
        pathMatch: 'full',
      },
      {
        path: 'booking',
        component: BookingComponent,
        pathMatch: 'full',
      },
      {
        path: 'auth',
        component: AuthComponent,
        children: [
          {
            path: 'register',
            component: RegisterFormComponent,
            pathMatch: 'full',
            data: {
              icon: "person-add",
              title_part1: "form.register.title_part1",
              title_part2: "form.register.title_part2",
              subtitle: "form.register.subtitle",
              text_link: "form.register.text_link",
              link: "form.register.link",
              href: "/auth/login",
            }
          },
          {
            path: 'login',
            component: LoginFormComponent,
            pathMatch: 'full',
            data: {
              icon: "lock",
              title_part1: "form.login.title_part1",
              title_part2: "form.login.title_part2",
              subtitle: "form.login.subtitle",
              text_link: "form.login.text_link",
              link: "form.login.link",
              href: "/auth/register",
            }
          }
        ]
      }
    ]
  },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
        pathMatch: 'full',
      },
      {
        path: 'shop',
        component: AdminShopComponent,
        pathMatch: 'full',
      },
      {
        path: 'users',
        component: AdminUsersComponent,
        pathMatch: 'full',
      }
      ,
      {
        path: 'services',
        component: AdminServicesComponent,
        pathMatch: 'full',
      }
    ]
  }
];
