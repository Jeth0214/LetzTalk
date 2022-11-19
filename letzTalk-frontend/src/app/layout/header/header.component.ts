import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';

interface Alert {
  status: string,
  message: string
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() user: any;
  profilePic: string = '';
  profilePicFile: any;

  closeResult = '';
  updateProfileForm!: FormGroup;
  isEditing: boolean = false;
  isUpdating: boolean = false;

  alertData: Alert = {
    status: '',
    message: ''
  };
  showAlert: boolean = false;

  constructor(
    private offCanvasService: NgbOffcanvas,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private webSocketService: WebsocketService
  ) { }

  ngOnInit(): void {
    this.resetEditing();
  }

  resetEditing() {
    this.updateProfileForm = this.formBuilder.group({
      'name': [this.user.name, Validators.required],
      'email': [this.user.email, [Validators.required, Validators.email]],
      'password': ['', Validators.minLength(6)],
      'user_image': ['']
    });
    if (this.user.user_image != '') {
      this.profilePic = `http://127.0.0.1:8000/images/${this.user.user_image}`;
    } else {
      this.profilePic = '';
    }
    this.updateProfileForm.disable();
    this.isEditing = false;
    this.isUpdating = false;
  }

  showUserProfile(content: any) {
    if (this.offCanvasService.hasOpenOffcanvas()) {
      return;
    }
    this.offCanvasService.open(content, {
      ariaLabelledBy: 'user-profile',
      position: 'end',
      backdrop: false,
      panelClass: 'bg-light'
    }).result.then(
      (result) => {
        console.log('Off Canvas Result: ', result)
        if (result == 'logout') {
          this.userService.logout().subscribe(response => {
            if (response.status === 'Success') {
              localStorage.removeItem('userData');
              this.webSocketService.closeWebSocket();
              this.router.navigate(['/']);
            }
          });
        }
        setTimeout(() => {
          this.resetEditing();
        }, 1000)
      },
    );
  }

  updateProfile() {
    this.isUpdating = true;
    const updatedProfileData: FormData = new FormData();
    updatedProfileData.append('name', this.updateProfileForm.get('name')?.value);
    updatedProfileData.append('email', this.updateProfileForm.get('email')?.value);
    updatedProfileData.append('password', this.updateProfileForm.get('password')?.value);
    if (this.profilePicFile) {
      updatedProfileData.append('user_image', this.profilePicFile);
    }
    this.userService.updateUser(this.user.id, updatedProfileData).subscribe(response => {
      this.showAlert = true;
      if (response.status === 'success') {
        console.log('API Response', response);
        this.user = response.user;
        let userDataFromStorage = JSON.parse(localStorage.getItem('userData') as string);
        userDataFromStorage.user = { ...response.user };
        console.log('Local Storage Data', userDataFromStorage);
        localStorage.removeItem('userData');
        localStorage.setItem('userData', JSON.stringify(userDataFromStorage));
        if (response.user.user_image) {
          this.profilePic = `http://127.0.0.1:8000/images/${response.user.user_image}`;
        };
        this.alertData = { ...response };
        this.resetEditing();
      }
    }, (error) => {
      console.log(error.error.status)
      const getFormControlError = Object.keys(error.error.message);
      this.alertData.status = error.error.status;
      this.alertData.message = error.error.message[getFormControlError[0]][0];
      this.showAlert = true;
    });
    setTimeout(() => {
      this.closeAlert();
    }, 5000);
  };

  onEdit() {
    this.updateProfileForm.enable();
    this.isEditing = true;
  }

  onSelectPic(event: Event) {
    // @ts-ignore
    const selectedPic = (event.target as HTMLInputElement).files[0];
    this.profilePicFile = selectedPic;
    if (typeof (FileReader) != undefined) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        // @ts-ignore
        this.profilePic = reader.result.toString();
      };
      reader.readAsDataURL(selectedPic);
    }
  };

  closeAlert() {
    this.showAlert = false;
  }

}
