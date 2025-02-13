import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameChatComponent } from '../../components/game-chat/game-chat.component';
import { PersonListComponent } from '../../components/person-list/person-list.component';
import { WebsocketService } from '../../../services/websocket.service';
import { CreateRoomResponse } from '../../../model/CreateRoomResponse';
import { StoreDataService } from '../../../services/store-data.service';
import { CanvasComponent } from "../../components/canvas/canvas.component";
import { UserInfo } from '../../../model/UserInfo';

@Component({
  selector: 'app-game-room',
  standalone: true,
  imports: [GameChatComponent, PersonListComponent, CanvasComponent],
  templateUrl: './game-room.component.html',
  styleUrl: './game-room.component.css'
})
export class GameRoomComponent {
  readonly storeService = inject(StoreDataService)
  userInfo: UserInfo | null = null;

  ngOnInit() {
    this.storeService.currentRoomData.subscribe((data) => {
      this.userInfo = data;
    })
  }
}
