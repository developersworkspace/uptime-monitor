import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebsiteStatistics } from './models/website-statistics';
import { Website } from './models/website';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public websiteStatistics: WebsiteStatistics[] = [];

  constructor(protected http: HttpClient) {
    this.loadWebsite();
  }

  protected loadWebsite(): void {
    this.http.get(`http://api.uptime-monitor.openservices.co.za/api/website`).subscribe((websites: Website[]) => {
      for (const website of websites) {
        this.loadWebsiteStatistics(website.url);
      }
    });
  }

  protected loadWebsiteStatistics(url: string): void {
    this.http.get(`http://api.uptime-monitor.openservices.co.za/api/website/statistics?url=${url}`)
      .subscribe((websiteStatistics: WebsiteStatistics) => {
        this.websiteStatistics.push(websiteStatistics);
      });
  }

}
