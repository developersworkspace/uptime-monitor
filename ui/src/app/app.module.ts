import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DashboardRouteComponent } from './dashboard-route/dashboard-route.component';
import { AppRoutingModule } from './app-routing.module';
import { WebsiteRouteComponent } from './website-route/website-route.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardRouteComponent,
    WebsiteRouteComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
