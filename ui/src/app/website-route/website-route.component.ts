import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { AuthenticationService } from '../authentication.service';
import { HttpClient } from '@angular/common/http';
import { Website } from '../models/website';
import { environment } from '../../environments/environment';
import { DateHelper } from '../helpers/date';
import { ActivatedRoute, Params } from '@angular/router';
import { Check } from '../models/check';

@Component({
  selector: 'app-website-route',
  templateUrl: './website-route.component.html',
  styleUrls: ['./website-route.component.css']
})
export class WebsiteRouteComponent extends BaseComponent implements OnInit {

  public checks: any[] = [];

  public url: string = null;

  public website: Website = null;

  constructor(
    protected activatedRoute: ActivatedRoute,
    authenticationService: AuthenticationService,
    protected http: HttpClient,
  ) {

    super(authenticationService);
  }

  public ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.url = params['url'];

      this.loadChecks();

      this.loadWebsite();
    });
  }

  protected loadChecks(): void {
    this.http.get(`${environment.apiURL}/check?url=${this.url}`, { headers: this.authenticationService.getHeaders() })
      .subscribe((response: any[]) => {
        this.checks = response.map((x: any) => new Check(x.error, x.id, x.responseTime, DateHelper.toDate(x.timestamp), x.up, x.url));
      }, (error: Error) => this.handleError(error));
  }

  protected loadWebsite(): void {
    this.http.get(`${environment.apiURL}/website?url=${this.url}`, { headers: this.authenticationService.getHeaders() })
      .subscribe((response: any) => {
        this.website = new Website(
          DateHelper.toDate(response.createTimestamp),
          response.id,
          response.name,
          response.url,
        );
      }, (error: Error) => this.handleError(error));
  }

}
