import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../core/services/authentication.service";
import {UserStateService} from "../core/services/user-state.service";
import {Router} from "@angular/router";
import Swal from 'sweetalert2';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  userLoginForm!: FormGroup;
  emailCtrl!: FormControl;
  userPwdCtrl!: FormControl;
  rememberMeCtrl!: FormControl;

  constructor(private authService: AuthenticationService, private userStateService: UserStateService, private router: Router, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.emailCtrl = this.formBuilder.control('', [Validators.required, Validators.email]);
    this.userPwdCtrl = this.formBuilder.control('', Validators.required);
    this.rememberMeCtrl = this.formBuilder.control(false);
    this.userLoginForm = this.formBuilder.group({
        email: this.emailCtrl,
        password: this.userPwdCtrl,
        rememberMe: this.rememberMeCtrl
      }
    );
  }

  isFormValid(): boolean {
    return this.userLoginForm.valid;
  }

  logUser(): void {
    this.authService.login({
      email: this.emailCtrl.value,
      password: this.userPwdCtrl.value,
      rememberMe: this.rememberMeCtrl.value
    }).subscribe(
      res => {
        this.router.navigate(['/editor']);
        this.userStateService.updateUser(res);
      }, err => Swal.fire({
        title: 'Erreur',
        icon: 'error',
        text: 'Utilisateur inconnu!'
      })
    );

  }
}
