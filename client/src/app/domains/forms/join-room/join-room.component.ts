import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreDataService } from '../../../services/store-data.service';
import { WebsocketService } from '../../../services/websocket.service';
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
  private websocketService = inject(WebsocketService);
  invalidCodeMessage = false;

  userInfo: createRoomResponse | null = null;

  nickName = signal(new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)]
  }));

  code = signal(new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  }));



  joinRoom(event: Event) {
    event.preventDefault();


    if (this.nickName().invalid || this.code().invalid) {
      this.nickName().markAsTouched();
      this.code().markAsTouched();
      return;
    }




    this.websocketService.validateWs().subscribe({
      next: (res) => {

        // Especificamos que es un objeto que tiene un propiedad de tipo string[]
        const activeRooms = (res as { active_rooms: string[] }).active_rooms;

        this.userInfo = {
          status: 200,
          user_name: this.nickName().value,
          owner: false,
          room_id: this.code().value
        };

        // Verifica si el código está en active_rooms
        if (activeRooms.includes(this.code().value)) {
          this.storeDataService.updateRoomData(this.userInfo);
          this.router.navigate(['game', this.code().value]);
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
