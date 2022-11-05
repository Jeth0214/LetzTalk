import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isRegistered: boolean = false;

  registrationLoginForm!: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router
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
    // add service logic if backend is ready
    this.router.navigate(['/chats'])
  }
}
