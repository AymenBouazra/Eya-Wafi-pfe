import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/pages/services/auth.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-dark', class: '' },
  { path: '/icons', title: 'Icons', icon: 'ni-planet text-dark', class: '' },
  { path: '/user-profile', title: 'Profil utilisateur', icon: 'ni-single-02 text-dark', class: '' },
  { path: '/tables', title: 'Tables', icon: 'ni-bullet-list-67 text-dark', class: '' },
  { path: '/users', title: 'Utilisateurs', icon: 'fa fa-users text-dark', class: '' },
  { path: '/users/add', title: 'Ajouter un utilisateur', icon: 'fa fa-plus text-dark', class: '' },
  { path: '/users/edit', title: 'Modifier un utilisateur', icon: 'fa fa-edit text-dark', class: '' },
  { path: '/skills', title: 'Compétences', icon: 'fa fa-user-tie text-dark', class: '' },
  { path: '/skills/add', title: 'Ajouter une compétence', icon: 'fa fa-plus text-dark', class: '' },
  { path: '/skills/edit', title: 'Modifier une compétence', icon: 'fa fa-edit text-dark', class: '' },
  { path: '/jobs', title: 'Liste des offres de travail', icon: 'fa fa-briefcase text-dark', class: '' },
  { path: '/jobs/add', title: 'Ajouter une offre de travail', icon: 'fa fa-plus text-dark', class: '' },
  { path: '/jobs/edit', title: 'Modifier une offre de travail', icon: 'fa fa-edit text-dark', class: '' },
  { path: '/trainings', title: 'Liste des formations', icon: 'fa fa-graduation-cap text-dark', class: '' },
  { path: '/trainings/add', title: 'Ajouter une formation', icon: 'fa fa-plus text-dark', class: '' },
  { path: '/trainings/edit', title: 'Modifier une formation', icon: 'fa fa-edit text-dark', class: '' },
  { path: '/job-marketplace', title: 'Marché de l\'emploi', icon: 'fa fa-store text-dark', class: '' },
  { path: '/applications', title: 'Demandes de mobilité', icon: 'fa fa-rocket text-dark', class: '' },
  { path: '/my-applications', title: 'Mes demandes de mobilité', icon: 'fa fa-briefcase text-dark', class: '' },
  { path: '/my-team', title: 'Mon équipe', icon: 'fa fa-users text-dark', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  role: string = '';
  roles: string[] = ['hr', 'manager', 'employee'];
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: any) => {
      this.role = user.role;
      this.menuItems = ROUTES.filter(menuItem => {
        if (this.role === 'hr') {
          return menuItem.path === '/dashboard' || menuItem.path === '/users' ||
            menuItem.path === '/jobs' || menuItem.path === '/applications' ||
            menuItem.path === '/job-marketplace' || menuItem.path === '/skills';
        }
        if (this.role === 'employee') {
          return menuItem.path === '/my-applications' || menuItem.path === '/job-marketplace' || menuItem.path === '/my-team';
        }
        if (this.role === 'manager') {
          return menuItem.path === '/jobs' || menuItem.path === '/applications' || menuItem.path === '/my-team';
        }
        return false;
      });
    });
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
}
