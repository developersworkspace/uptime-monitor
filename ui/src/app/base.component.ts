import { AuthenticationService } from './authentication.service';

export class BaseComponent {

    public user: any = null;

    constructor(
        protected authenticationService: AuthenticationService,
    ) {
        this.loadUser();
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

}
