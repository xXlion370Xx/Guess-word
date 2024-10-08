import { Component, inject, Input, signal } from '@angular/core';
import { messageModel } from '../../../model/messageModel';
import { createRoomResponse } from '../../../model/CreateRoomResponse';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { WebsocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-game-chat',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './game-chat.component.html',
  styleUrl: './game-chat.component.css'
})
export class GameChatComponent {
  @Input({ required: true }) userInfo: createRoomResponse | null = null;
  private webSocketService = inject(WebsocketService);
  socket: WebSocket | null = null;
  messages = signal<messageModel[]>([]);

  messageInputControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  })

  updateMessages(newMessage: messageModel) {
    this.messages.update((messages) => [...messages, newMessage])
  }

  ngOnInit() {
    if (this.userInfo) {
      this.socket = this.webSocketService.connectWS(this.userInfo.room_id, this.userInfo.user_name);
    }

    if (this.socket) {
      // Evento de apertura de conexión
      this.socket.onopen = function (event) {
        console.log("Conectado al servidor WebSocket.");
      };

      // Evento de recepción de mensaje
      this.socket.onmessage = (event) => {
        console.log("Receiving message");

        const data = JSON.parse(event.data);
        const newMessage: messageModel = {
          "userName": data.user_name,
          "messsage": data.message
        }

        this.updateMessages(newMessage);
      };

      // Evento de cierre de conexión
      // Se cierra la conexion pero no se envia ningun dato al backend informando de este cierre
      this.socket.onclose = (event) => {
        console.log("Conexión cerrada.");
      };

      // Evento de error de conexión
      this.socket.onerror = (error) => {
        console.error("Error en la conexión WebSocket:", error);
        alert("Ocurrió un error en la conexión WebSocket. Por favor, verifica la configuración.");
      };
    }
  }

  sendMessage() {
    if (this.socket) {
      this.socket?.send(this.messageInputControl.value)
    }
  }



}
