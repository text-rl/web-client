import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {RegisterUserCommand} from "../../shared/models/users/requests";
import {Observable, switchMap} from "rxjs";
import {LoginUser} from "../../shared/models/users/login-user";
import {PublicUser, Token} from "../../shared/models/users/responses";
import {ApiUrlService} from "./api-url.service";
import {ApiBaseService} from "./api-base.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends ApiBaseService {

  constructor(http: HttpClient, apiUrlService: ApiUrlService) {
    super(http, apiUrlService,"users");
  }

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
    return this.http.post(`${this.url}/registration`, user);
  }

  getMe(): Observable<PublicUser> {
    return this.http.get<PublicUser>(`${this.url}/me`);
  }

  login(user: LoginUser): Observable<PublicUser> {
    return this.http.post<Token>(`${this.url}/authentication`, user).pipe(
      switchMap(token => {
        this.setToken(token.token);
        this.setRememberMe(user.rememberMe);
        return this.getMe();
      })
    );
  }


}
