import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from "../../../core/auth/auth.service";
import { UserInfoType } from "../../../../types/user-info.type";
import { DefaultResponseType } from "../../../../types/default-response.type";
import { SnackBarService } from "../../services/snack-bar.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLogged: boolean = false;
  userName: string | undefined = '';
  private subscription: Subscription | null = null;

  constructor(private authService: AuthService, private snackBar: SnackBarService, private router: Router) {
    this.isLogged = this.authService.getIsLoggedIn();
    if (this.isLogged) {
      this.userName = this.authService.getUserInfo()?.name;
    }
  }

  ngOnInit(): void {

    this.subscription = this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
      const accessToken = this.authService.getTokens().accessToken;
      if (isLoggedIn && accessToken) {
        this.authService.getUserInfoFromServer(accessToken).subscribe((data: UserInfoType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            console.log((data as DefaultResponseType).message);
            throw new Error((data as DefaultResponseType).message);
          }
          this.authService.setUserInfo(data as UserInfoType);
          this.userName = (data as UserInfoType).name;
        });
      } else {
        this.userName = '';
      }
    })
  }


  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        }
      })
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.removeUserInfo();
    this.snackBar.openSnackBar('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}
