import { Component, inject } from '@angular/core';
import { CreateRoomService } from '../../../services/create-room.service';

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [],
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.css'
})
export class CreateRoomComponent {
  private createRoomService = inject(CreateRoomService)
  roomId = ""
  createRoom() {
    return this.createRoomService.createRoom();
  }

  const roomId = this.createRoom();

  console.log(roomId);

}
