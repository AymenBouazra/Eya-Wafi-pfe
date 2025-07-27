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
import { ListJobComponent } from 'src/app/pages/jobs/list-job/list-job.component';
import { AddJobComponent } from 'src/app/pages/jobs/add-job/add-job.component';
import { EditJobComponent } from 'src/app/pages/jobs/edit-job/edit-job.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'tables', component: TablesComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'users', component: UsersListComponent, title: 'Liste des utilisateurs' },
    { path: 'users/add', component: AddUserComponent, title: 'Ajouter un utilisateur' },
    { path: 'users/edit/:id', component: UpdateUserComponent, title: 'Modifier un utilisateur' },
    { path: 'skills', component: SkillsListComponent, title: 'Liste des talents' },
    { path: 'skills/add', component: AddSkillComponent, title: 'Ajouter un talent' },
    { path: 'skills/edit/:id', component: UpdateSkillComponent, title: 'Modifier un talent' },
    { path: 'jobs', component: ListJobComponent, title: 'Liste des offres d\'emploi' },
    { path: 'jobs/add', component: AddJobComponent, title: 'Ajouter une offre d\'emploi' },
    { path: 'jobs/edit/:id', component: EditJobComponent, title: 'Modifier une offre d\'emploi' }
];
