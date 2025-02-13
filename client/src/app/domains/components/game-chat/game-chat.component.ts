import { Component, inject, Input, signal } from '@angular/core';
import { messageModel } from '../../../model/messageModel';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { WebsocketService } from '../../../services/websocket.service';
import { Router } from '@angular/router';
import { UserInfo } from '../../../model/UserInfo';

@Component({
  selector: 'app-game-chat',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './game-chat.component.html',
  styleUrl: './game-chat.component.css'
})
export class GameChatComponent {

  @Input({ required: true }) userInfo: UserInfo | null = null;
  private webSocketService = inject(WebsocketService);
  socket: WebSocket | null = null;
  messages = signal<messageModel[]>([]);
  word = '';
  private router = inject(Router);


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
        console.log(event.data);

        const reqMessage = JSON.parse(event.data);
        console.log(reqMessage);
        const newMessage: messageModel = {
          "userName": reqMessage.user_name,
          "messsage": reqMessage.message,
          "owner": false
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
    } else {
      this.router.navigate(['']);
    }
  }

  // Salir de sala
  exit() {
    if (this.socket) {

      this.socket.close()
      this.socket = null
      this.router.navigate(['']);
    }
  }

  sendMessage() {
    if (this.socket) {
      this.socket?.send(this.messageInputControl.value);
    }
  }
}
