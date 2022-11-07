import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

interface Alert {
  status: string,
  message: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isRegistered: boolean = false;
  registrationLoginForm!: FormGroup;
  alertData: Alert = {
    status: '',
    message: ''
  };
  showAlert: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.registrationLoginForm = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  registerOrLogin() {
    this.closeAlert();
    this.isRegistered = !this.isRegistered;
    this.registrationLoginForm.reset();
    if (this.isRegistered) {
      this.registrationLoginForm.addControl('name', new FormControl('', Validators.required));
    } else {
      this.registrationLoginForm.removeControl('name');
    }
  }

  onSubmit() {
    let data = this.registrationLoginForm.value;
    if (!this.isRegistered) {
      this.loginService.login(data).subscribe(response => {
        this.registrationLoginForm.reset();
        console.log(response);
        localStorage.setItem('userData', JSON.stringify(response));
        this.router.navigate(['/chats'])
      }, (error) => {
        this.alertData = { ...error.error }
        this.showAlert = true;
      });
    }
    else {
      this.loginService.register(data).subscribe(response => {
        console.log(response);
        this.showAlert = true;
        this.registrationLoginForm.reset();
        this.isRegistered = false;
        this.alertData = { ...response };
        this.registrationLoginForm.removeControl('name');
      }, (error) => {
        console.log(error.error.status)
        const getFormControlError = Object.keys(error.error.message);
        this.alertData.status = error.error.status;
        this.alertData.message = error.error.message[getFormControlError[0]][0];
        this.showAlert = true;
      })
    };

    setTimeout(() => {
      this.closeAlert();
    }, 5000);
  };

  closeAlert() {
    this.showAlert = false;
  }
}
