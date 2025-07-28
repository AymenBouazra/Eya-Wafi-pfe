import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  show: boolean;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-dark', class: '', show: true },
  { path: '/icons', title: 'Icons', icon: 'ni-planet text-dark', class: '', show: true },
  // { path: '/maps', title: 'Maps',  icon:'ni-pin-3 text-orange', class: '' },
  { path: '/user-profile', title: 'Profil utilisateur', icon: 'ni-single-02 text-dark', class: '', show: true },
  { path: '/tables', title: 'Tables', icon: 'ni-bullet-list-67 text-dark', class: '', show: true },
  { path: '/users', title: 'Utilisateurs', icon: 'fa fa-users text-dark', class: '', show: true },
  { path: '/users/add', title: 'Ajouter un utilisateur', icon: 'fa fa-plus text-dark', class: '', show: false },
  { path: '/users/edit', title: 'Modifier un utilisateur', icon: 'fa fa-edit text-dark', class: '', show: false },
  { path: '/skills', title: 'Compétences', icon: 'fa fa-user-tie text-dark', class: '', show: true },
  { path: '/skills/add', title: 'Ajouter une compétence', icon: 'fa fa-plus text-dark', class: '', show: false },
  { path: '/skills/edit', title: 'Modifier une compétence', icon: 'fa fa-edit text-dark', class: '', show: false },
  { path: '/jobs', title: 'Liste des offres de travail', icon: 'fa fa-briefcase text-dark', class: '', show: true },
  { path: '/jobs/add', title: 'Ajouter une offre de travail', icon: 'fa fa-plus text-dark', class: '', show: false },
  { path: '/jobs/edit', title: 'Modifier une offre de travail', icon: 'fa fa-edit text-dark', class: '', show: false },
  { path: '/trainings', title: 'Liste des formations', icon: 'fa fa-graduation-cap text-dark', class: '', show: true },
  { path: '/trainings/add', title: 'Ajouter une formation', icon: 'fa fa-plus text-dark', class: '', show: false },
  { path: '/trainings/edit', title: 'Modifier une formation', icon: 'fa fa-edit text-dark', class: '', show: false },

  // { path: '/jobs', title: 'Métiers', icon: 'fa fa-briefcase text-purple', class: '' },
  // { path: '/mobility', title: 'Mobilité', icon: 'fa fa-car text-orange', class: '' },
  // { path: '/trainings', title: 'Formations', icon: 'fa fa-graduation-cap text-cyan', class: '' },
  // { path: '/reports', title: 'Rapports', icon: 'fa fa-file text-brown text-primary', class: '' },

  // { path: '/login', title: 'Login',  icon:'ni-key-25 text-info', class: '' },
  // { path: '/register', title: 'Register',  icon:'ni-circle-08 text-pink', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem.show);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
}
