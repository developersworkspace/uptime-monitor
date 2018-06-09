import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected authenticationService: AuthenticationService,
    ) {

    }

    public canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (!this.authenticationService.isAuthenticated()) {
            this.authenticationService.redirect();

            return false;
        }

        return true;
    }

}
