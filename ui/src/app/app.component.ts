import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebsiteStatistics } from './models/website-statistics';
import { Website } from './models/website';
import { DateHelper } from './helpers/date';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public websiteStatistics: WebsiteStatistics[] = [];

  constructor(protected http: HttpClient) {
    this.loadWebsite();

    setInterval(() => this.loadWebsite(), 30000);
  }

  protected loadWebsite(): void {
    this.websiteStatistics = [];
    this.http.get(`http://api.uptime-monitor.openservices.co.za/api/website`).subscribe((websites: any[]) => {
      for (const website of websites) {
        this.loadWebsiteStatistics(website.url);
      }
    });
  }

  protected loadWebsiteStatistics(url: string): void {
    this.http.get(`http://api.uptime-monitor.openservices.co.za/api/website/statistics?url=${url}`)
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
      });
  }

}
