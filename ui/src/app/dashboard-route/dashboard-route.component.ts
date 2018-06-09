import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { AuthenticationService } from '../authentication.service';
import { HttpClient } from '@angular/common/http';
import { WebsiteStatistics } from '../models/website-statistics';
import { environment } from '../../environments/environment';
import { Website } from '../models/website';
import { DateHelper } from '../helpers/date';

@Component({
  selector: 'app-dashboard-route',
  templateUrl: './dashboard-route.component.html',
  styleUrls: ['./dashboard-route.component.css']
})
export class DashboardRouteComponent extends BaseComponent implements OnInit {

  public createWebsiteName: string = null;

  public createWebsiteURL: string = null;

  public websiteStatistics: WebsiteStatistics[] = [];

  constructor(
    authenticationService: AuthenticationService,
    protected http: HttpClient,
  ) {

    super(authenticationService);

    this.loadWebsite();

    setInterval(() => this.loadWebsite(), 30000);
  }

  public ngOnInit(): void {

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

  public onClickDeleteWebsite(website: Website): void {
    this.http.delete(`${environment.apiURL}/website?url=${website.url}`, { headers: this.authenticationService.getHeaders() })
      .subscribe((response: any) => {
        this.websiteStatistics = [];

        this.loadWebsite();
      });
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
      existingWebsiteStatistics.totalDownTimeInMilliseconds = websiteStatistics.totalDownTimeInMilliseconds;
      existingWebsiteStatistics.totalDownTimeInMillisecondsBadge = websiteStatistics.totalDownTimeInMillisecondsBadge;
      existingWebsiteStatistics.website = websiteStatistics.website;
    } else {
      this.websiteStatistics.push(websiteStatistics);
    }
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
