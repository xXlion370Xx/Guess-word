import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetRoomResponse } from '../model/CreateRoomResponse';
import DefaultResponse from '../model/DefaultResponse';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private http = inject(HttpClient);

  validateWs() {
    const url = `http://localhost:8000/get_active_rooms`;

    return this.http.get<DefaultResponse>(url);
  }

  getWord() {
    const url = "http://localhost:8000/random_word";

    return this.http.get<GetRoomResponse>(url);
  }

  connectWS(roomId: string, nameUser: string) {
    const url = `ws://127.0.0.1:8000/ws/${roomId}/${nameUser}`;

    return new WebSocket(url);
  }

  getRoomInfo(roomId: string) {
    const url = `http://localhost:8000/get_room_info/${roomId}`;

    return this.http.get<DefaultResponse>(url);
  }

}
