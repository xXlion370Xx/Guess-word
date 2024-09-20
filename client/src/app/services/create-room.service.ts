import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CreateRoomService {
  private http = inject(HttpClient);

  constructor() { }

  createRoom() {
    let url = "";
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      url = "http://localhost:4200/create_room_id";
    }
    return this.http.post(url, {});
  }
}
