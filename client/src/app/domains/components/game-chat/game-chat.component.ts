import { Component, Input, signal } from '@angular/core';
import { messageModel } from '../../../model/messageModel';
import { createRoomResponse } from '../../../model/CreateRoomResponse';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-game-chat',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './game-chat.component.html',
  styleUrl: './game-chat.component.css'
})
export class GameChatComponent {
  @Input({ required: true }) userInfo: createRoomResponse | null = null;
  @Input({ required: true }) webSocket: WebSocket | null = null;
  messages = signal<messageModel[]>([]);

  messageInputControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  })

  sendMessage() {
    if (this.webSocket) {
      this.webSocket?.send(this.messageInputControl.value)
    }

    if (this.webSocket) {
      this.webSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        const newMessage: messageModel = {
          "userName": data.user_name,
          "messsage": data.message
        }

        this.messages.update((messages) => [...messages, newMessage])
      }
    }

  }
}
