import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreDataService } from '../../../services/store-data.service';
import { createRoomResponse } from '../../../model/CreateRoomResponse';

@Component({
  selector: 'app-join-room',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './join-room.component.html',
  styleUrl: './join-room.component.css'
})
export class JoinRoomComponent {
  private router = inject(Router);
  private storeDataService = inject(StoreDataService);
  userInfo: createRoomResponse | null = null;
  nickName = signal(new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  }))
  code = signal(new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  }))

  joinRoom(event: Event) {
    this.userInfo = {
      status: 200,
      user_name: this.nickName().value,
      owner: false,
      room_id: this.code().value
    }
    this.storeDataService.updateRoomData(this.userInfo);
    this.router.navigate(['game', this.code().value]);
    event.preventDefault();
  }
}
