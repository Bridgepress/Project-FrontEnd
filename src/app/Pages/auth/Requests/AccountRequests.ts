import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, ReplaySubject, throwError} from "rxjs";
import {User} from "../user.model";
import { apiEnvKey, environment } from "../../../Requests/Options/BaseUrl";

@Injectable({
  providedIn: "root"
})
export class AccountRequests {
  public constructor(private readonly http: HttpClient) {
  }

  private currentUserSource = new ReplaySubject<User | null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  register(model: any) {
    return this.http.post(`${environment(apiEnvKey)}/api/User/register`, model).pipe();
  }

  login(model: any): Observable<User> {
    return this.http.post<User>(`${environment(apiEnvKey)}/api/User/login`, model)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
