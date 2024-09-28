import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { createRoomResponse } from '../model/CreateRoomResponse';

@Injectable({
  providedIn: 'root'
})
export class StoreDataService {
  private roomDataSource = new BehaviorSubject<createRoomResponse | null>(null);
  currentRoomData = this.roomDataSource.asObservable();
  constructor() { }

  updateRoomData(roomData: createRoomResponse) {
    this.roomDataSource.next(roomData)
  }
}
