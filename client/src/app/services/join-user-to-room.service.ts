import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserInfo } from '../model/UserInfo';
import DefaultResponse from '../model/DefaultResponse';

@Injectable({
  providedIn: 'root'
})
export class JoinUserToRoomService {
  private http = inject(HttpClient);
  constructor() { }

  joinUserToRoom(nickName: string, room_id: string) {
    const url = "http://localhost:8000/join_room";
    const body: UserInfo = {
      "user_name": nickName,
      "room_id": room_id,
      "owner": false
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.post<DefaultResponse>(url, body, { headers });
  }
}
