import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;
  editMode = false;
  submitted = false;
  managers: any[] = [];
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
    private toast: HotToastService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadManagers();
  }

  get f() { return this.userForm.controls; }

  initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      manager: ['', Validators.required],
      departement: ['', Validators.required],
      position: ['', Validators.required]
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
    this.userService.addUser(userData).subscribe({
      next: () => {
        this.toast.success('User added successfully');
        this.router.navigate(['/users']);
      },
      error: (err) => console.error('Failed to add user', err),
      complete: () => this.submitted = false
    });
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}