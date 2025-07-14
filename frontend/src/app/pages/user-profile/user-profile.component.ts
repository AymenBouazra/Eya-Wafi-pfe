import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { SkillService } from '../services/skill.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  selectedSkillIds: string[] = [];
  currentUser: any;
  userForm: FormGroup;
  skillValue: string;
  managers: any[] = [];
  skills: any[] = [];
  userId: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private skillService: SkillService,
    private router: Router,
    private toast: HotToastService,
  ) {

  }

  ngOnInit() {
    this.initializeForm();
    this.loadUserData();
    this.loadManagers();
    this.loadSkills();
  }

  initializeForm() {
    this.userForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('', [Validators.required]),
      manager: new FormControl(''),
      departement: new FormControl(''),
      position: new FormControl(''),
      skills: new FormControl([]),
      experience: new FormArray([])
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


  get experienceControls() {
    return (this.userForm.get('experience') as FormArray).controls;
  }


  onManagerChange(e: any) {
    this.userForm.get('manager').setValue(e);
  }

  addExperience(): void {
    const experienceGroup = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      duration: ['', Validators.required],
      description: ['', Validators.required]
    });
    (this.userForm.get('experience') as FormArray).push(experienceGroup);
  }

  loadManagers(): void {
    this.userService.getUsers('manager').subscribe({
      next: (managers: any) => {
        this.managers = managers
      },
      error: (err) => console.error('Failed to load managers', err)
    });
  }

  loadSkills(): void {
    this.skillService.getSkills().subscribe({
      next: (skills: any) => {
        this.skills = skills;
      },
      error: (err) => console.error('Failed to load skills', err)
    });
  }

  compareManagers(m1: any, m2: any): boolean {
    if (m1 && m2) {
      return m1._id === m2._id || m1 === m2._id || m1._id === m2;
    }
    return false;
  }
  loadUserData(): void {
    this.skillService.getSkills().subscribe(allSkills => {
      this.skills = allSkills;

      this.userService.getUsers('manager').subscribe(managers => {
        this.managers = managers;

        this.userService.getCurrentUser().subscribe({
          next: (user: any) => {
            this.currentUser = user;
            this.userId = user._id;

            const managerValue = typeof user.manager === 'object'
              ? user.manager._id
              : user.manager;


            this.userForm.patchValue({
              firstName: user?.profile?.firstName,
              lastName: user?.profile?.lastName,
              email: user.email,
              role: user.role,
              manager: managerValue,
              departement: user.profile.departement,
              position: user.profile.position,
              skills: user.profile.skills,
            });

            this.patchExperience(user.profile.experience);

          },
          error: (err) => {
            this.toast.error('Failed to load user data');
            this.router.navigate(['/users']);
          }
        });
      });
    });
  }


  compareSkills(s1: any, s2: any): boolean {
    return s1?._id === s2?._id;
  }

  patchExperience(experience: any[]): void {
    const expFormArray = this.userForm.get('experience') as FormArray;
    expFormArray.clear();
    if (experience && experience.length) {
      experience.forEach(exp => {
        expFormArray.push(this.fb.group({
          title: exp.title,
          company: exp.company,
          duration: exp.duration,
          description: exp.description
        }));
      });
    }
  }
  removeExperience(index: number): void {
    const expFormArray = this.userForm.get('experience') as FormArray;
    expFormArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      userData.profile = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        skills: userData.skills,
        experience: userData.experience,
        departement: userData.departement,
        position: userData.position
      };
      if (this.userId) {
        this.userService.updateUser(this.userId, userData).subscribe({
          next: () => {
            this.toast.success('User updated successfully');
          },
          error: (err) => {
            this.toast.error('Failed to update user');
            console.error(err);
          }
        });
      }
    }
    else {
      console.log(this.userForm.errors);

    }
  }
}
