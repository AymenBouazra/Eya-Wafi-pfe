import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.scss']
})
export class MyTeamComponent implements OnInit {
  users: any[] = [];
  manager: any = null;
  userRole: any = null;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    const helper = new JwtHelperService();
    const token = (localStorage.getItem('token') || '');
    const decoded = helper.decodeToken(token);
    this.userRole = decoded.userRole;
    this.userService.getColaborators(decoded.userRole).subscribe((res: any) => {
      this.users = res.users;
      this.manager = decoded.userRole === 'employee' ? res.manager : null;
    });
  }

}
