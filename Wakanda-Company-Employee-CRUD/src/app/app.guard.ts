import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service'

// prevent non connected users to access the app
@Injectable()
export class AppGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.checkCredentials().then(result => {
      if(result) {
        if(state.url === "/login") {
          this.router.navigate(['/home']);
        } else {
          return true;
        }
      } else {
        this.router.navigate(['/login']);
      }
    }).catch((errorMessage) => {
      if(state.url !== "/login") {
          this.router.navigate(['/login']);
      } else {
        return true;
      }
    });
  }
}
