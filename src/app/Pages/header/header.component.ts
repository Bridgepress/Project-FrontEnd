import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { AccountRequests } from '../auth/Requests/AccountRequests';
import { User } from '../auth/user.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  public isLoggedIn: boolean = false;
  public isLoginError: boolean = false;
  public model: any = {}
  userName: string | null= '';

  constructor(public accountRequests : AccountRequests, private toastr: ToastrService, @Inject(PLATFORM_ID) private platformId: any) {}

    ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        if(localStorage.getItem('token') !== null) {
          this.isLoggedIn = true;
          this.userName = JSON.parse(localStorage.getItem('user') || '{}').userName;
        }
      }
    }

    public async login() {
      this.accountRequests.login(this.model).subscribe({
        next: (response: User) => {
          localStorage.removeItem('lastReload');
          this.isLoggedIn = true;
          this.setCurrentUser(response);
          this.isLoginError = false;
        },
        error: (error) => {
          this.isLoginError = true;
          this.toastr.error('Invalid username or password');
          setTimeout(() => {
            this.isLoginError = false;
          }, 2000);
        }
      });
    }

    public logout() {
      this.accountRequests.logout();
    }

    private setCurrentUser(user: User) {
      const decodedToken = this.getDecodedToken(user.accessToken);
      const expires = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/expiration'] || '';
      localStorage.setItem('expires', new Date(expires).getTime().toString());
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user.id);
      localStorage.setItem('token', user.accessToken);
    }

    private getDecodedToken(token: string) {
      return JSON.parse(atob(token.split('.')[1]));
    }

}
