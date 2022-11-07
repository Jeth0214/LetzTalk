import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  userData: any;

  constructor() { }

  ngOnInit(): void {
    const data = JSON.parse(localStorage.getItem('userData') as string);
    this.userData = data.user;
    console.log(this.userData);
  }

}
