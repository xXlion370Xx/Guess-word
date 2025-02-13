import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserInfo } from '../model/UserInfo';

@Injectable({
  providedIn: 'root'
})
export class StoreDataService {
  readonly roomDataSource = new BehaviorSubject<UserInfo | null>(null);
  currentRoomData = this.roomDataSource.asObservable();
  constructor() { }

  // BehaviorSubject para el estado de error
  readonly errorSource = new BehaviorSubject<string | null>(null);
  currentError = this.errorSource.asObservable();

  updateRoomData(roomData: UserInfo) {
    this.roomDataSource.next(roomData)
  }

}
