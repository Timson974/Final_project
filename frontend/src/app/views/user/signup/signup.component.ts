import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {SnackBarService} from "../../../shared/services/snack-bar.service";
import {Router} from "@angular/router";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {Location} from "@angular/common";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnDestroy {
  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[А-ЯЁ][а-яё]+(\s[A-ЯЁ][а-яё]+){0,3}/)]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    agree: [false, [Validators.requiredTrue]],
  });
  showPassword: boolean = false;
  private subscription: Subscription | null = null;
  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: SnackBarService, private router: Router, private location: Location) {
  }

  get email() {
    return this.signupForm.get('email')
  }
  get password() {
    return this.signupForm.get('password')
  }
  get name() {
    return this.signupForm.get('name')
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
  }

  signup() {
    if (this.signupForm.valid && this.signupForm.value.name && this.signupForm.value.email
      && this.signupForm.value.password && this.signupForm.value.agree) {
        this.subscription = (this.authService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password)
          .subscribe({
            next: (data: DefaultResponseType | LoginResponseType) => {
              let error = null;
              if ((data as DefaultResponseType).error !== undefined) {
                error = (data as DefaultResponseType).message;
              }
              const loginResponse = data as LoginResponseType;
              if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
                error = 'Ошибка регистрации';
              }
              if (error) {
                this.snackBar.openSnackBar(error);
                throw new Error(error);
              }

              this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
              this.snackBar.openSnackBar('Вы успешно зарегистрировались')
              this.location.back();
            },
            error: (errorResponse: HttpErrorResponse) => {
              if (errorResponse.error && errorResponse.error.message) {
                this.snackBar.openSnackBar(errorResponse.error.message);
              } else {
                this.snackBar.openSnackBar('Ошибка регистрации');
              }
            }
          }));
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}