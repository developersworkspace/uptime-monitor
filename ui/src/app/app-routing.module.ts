import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { DashboardRouteComponent } from './dashboard-route/dashboard-route.component';
import { WebsiteRouteComponent } from './website-route/website-route.component';

const appRoutes: Routes = [
    {
        canActivate: [
            AuthGuard,
        ],
        component: DashboardRouteComponent,
        path: '',
    },
    {
        canActivate: [
            AuthGuard,
        ],
        component: WebsiteRouteComponent,
        path: 'website',
    },
];

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [
        RouterModule.forRoot(
            appRoutes,
        ),
    ],
    providers: [
        AuthGuard,
    ],
})
export class AppRoutingModule {

}
