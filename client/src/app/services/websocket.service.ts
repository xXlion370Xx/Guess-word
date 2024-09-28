import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  connectWS(roomId: string, nameUser: string) {
    const url = `ws://127.0.0.1:8000/ws/${roomId}/${nameUser}`;

    return new WebSocket(url);
  }
}