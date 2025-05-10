import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { UsersListComponent } from 'src/app/pages/users/users-list/users-list.component';
import { AddUserComponent } from 'src/app/pages/users/add-user/add-user.component';
import { UpdateUserComponent } from 'src/app/pages/users/update-user/update-user.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'tables', component: TablesComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'users', component: UsersListComponent },
    { path: 'users/add', component: AddUserComponent },
    { path: 'users/edit/:id', component: UpdateUserComponent },
];
