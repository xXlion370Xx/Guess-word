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

  // BehaviorSubject para el estado de error
  private errorSource = new BehaviorSubject<string | null>(null);
  currentError = this.errorSource.asObservable();

  updateRoomData(roomData: createRoomResponse) {
    this.roomDataSource.next(roomData)
  }

}
