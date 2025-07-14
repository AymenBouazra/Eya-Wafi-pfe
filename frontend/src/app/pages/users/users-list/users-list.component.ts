import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Store } from '@ngrx/store';
import { selectRole, selectToken } from 'src/app/store/selectors/auth.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  token$: Observable<string | null>;
  role$: Observable<string | null>;
  users: any[] = [];
  userStatus = 'all';
  currentPage = 1;
  itemsPerPage = 5;
  pageSize = 5;
  totalItems = 0;
  loading = false;
  constructor(
    private store: Store,
    private userService: UserService,
    private toast: HotToastService,
  ) { }

  ngOnInit(): void {
    this.loadUsers(this.userStatus);
    this.store.select(selectToken)
    this.store.select(selectRole)
  }

  loadUsers(status: string) {
    this.loading = true;
    this.userService.getUsersPaginated('all', this.currentPage, this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.users = res.data;

        this.totalItems = res.pagination.total;

        this.loading = false;
      },
      error: (err) => {
        this.toast.error('Failed to load users');
        this.loading = false;
      }
    });
  }
  toggleActiveUsers(status: string) {
    this.loadUsers(status);
    this.userStatus = status;
  }
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers(this.userStatus);
  }

  getRoleLabel(role: string): string {
    const roles = {
      'employee': 'Employé',
      'manager': 'Manager',
      'hr': 'RH'
    };
    return roles[role] || role;
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe({
      next: (data: any) => {
        this.loadUsers(this.userStatus);
        this.toast.success(data.message,
          {
            theme: 'snackbar',
          }
        );
      },
      error: (err) => {
        this.toast.error('Erreur lors de la suppression de l\'utilisateur');
      },
      complete: () => console.log('complete'),
    })
  }
}
