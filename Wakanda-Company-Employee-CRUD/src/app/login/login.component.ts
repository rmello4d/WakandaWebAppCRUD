import { Component } from '@angular/core';
import { AuthenticationService, User } from '../authentication.service'
import {Router} from '@angular/router';

@Component({
    selector: 'login-form',
    providers: [AuthenticationService],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent {
    public user = new User('','');
    public errorMsg = '';

    constructor(private authService: AuthenticationService, private router: Router) {}

    login() {
    	this.authService.login(this.user).then(result => {
    		if(result){
				  this.router.navigate(['home']);
			  }
    	}).catch((errorMessage) =>{
    		this.errorMsg = errorMessage;
    	});
    }
}

