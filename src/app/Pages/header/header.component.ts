import { Component } from '@angular/core';
import { AccountRequests } from '../auth/Requests/AccountRequests';
import { User } from '../auth/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  public isLoggedIn: boolean = false;
  public isLoginError: boolean = false;
  public model: any = {}

  constructor(private accountRequests : AccountRequests) {}

    ngOnInit(): void {

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
          setTimeout(() => {
            this.isLoginError = false;
          }, 2000);
        }
      });
    }

    public logout() {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('expires');
      localStorage.removeItem('userId');
      this.isLoggedIn = false;
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
