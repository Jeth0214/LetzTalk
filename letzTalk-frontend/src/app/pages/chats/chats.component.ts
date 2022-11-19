import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  userData: any;

  constructor(private webSocketService: WebsocketService) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('userData') as string);
    this.userData = user;
    console.log(this.userData);
    this.webSocketService.openWebSocket()
  }

}
