import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() user: any;
  profilePic: string = '';
  profilePicFile: any;

  // @ViewChild('filePicker')
  // filePickerRef: ElementRef<HTMLInputElement>; // eslint-disable-next-line no-console

  closeResult = '';
  updateProfileForm!: FormGroup;
  isEditing: boolean = false;

  constructor(
    private offCanvasService: NgbOffcanvas,
    private formBuilder: FormBuilder,
    private userService: UserService
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
      this.profilePic = this.user.user_image;
    } else {
      this.profilePic = '';
    }
    this.updateProfileForm.disable();
    this.isEditing = false;
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
        setTimeout(() => {
          this.resetEditing();
        }, 1000)
      },
    );
  }

  updateProfile() {
    //this.updateProfileForm.patchValue({ 'user_image': this.profilePic });
    console.log(this.updateProfileForm.value)
    const updatedProfileData: FormData = new FormData();
    // @ts-ignore
    updatedProfileData.append('name', this.updateProfileForm.get('name').value);
    // @ts-ignore
    updatedProfileData.append('email', this.updateProfileForm.get('email').value);
    // @ts-ignore
    updatedProfileData.append('password', this.updateProfileForm.get('password').value);
    if (this.profilePicFile) {
      updatedProfileData.append('user_image', this.profilePicFile);
    }
    this.userService.updateUser(this.user.id, updatedProfileData).subscribe(response => {
      console.log(response)
    })
  };

  onEdit() {
    this.updateProfileForm.enable();
    this.isEditing = true;
  }

  onSelectPic(event: Event) {
    // @ts-ignore
    const selectedPic = (event.target as HTMLInputElement).files[0];
    this.profilePicFile = selectedPic;
    //console.log(selectedPic)
    //if (!selectedPic) return;
    if (typeof (FileReader) != undefined) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        // @ts-ignore
        this.profilePic = reader.result.toString();
      };
      reader.readAsDataURL(selectedPic);
    }
  }

}
