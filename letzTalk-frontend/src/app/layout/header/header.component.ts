import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() user: any;
  profilePic: string = '';

  // @ViewChild('filePicker')
  // filePickerRef: ElementRef<HTMLInputElement>; // eslint-disable-next-line no-console

  closeResult = '';
  updateProfileForm!: FormGroup;
  isEditing: boolean = false;

  constructor(
    private offCanvasService: NgbOffcanvas,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.resetEditing();
  }

  resetEditing() {
    this.updateProfileForm = this.formBuilder.group({
      'name': [this.user.name, Validators.required],
      'email': [this.user.email, [Validators.required, Validators.email]],
      'password': ['', Validators.minLength(6)]
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
    const updatedProfileData: FormData = new FormData();
    updatedProfileData.append('name', this.updateProfileForm.get('name')?.value);
    updatedProfileData.append('email', this.updateProfileForm.get('email')?.value);
    updatedProfileData.append('password', this.updateProfileForm.get('password')?.value);
    updatedProfileData.append('user_image', this.profilePic);

  };

  onEdit() {
    this.updateProfileForm.enable();
    this.isEditing = true;
  }

  onSelectPic(event: Event) {
    // @ts-ignore
    const selectedPic = (event.target as HTMLInputElement).files[0];
    // console.log(selectedPic)
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
