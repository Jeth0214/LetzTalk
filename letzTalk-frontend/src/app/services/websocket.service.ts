import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface Message {
  source: string;
  content: string;
}


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  // @ts-ignore
  webSocket: WebSocket;


  constructor() { }

  public openWebSocket() {
    const user = JSON.parse(localStorage.getItem('userData') as string);
    const token = user.token;
    this.webSocket = new WebSocket(`${environment.webSocketUrl}/?token=${token}`);

    this.webSocket.onopen = (event) => {
      console.log('Open: ', event);
    };

    // this.webSocket.onmessage = (event) => {
    //   const chatMessageDto = JSON.parse(event.data);
    //   this.chatMessages.push(chatMessageDto);
    // };

    this.webSocket.onclose = (event) => {
      console.log('Close: ', event);
    };
  }

  // public sendMessage(chatMessageDto: ChatMessageDto) {
  //   this.webSocket.send(JSON.stringify(chatMessageDto));
  // }

  public closeWebSocket() {
    this.webSocket.close();
  }

}
