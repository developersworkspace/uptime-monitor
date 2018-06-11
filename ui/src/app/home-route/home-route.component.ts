import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import { WebsiteStatistics } from '../models/website-statistics';
import { environment } from '../../environments/environment';
import { Website } from '../models/website';
import { DateHelper } from '../helpers/date';

@Component({
  selector: 'app-home-route',
  templateUrl: './home-route.component.html',
  styleUrls: ['./home-route.component.css']
})
export class HomeRouteComponent extends BaseComponent implements OnInit {

  public websiteStatistics: WebsiteStatistics[] = [];

  constructor(
    authenticationService: AuthenticationService,
    protected http: HttpClient,
  ) {
    super(authenticationService, false);
  }

  public ngOnInit(): void {
    if (this.authenticationService.isAuthenticated()) {
      location.href = 'dashboard';
      return;
    }

    this.loadWebsites();

    setInterval(() => this.loadWebsites(), 30000);
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

  protected loadWebsites(): void {
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
