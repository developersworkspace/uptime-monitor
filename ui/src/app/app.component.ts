import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebsiteStatistics } from './models/website-statistics';
import { Website } from './models/website';
import { DateHelper } from './helpers/date';
import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // public apiURL = 'http://localhost:3000/api';

  public apiURL = 'http://api.uptime-monitor.openservices.co.za/api';

  public createWebsiteName: string = null;

  public createWebsiteURL: string = null;

  public websiteStatistics: WebsiteStatistics[] = [];

  constructor(
    protected authenticationService: AuthenticationService,
    protected http: HttpClient,
  ) {

    if (!this.authenticationService.isAuthenticated()) {
      this.authenticationService.redirect();
    }

    this.loadWebsite();

    setInterval(() => this.loadWebsite(), 30000);
  }

  public onClickCreateWebsite(): void {
    this.http.post(`${this.apiURL}/website`, {
      name: this.createWebsiteName,
      url: this.createWebsiteURL,
    }, { headers: this.getHeaders() }).subscribe((response: any) => {
      this.createWebsiteName = null;
      this.createWebsiteURL = null;

      this.loadWebsite();
    }, (error: Error) => this.handleError(error));
  }

  public onClickLogout(): void {
    this.authenticationService.logout();
  }

  protected getHeaders(): HttpHeaders {
    const headers: HttpHeaders = new HttpHeaders({
      authorization: this.authenticationService.getAccessToken(),
    });

    return headers;
  }

  protected handleError(error: any): void {
    if (error.status === 401) {
      this.authenticationService.redirect();
    }
  }

  protected loadWebsite(): void {
    this.websiteStatistics = [];
    this.http.get(`${this.apiURL}/website`, { headers: this.getHeaders() })
      .subscribe((websites: any[]) => {
        for (const website of websites) {
          this.loadWebsiteStatistics(website.url);
        }
      }, (error: Error) => this.handleError(error));
  }

  protected loadWebsiteStatistics(url: string): void {
    this.http.get(`${this.apiURL}/website/statistics?url=${url}`, { headers: this.getHeaders() })
      .subscribe((websiteStatistics: any) => {
        this.websiteStatistics.push(new WebsiteStatistics(
          websiteStatistics.availability,
          websiteStatistics.averageResponseTime,
          new Website(
            DateHelper.toDate(websiteStatistics.website.createdTimestamp),
            websiteStatistics.website.id,
            websiteStatistics.website.name,
            websiteStatistics.website.url,
          )));
      }, (error: Error) => this.handleError(error));
  }

}
