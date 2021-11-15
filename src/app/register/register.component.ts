import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../core/services/authentication.service';
import {UserStateService} from "../core/services/user-state.service";
import Swal from "sweetalert2";
import {catchError, map, of, switchMap} from "rxjs";
import {RegisterUserCommand} from "../shared/models/users/requests";
import {PublicUser} from "../shared/models/users/responses";
import {RegisterUser} from "../shared/models/users/register-user";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  userForm!: FormGroup;
  passwordForm!: FormGroup;

  usernameCtrl!: FormControl;
  emailCtrl!: FormControl;
  pwdCtrl!: FormControl;
  confirmPwdCtrl!: FormControl;
  rememberMeCtrl!: FormControl;

  user: RegisterUser = {username: '', email: '', password: '', rememberMe: false};


  constructor(private authService: AuthenticationService, private router: Router, private readonly _userStateService: UserStateService, private fb: FormBuilder) {
  }

  get isFormValid(): boolean {
    return this.userForm.valid;
  }

  ngOnInit(): void {
    this.usernameCtrl = this.fb.control(this.user?.username,
      [Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
    this.emailCtrl = this.fb.control(this.user?.email,
      [Validators.required, Validators.email]);
    this.pwdCtrl = this.fb.control('',
      [Validators.required, Validators.minLength(8)]);
    this.confirmPwdCtrl = this.fb.control('', [Validators.required]);
    this.rememberMeCtrl = this.fb.control(false);
    this.passwordForm = this.fb.group(
      {password: this.pwdCtrl, confirm: this.confirmPwdCtrl},
      {validators: eqCtrlsValidator([this.confirmPwdCtrl, this.pwdCtrl])}
    );
    this.userForm = this.fb.group({
        username: this.usernameCtrl,
        email: this.emailCtrl,
        passwordForm: this.passwordForm,
        rememberMe: this.rememberMeCtrl
      }
    );
  }

  onSubmitUser(): void {
    this.user.email = this.emailCtrl.value;
    this.user.username = this.usernameCtrl.value;
    this.user.password = this.pwdCtrl.value;
    this.user.rememberMe = this.rememberMeCtrl.value;
    this.registerUser();
  }

  registerUser() {
    this.authService.register(this.user).pipe(
      switchMap(res => this.authService.login({
        email: this.user.email,
        rememberMe: this.user.rememberMe,
        password: this.user.password
      })),
      map(res => this._userStateService.updateUser(res)),
      catchError(err => {
        Swal.fire({
          title: 'Erreur',
          icon: 'error',
          text: 'Impossible de créer le compte !'
        });
        return of([]);
      })
    ).subscribe(value => this.router.navigate(['/editor']));
  }

  reset(): void {
    this.userForm.reset({
      username: this.user.username,
      email: this.user.email,
      rememberMe: false
    });
    this.passwordForm.reset({
      password: '',
      confirm: ''
    });

  }
}

function eqCtrlsValidator(ctrls: AbstractControl[]): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    return ctrls.every(subCtrl => subCtrl.value === ctrls[0].value) ? null : {eqValidatorErr: true};
  };
}
