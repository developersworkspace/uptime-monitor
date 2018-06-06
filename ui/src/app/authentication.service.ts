import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  protected googleClientId = '644151655367-0i0t13urabluopnr3qsk22lijacb6j0c.apps.googleusercontent.com'; // x4-O2tQhgcK6cBYjQI_3r3Ge

  constructor(
    protected http: HttpClient,
  ) {

  }

  public getAccessToken(): string {
    const token = localStorage.getItem('authentication.token');

    return token;
  }

  public getHeaders(): HttpHeaders {
    const headers: HttpHeaders = new HttpHeaders({
      authorization: this.getAccessToken(),
    });

    return headers;
  }

  public getUser(): Observable<any> {
    return this.http.get(`${environment.apiURL}/user`, { headers: this.getHeaders() });
  }

  public isAuthenticated(): boolean {
    let token: string = this.getAccessTokenFromURL();

    if (token) {
      localStorage.setItem('authentication.token', token);
    }

    token = localStorage.getItem('authentication.token');

    return token ? true : false;
  }

  public logout(): void {
    localStorage.setItem('authentication.token', null);
    this.redirect();
  }

  public redirect(): void {
    const parameters: string[] = [
      `client_id=${this.googleClientId}`,
      `redirect_uri=${environment.production ? `http://uptime-monitor.openservices.co.za` : `http://localhost:4200`}`,
      `response_type=token`,
      `scope=https://www.googleapis.com/auth/userinfo.profile`,
    ];

    location.href = `https://accounts.google.com/o/oauth2/v2/auth?${parameters.join('&')}`;
  }

  protected getAccessTokenFromURL(): string {
    const splittedURLByHash: string[] = location.href.split('#');

    if (splittedURLByHash.length < 2) {
      return null;
    }

    const splittedQueryParametersByAmpersand: string[] = splittedURLByHash[1].split('&');

    const queryParameters: {} = {};

    for (const str of splittedQueryParametersByAmpersand) {
      queryParameters[str.split('=')[0]] = str.split('=')[1];
    }

    return queryParameters['access_token'];
  }

}
