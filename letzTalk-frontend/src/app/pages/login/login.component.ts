import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isRegistered: boolean = false;
  registrationLoginForm!: FormGroup;
  alertData: any = {};
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
    this.isRegistered = !this.isRegistered;
  }

  onSubmit() {
    let data = this.registrationLoginForm.value;
    this.registrationLoginForm.reset();
    // add service logic if backend is ready
    if (!this.isRegistered) {
      this.loginService.login(data).subscribe(response => {
        console.log(response)
      }, error => {
        this.showAlert = true;
        this.alertData = { ...error.error }
      })
    }
    // this.router.navigate(['/chats'])
  };

  closeAlert() {
    this.showAlert = false;
  }
}
