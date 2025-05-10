import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { User } from 'src/app/variables/user';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated, selectRole, selectToken } from 'src/app/store/selectors/auth.selectors';
import { loginSuccess } from 'src/app/store/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  token$: Observable<string | null>;
  role$: Observable<string | null>;

  userExists: boolean = false;
  userHavePassword: boolean = false;
  user: User;
  loginForm?: FormGroup
  isSubmitted = false;
  isLoading = false;
  constructor(private store: Store, private router: Router, private authService: AuthService, private toast: HotToastService) {

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]),
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
    });
  }

  ngOnInit() {
  }
  get f() {
    return this.loginForm.controls;
  }

  checkUserExists() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      this.toast.error('Remplissez tous les champs', {
        duration: 3000,
        position: 'bottom-center',
      });
      return;
    }
    console.log(this.loginForm.errors);


    this.authService.checkEmail(this.loginForm.value).subscribe({
      next: (v: any) => {
        this.user = v;
        if (v.email) {
          this.userExists = true;
        }
        if (v.password) {
          this.userHavePassword = true;
        }
      },
      error: (e) => {
        if (e.status === 404) {
          this.toast.error('Cet utilisateur n\'existe pas', {
            duration: 3000,
            position: 'bottom-center',
          });
        } else {
          console.log(e);
        }
      },
      complete: () => console.info('complete'),
    });
  }
  submit() {
    if (this.loginForm.invalid) {
      this.toast.error('Remplissez tous les champs', {
        duration: 3000,
        position: 'bottom-center',
      });
      return;
    }
    if (this.userHavePassword && this.f.password.valid) {
      this.f.password.addValidators([Validators.minLength(6), Validators.required]);
      this.authService.login(this.loginForm.value).subscribe({
        next: (v: any) => {
          this.isLoading = true;
          localStorage.setItem('token', v.token);
          localStorage.setItem('role', v.role);
          this.store.dispatch(loginSuccess({
            token: v.token,
            role: v.role
          }));
          this.router.navigate(['/dashboard']);
          this.toast.success(v.message)
        },
        error: (e) => console.error(e),
        complete: () => {
          this.isLoading = false;
          this.isSubmitted = false;
          console.info('complete');
        },
      });
    } else if (!this.userHavePassword && this.f.password.valid && this.f.confirmPassword.valid) {
      this.f.password.addValidators([Validators.minLength(6), Validators.required]);
      this.f.confirmPassword.addValidators([Validators.minLength(6), Validators.required]);
      if (this.f.password.value === this.f.confirmPassword.value) {
        this.authService.updateAndLogin(this.user._id, this.loginForm.value).subscribe({
          next: (v: any) => {
            localStorage.setItem('token', v.token);
            localStorage.setItem('role', v.role);
            this.store.dispatch(loginSuccess({
              token: v.token,
              role: v.role
            }));
            this.router.navigate(['/dashboard']);
            this.toast.success(v.message)
          },
          error: (e) => console.error(e),
          complete: () => console.info('complete'),
        });
      } else {
        this.toast.error('Les mots de passe ne correspondent pas', {
          duration: 3000,
          position: 'bottom-center',
        });
      }
    }
  }

}
