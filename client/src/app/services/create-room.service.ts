import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CreateRoomResponse } from '../model/CreateRoomResponse';
@Injectable({
  providedIn: 'root'
})
export class CreateRoomService {
  private http = inject(HttpClient);
  constructor() { }



  createRoom(nickName: string) {
    const url = "http://localhost:8000/create_room_id";
    const body = {
      "user_name": nickName // -> the nickname of the user that is mandatory for the backend
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.post<CreateRoomResponse>(url, body, { headers });
  }
}
