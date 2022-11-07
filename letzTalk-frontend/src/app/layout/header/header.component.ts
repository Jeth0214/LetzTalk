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

  @ViewChild('filePicker')
  filePickerRef!: ElementRef<HTMLInputElement>; // eslint-disable-next-line no-console

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
    let data = this.updateProfileForm.valid;
    console.log(data);
  };

  onEdit() {
    this.updateProfileForm.enable();
    this.isEditing = true;
  }

  updateProfilePic() {

    this.filePickerRef.nativeElement.click();
  }

  selectedPic(e: Event) {
    console.log(e)
  }

}
