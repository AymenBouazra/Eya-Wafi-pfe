import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersListComponent } from 'src/app/pages/users/users-list/users-list.component';
import { AddUserComponent } from 'src/app/pages/users/add-user/add-user.component';
import { UpdateUserComponent } from 'src/app/pages/users/update-user/update-user.component';
import { HeaderBodyComponent } from 'src/app/components/header-body/header-body.component';
import { AddSkillComponent } from 'src/app/pages/skills/add-skill/add-skill.component';
import { SkillsListComponent } from 'src/app/pages/skills/skills-list/skills-list.component';
import { UpdateSkillComponent } from 'src/app/pages/skills/update-skill/update-skill.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddJobComponent } from 'src/app/pages/jobs/add-job/add-job.component';
import { ListJobComponent } from 'src/app/pages/jobs/list-job/list-job.component';
import { EditJobComponent } from 'src/app/pages/jobs/edit-job/edit-job.component';
import { AddTrainingComponent } from 'src/app/pages/trainings/add-training/add-training.component';
import { EditTrainingComponent } from 'src/app/pages/trainings/edit-training/edit-training.component';
import { ListTrainingComponent } from 'src/app/pages/trainings/list-training/list-training.component';
import { JobsEmployeeListComponent } from 'src/app/pages/mobility-requests/jobs-employee-list/jobs-employee-list.component';
import { DashboardListComponent } from 'src/app/pages/mobility-requests/dashboard-list/dashboard-list.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    NgbPaginationModule,
    NgSelectModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    UsersListComponent,
    AddUserComponent,
    UpdateUserComponent,
    HeaderBodyComponent,
    AddSkillComponent,
    SkillsListComponent,
    UpdateSkillComponent,
    AddJobComponent,
    ListJobComponent,
    EditJobComponent,
    AddTrainingComponent,
    EditTrainingComponent,
    ListTrainingComponent,
    JobsEmployeeListComponent,
    DashboardListComponent
  ]
})

export class AdminLayoutModule { }
