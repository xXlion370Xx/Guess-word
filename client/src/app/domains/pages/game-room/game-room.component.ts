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
  private route = inject(ActivatedRoute);
  private webSocketServices = inject(WebsocketService);
  private storeService = inject(StoreDataService)
  userInfo: createRoomResponse | null = null;
  showChat = false
  socket: WebSocket | null = null;
  mensajeDesdeElPadre = "Hola vengo desde le padre"


  ngOnInit() {
    console.log(this.userInfo);
    this.storeService.currentRoomData.subscribe((data) => {
      this.userInfo = data;
    })
    console.log(this.userInfo);

    if (this.userInfo) {
      this.socket = this.webSocketServices.connectWS(this.userInfo.room_id, this.userInfo.user_name)

      this.socket.onopen = (e) => {
        console.log("Conectado mi rey");
      }

      this.socket.onclose = (e) => {
        console.log("WebSocket cerrado");
      }

      this.socket.onerror = (e) => {
        console.log(`Algo paso {e}`);
      }
    }
  }
}
