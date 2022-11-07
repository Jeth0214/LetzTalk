import { Component, OnInit } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  closeResult = '';

  constructor(
    private offCanvasService: NgbOffcanvas
  ) { }

  ngOnInit(): void {
  }

  showUserProfile(content: any) {
    if (this.offCanvasService.hasOpenOffcanvas()) {
      return;
    }

    this.offCanvasService.open(content, { ariaLabelledBy: 'user-profile', position: 'end', backdrop: false }).result.then(
      (result) => {
        console.log(result)
      },
      (reason) => {
        console.log(reason)
      },
    );
  }
}
