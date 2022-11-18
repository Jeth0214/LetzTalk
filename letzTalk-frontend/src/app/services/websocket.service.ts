import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { environment } from 'src/environments/environment';

export interface Message {
  source: string;
  content: string;
}


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  // private subject!: AnonymousSubject<MessageEvent>;
  // public messages: Subject<Message>;

  // @ts-ignore
  webSocket: WebSocket;

  constructor() {
    // this.messages = <Subject<Message>>this.connect(environment.webSocketUrl).pipe(
    //   map(
    //     (response: MessageEvent): Message => {
    //       console.log(response.data);
    //       let data = JSON.parse(response.data)
    //       return data;
    //     }
    //   )
    // );
  }

  public openWebSocket() {
    this.webSocket = new WebSocket(environment.webSocketUrl);

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

  // public connect(url:string): AnonymousSubject<MessageEvent> {
  //   if (!this.subject) {
  //     this.subject = this.create(url);
  //     console.log("Successfully connected: " + url);
  //   }
  //   return this.subject;
  // }

  // private create(url:string): AnonymousSubject<MessageEvent> {
  //   let ws = new WebSocket(url);
  //   let observable = new Observable((obs: Observer<MessageEvent>) => {
  //     ws.onmessage = obs.next.bind(obs);
  //     ws.onerror = obs.error.bind(obs);
  //     ws.onclose = obs.complete.bind(obs);
  //     return ws.close.bind(ws);
  //   });
  //   let observer = {
  //     error: (error: any) => {
  //       console.log('Message sent to websocket: ', error);
  //     },
  //     complete: (error:any) => {
  //       console.log('Message sent to websocket: ', error);
  //     },
  //     next: (data: Object) => {
  //       console.log('Message sent to websocket: ', data);
  //       if (ws.readyState === WebSocket.OPEN) {
  //         ws.send(JSON.stringify(data));
  //       }
  //     }
  //   };
  //   return new AnonymousSubject<MessageEvent>(observer, observable);
  // }
}
