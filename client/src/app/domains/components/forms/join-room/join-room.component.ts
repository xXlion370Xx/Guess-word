import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreDataService } from '../../../../services/store-data.service';
import { WebsocketService } from '../../../../services/websocket.service';
import { JoinUserToRoomService } from '../../../../services/join-user-to-room.service';
import { UserInfo } from '../../../../model/UserInfo';
import DefaultResponse from '../../../../model/DefaultResponse';
// Importa CommonModule

@Component({
  selector: 'app-join-room',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './join-room.component.html',
  styleUrl: './join-room.component.css'
})
export class JoinRoomComponent {
  readonly router = inject(Router);
  readonly storeDataService = inject(StoreDataService);
  readonly websocketService = inject(WebsocketService);
  private readonly joinRoomService = inject(JoinUserToRoomService);
  invalidCodeMessage = false;

  userInfo: UserInfo | null = null;

  nickName = signal(new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)]
  }));

  roomId = signal(new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  }));



  joinRoom(event: Event) {
    event.preventDefault();

    if (this.nickName().invalid || this.roomId().invalid) {
      this.nickName().markAsTouched();
      this.roomId().markAsTouched();
      return;
    }

    this.websocketService.validateWs().subscribe({
      next: (res) => {
        const activeRooms = res.message;

        this.userInfo = {
          status: 200,
          user_name: this.nickName().value,
          owner: false,
          room_id: this.roomId().value
        };

        // Verifica si el código está en active_rooms
        if (activeRooms.includes(this.roomId().value)) {
          // Hacemos peticion al servidor para que una al usuario a la sala
          this.joinRoomService.joinUserToRoom(this.userInfo.user_name, this.userInfo.room_id).subscribe({
            next: (res) => {
              console.log(res);
            },
            error: (err) => {
              console.log("Something went wrong");
              console.log(err);
            }
          });

          this.storeDataService.updateRoomData(this.userInfo);
          this.router.navigate(['game', this.roomId().value]);
        } else {
          this.invalidCodeMessage = true;
        }
      },
      error: (err) => {
        console.log("Something went wrong");
        console.log(err);
      }
    });
  }
}
