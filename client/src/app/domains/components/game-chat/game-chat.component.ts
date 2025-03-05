import { Component, inject, Input, signal, ViewChild, ElementRef } from '@angular/core';
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
  private router = inject(Router);

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  socket: WebSocket | null = null;
  messages = signal<messageModel[]>([]);
  messageInputControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  });

  ngOnInit() {
    if (this.userInfo) {
      this.socket = this.webSocketService.connectWS(this.userInfo.room_id, this.userInfo.user_name);
    }

    if (this.socket) {
      this.socket.onmessage = (event) => {
        console.log("Receiving message", event.data);

        const reqMessage = JSON.parse(event.data);
        if (reqMessage.type === "message") {
          const newMessage: messageModel = {
            "type": reqMessage.type,
            "userName": reqMessage.user_name,
            "messsage": reqMessage.message,
            "owner": false
          };

          this.updateMessages(newMessage);
        }
      };

      this.socket.onclose = () => console.log("Conexión cerrada.");
      this.socket.onerror = (error) => console.error("Error en WebSocket:", error);
    } else {
      this.router.navigate(['']);
    }
  }

  updateMessages(newMessage: messageModel) {
    this.messages.update((messages) => [...messages, newMessage]);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error al hacer scroll:', err);
    }
  }

  sendMessage() {
    if (this.socket && this.messageInputControl.value.trim()) {
      this.socket.send(JSON.stringify({
        type: "message",
        message: this.messageInputControl.value
      }));
      this.messageInputControl.setValue('');
    }
  }

  exit() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.router.navigate(['']);
    }
  }
}
