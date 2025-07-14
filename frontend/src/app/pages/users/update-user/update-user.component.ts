import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  userForm: FormGroup;
  submitted = false;
  managers: any[] = [];
  userId: string;
  departements: any[] = [
    { value: 'Client Success', label: 'Client Success' },
    { value: 'Support', label: 'Support' },
    { value: 'Recherche et développement', label: 'Recherche et développement' },
    { value: 'Nouvelle technologie & BI', label: 'Nouvelle technologie & BI' },
  ];
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: HotToastService
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    this.initForm();
    this.loadManagers();
    this.loadUserData(this.userId);
  }

  get f() { return this.userForm.controls; }

  initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      manager: [''],
      departement: [''],
      position: ['']
    });

    this.userForm.get('role').valueChanges.subscribe(role => {
      if (role === 'employee') {
        this.userForm.get('manager').setValidators([Validators.required]);
      } else {
        this.userForm.get('manager').clearValidators();
      }
      this.userForm.get('manager').updateValueAndValidity();
    });
  }

  loadManagers(): void {
    this.userService.getUsersPaginated('manager', 1, 10).subscribe({
      next: (managers: any) => this.managers = managers.data,
      error: (err) => console.error('Failed to load managers', err)
    });
  }

  loadUserData(userId: string): void {
    this.userService.getUserById(userId).subscribe({
      next: (user: any) => {
        this.userForm.patchValue({
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          email: user.email,
          role: user.role,
          manager: user.manager,
          departement: user.profile.departement,
          position: user.profile.position
        });
      },
      error: (err) => {
        this.toast.error('Failed to load user data');
        this.router.navigate(['/users']);
      }
    });
  }
  compareManagers(manager1: any, manager2: any): boolean {
    return manager1 && manager2 ? manager1._id === manager2._id : manager1 === manager2;
  }

  onManagerChange(selectedManager: any): void {
    this.userForm.get('manager').setValue(selectedManager);
    this.userForm.get('manager').updateValueAndValidity();
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.userForm.invalid) return;

    const userData = {
      email: this.userForm.value.email,
      role: this.userForm.value.role,
      profile: {
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        departement: this.userForm.value.departement,
        position: this.userForm.value.position
      },
      manager: this.userForm.value.manager || null
    };

    this.userService.updateUser(this.userId, userData).subscribe({
      next: () => {
        this.toast.success('User updated successfully');
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.toast.error('Failed to update user');
        console.error('Failed to update user', err);
      },
      complete: () => this.submitted = false
    });
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
