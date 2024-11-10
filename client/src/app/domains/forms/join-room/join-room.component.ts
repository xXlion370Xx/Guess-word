import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreDataService } from '../../../services/store-data.service';
import { createRoomResponse } from '../../../model/CreateRoomResponse';
// Importa CommonModule

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
    validators: [Validators.required, Validators.minLength(3)]
  }));

  code = signal(new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(4)]
  }));


  joinRoom(event: Event) {
    event.preventDefault();


    if (this.nickName().invalid || this.code().invalid) {
      this.nickName().markAsTouched();
      this.code().markAsTouched();
      return;
    }


    this.userInfo = {
      status: 200,
      user_name: this.nickName().value,
      owner: false,
      room_id: this.code().value
    };


    this.storeDataService.updateRoomData(this.userInfo);
    this.router.navigate(['game', this.code().value]);

  }
}
