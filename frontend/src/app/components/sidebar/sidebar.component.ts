import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '' },
  { path: '/icons', title: 'Icons', icon: 'ni-planet text-blue', class: '' },
  // { path: '/maps', title: 'Maps',  icon:'ni-pin-3 text-orange', class: '' },
  { path: '/user-profile', title: 'User profile', icon: 'ni-single-02 text-yellow', class: '' },
  { path: '/tables', title: 'Tables', icon: 'ni-bullet-list-67 text-red', class: '' },
  { path: '/users', title: 'Utilisateurs', icon: 'fa fa-users text-green', class: '' },
  { path: '/skills', title: 'Compétences', icon: 'fa fa-user-tie text-pink', class: '' },
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
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
}
