import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CreateRoomService {
  private http = inject(HttpClient);
  constructor() { }



  createRoom(nickName: string) {
    const url = "http://localhost:8000/create_room_id";
    const body = {
      "nickname": nickName
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.post(url, body, { headers });
  }
}
