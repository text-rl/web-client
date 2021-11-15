import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {RegisterUserCommand} from "../../shared/models/users/requests";
import {Observable, switchMap} from "rxjs";
import {LoginUser} from "../../shared/models/users/login-user";
import {PublicUser, Token} from "../../shared/models/users/responses";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {
  }

  private apiUrl = `${environment.apiUrl}/users`;
  private tokenKey = environment.webStorageTokenKey;
  private rememberMeKey = environment.rememberMeKey;

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public clearLocalUserData(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setRememberMe(rememberMe: boolean): void {
    localStorage.setItem(this.rememberMeKey, String(rememberMe));
  }

  public getRememberMe(): boolean {
    return localStorage.getItem(this.rememberMeKey) === 'true';
  }

  register(user: RegisterUserCommand): Observable<any> {
    return this.http.post(`${this.apiUrl}/registration`, user);
  }

  getMe(): Observable<PublicUser> {
    return this.http.get<PublicUser>(`${this.apiUrl}/me`);
  }

  login(user: LoginUser): Observable<PublicUser> {
    return this.http.post<Token>(`${this.apiUrl}/authentication`, user).pipe(
      switchMap(token => {
        this.setToken(token.token);
        this.setRememberMe(user.rememberMe);
        return this.getMe();
      })
    );
  }

}
