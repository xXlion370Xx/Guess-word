import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { createRoomResponse, getRoomResponse } from '../model/CreateRoomResponse';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private http = inject(HttpClient);

  validateWs() {
    const url = "http://localhost:8000/active_rooms";

    return this.http.get(url);
  }

  getWord() {
    const url = "http://localhost:8000/random_word";

    return this.http.get<getRoomResponse>(url);
  }

  connectWS(roomId: string, nameUser: string) {
    const url = `ws://127.0.0.1:8000/ws/${roomId}/${nameUser}`;

    return new WebSocket(url);
  }



}
