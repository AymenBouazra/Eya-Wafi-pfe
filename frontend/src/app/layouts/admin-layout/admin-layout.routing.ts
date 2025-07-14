import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { UsersListComponent } from 'src/app/pages/users/users-list/users-list.component';
import { AddUserComponent } from 'src/app/pages/users/add-user/add-user.component';
import { UpdateUserComponent } from 'src/app/pages/users/update-user/update-user.component';
import { SkillsListComponent } from 'src/app/pages/skills/skills-list/skills-list.component';
import { AddSkillComponent } from 'src/app/pages/skills/add-skill/add-skill.component';
import { UpdateSkillComponent } from 'src/app/pages/skills/update-skill/update-skill.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'tables', component: TablesComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'users', component: UsersListComponent },
    { path: 'users/add', component: AddUserComponent },
    { path: 'users/edit/:id', component: UpdateUserComponent },
    { path: 'skills', component: SkillsListComponent },
    { path: 'skills/add', component: AddSkillComponent },
    { path: 'skills/edit/:id', component: UpdateSkillComponent },
];
