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
    let headers: HttpHeaders = new HttpHeaders();

    const token: string = this.getAccessToken();

    if (token) {
      headers = new HttpHeaders({
        authorization: this.getAccessToken(),
      });
    }

    return headers;
  }

  public getUser(): Observable<any> {
    return this.http.get(`${environment.apiURL}/user`, { headers: this.getHeaders() });
  }

  public isAuthenticated(): boolean {
    let token: string = this.getAccessTokenFromURL();

    if (token) {
      localStorage.setItem('authentication.token', token);

      if (this.getStateFromURL()) {
        location.href = this.getStateFromURL();
      }
    }

    token = localStorage.getItem('authentication.token');

    return token ? true : false;
  }

  public logout(): void {
    localStorage.removeItem('authentication.token');
    this.redirect();
  }

  public redirect(): void {
    const parameters: string[] = [
      `client_id=${this.googleClientId}`,
      `redirect_uri=${environment.production ? `http://uptime-monitor.openservices.co.za` : `http://localhost:4200`}`,
      `response_type=token`,
      `scope=https://www.googleapis.com/auth/userinfo.profile`,
      `state=${btoa(location.href)}`,
    ];

    location.href = `https://accounts.google.com/o/oauth2/v2/auth?${parameters.join('&')}`;
  }

  protected getAccessTokenFromURL(): string {
    const queryParameters: {} = this.parseHashQueryParameters();

    return queryParameters['access_token'];
  }

  protected parseHashQueryParameters(): any {
    const str: string = location.hash.substring(1);

    const splittedParameters: string[] = str.split('&');

    const queryParameters: {} = {};

    for (const s of splittedParameters) {
      queryParameters[s.split('=')[0]] = s.split('=')[1];
    }

    return queryParameters;
  }


  protected getStateFromURL(): string {
    const queryParameters: {} = this.parseHashQueryParameters();

    let state: string = queryParameters['state'];

    if (!state) {
      return null;
    }

    state = decodeURIComponent(state);

    return atob(state);
  }

}
