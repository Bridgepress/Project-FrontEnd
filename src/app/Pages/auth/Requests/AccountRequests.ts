import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, ReplaySubject, tap, throwError } from "rxjs";
import { User } from "../user.model";
import { apiEnvKey, environment } from "../../../Requests/Options/BaseUrl";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root"
})
export class AccountRequests {
  private currentUserSource = new ReplaySubject<User | null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private readonly http: HttpClient, private toastr: ToastrService) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user: User = JSON.parse(storedUser);
        this.currentUserSource.next(user);
      } else {
        this.currentUserSource.next(null);
      }
    } else {
      this.currentUserSource.next(null);
    }
  }

  register(model: any): Observable<any> {
    return this.http.post(`${environment(apiEnvKey)}/api/User/register`, model)
      .pipe(
        catchError((error) => {
          if (error.status === 400 && error.error.includes("User with this email already exists")) {
            this.toastr.error('User with this email already exists', 'Registration Failed');
          }
          return throwError(error);
        })
      );
  }

  login(model: any): Observable<User> {
    return this.http.post<User>(`${environment(apiEnvKey)}/api/User/login`, model)
      .pipe(
        tap((user: User) => {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('user', JSON.stringify(user));
          }
          this.currentUserSource.next(user);
        }),
        catchError((error) => {
          this.toastr.error(error.error);
          return throwError(error);
        })
      );
  }

  public logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('expires');
      localStorage.removeItem('userId');
    }

    this.currentUserSource.next(null); 
  }
}
