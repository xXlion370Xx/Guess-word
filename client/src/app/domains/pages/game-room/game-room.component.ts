import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameChatComponent } from '../../components/game-chat/game-chat.component';
import { PersonListComponent } from '../../components/person-list/person-list.component';
import { WebsocketService } from '../../../services/websocket.service';
import { createRoomResponse } from '../../../model/CreateRoomResponse';
import { StoreDataService } from '../../../services/store-data.service';

@Component({
  selector: 'app-game-room',
  standalone: true,
  imports: [GameChatComponent, PersonListComponent],
  templateUrl: './game-room.component.html',
  styleUrl: './game-room.component.css'
})
export class GameRoomComponent {
  private storeService = inject(StoreDataService)
  userInfo: createRoomResponse | null = null;

  ngOnInit() {
    this.storeService.currentRoomData.subscribe((data) => {
      this.userInfo = data;
    })
  }
}
