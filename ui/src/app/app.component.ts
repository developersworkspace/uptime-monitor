import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebsiteStatistics } from './models/website-statistics';
import { Website } from './models/website';
import { DateHelper } from './helpers/date';
import { AuthenticationService } from './authentication.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public createWebsiteName: string = null;

  public createWebsiteURL: string = null;

  public user: any = null;

  public websiteStatistics: WebsiteStatistics[] = [];

  constructor(
    protected authenticationService: AuthenticationService,
    protected http: HttpClient,
  ) {

    if (!this.authenticationService.isAuthenticated()) {
      this.authenticationService.redirect();
    }

    this.loadUser();

    this.loadWebsite();

    setInterval(() => this.loadWebsite(), 30000);
  }

  public onClickCreateWebsite(): void {
    this.http.post(`${environment.apiURL}/website`, {
      name: this.createWebsiteName,
      url: this.createWebsiteURL,
    }, { headers: this.authenticationService.getHeaders() }).subscribe((response: any) => {
      this.createWebsiteName = null;
      this.createWebsiteURL = null;

      this.loadWebsite();
    }, (error: Error) => this.handleError(error));
  }

  public onClickLogout(): void {
    this.authenticationService.logout();
  }

  protected addWebsiteStatistics(websiteStatistics: WebsiteStatistics): void {
    const existingWebsiteStatistics: WebsiteStatistics = this.websiteStatistics
      .find((x: WebsiteStatistics) => x.website.url === websiteStatistics.website.url);

    if (existingWebsiteStatistics) {
      existingWebsiteStatistics.availability = websiteStatistics.availability;
      existingWebsiteStatistics.availabilityBadge = websiteStatistics.availabilityBadge;
      existingWebsiteStatistics.averageResponseTime = websiteStatistics.averageResponseTime;
      existingWebsiteStatistics.averageResponseTimeBadge = websiteStatistics.averageResponseTimeBadge;
      existingWebsiteStatistics.totalDownTimeInMilliseconds = websiteStatistics.totalDownTimeInMilliseconds;
      existingWebsiteStatistics.totalDownTimeInMillisecondsBadge = websiteStatistics.totalDownTimeInMillisecondsBadge;
      existingWebsiteStatistics.website = websiteStatistics.website;
    } else {
      this.websiteStatistics.push(websiteStatistics);
    }
  }

  protected handleError(error: any): void {
    if (error.status === 401) {
      this.authenticationService.redirect();
    }
  }


  protected loadUser(): void {
    this.authenticationService.getUser().subscribe((response: any) => {
      this.user = response;
    }, (error: Error) => this.handleError(error));
  }

  protected loadWebsite(): void {
    this.http.get(`${environment.apiURL}/website`, { headers: this.authenticationService.getHeaders() })
      .subscribe((websites: any[]) => {
        for (const website of websites) {
          this.loadWebsiteStatistics(website.url);
        }
      }, (error: Error) => this.handleError(error));
  }

  protected loadWebsiteStatistics(url: string): void {
    this.http.get(`${environment.apiURL}/website/statistics?url=${url}`, { headers: this.authenticationService.getHeaders() })
      .subscribe((websiteStatistics: any) => {
        this.addWebsiteStatistics(new WebsiteStatistics(
          websiteStatistics.availability,
          websiteStatistics.averageResponseTime,
          websiteStatistics.totalDownTimeInMilliseconds,
          new Website(
            DateHelper.toDate(websiteStatistics.website.createdTimestamp),
            websiteStatistics.website.id,
            websiteStatistics.website.name,
            websiteStatistics.website.url,
          )));
      }, (error: Error) => this.handleError(error));
  }

}
