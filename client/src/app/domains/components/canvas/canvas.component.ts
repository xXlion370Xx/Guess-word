import { inject, Component, ElementRef, OnInit, ViewChild, PLATFORM_ID, Inject, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { WebsocketService } from '../../../services/websocket.service';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Importa FormsModule
import { UserInfo } from '../../../model/UserInfo';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent implements OnInit {
  @ViewChild('drawingCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input({ required: true }) userInfo: UserInfo | null = null;
  private webSocketService = inject(WebsocketService);

  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;
  strokeColor = '#000000';
  lineWidth = 2;
  word = '';
  socket: WebSocket | null = null;

  ngOnInit() {

    //Traer la palabra aleatoria
    this.webSocketService.getWord().subscribe({
      next: (res) => {
        this.word = res.random_word.toUpperCase();
      },
      error: (err) => {
        console.error("Error obteniendo la palabra", err);
      }
    });

    //Configurar el elemnto Canvas 
    const canvas = this.canvasRef.nativeElement;

    this.ctx = canvas.getContext('2d')!;
    canvas.width = 500;
    canvas.height = 400;

    //Conectar al WebSocket
    if (this.userInfo) {
      this.socket = this.webSocketService.connectWS(this.userInfo.room_id, this.userInfo.user_name);
    }

    if (this.socket) {
      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "drawing") {
          this.drawFromServer(message.user_name, message.data);
        }
      };
    }
  }

  onMouseDown(event: MouseEvent): void {
    this.isDrawing = true;
    this.lastX = event.offsetX;
    this.lastY = event.offsetY;

    if (this.socket) {
      this.socket.send(JSON.stringify({
        type: "drawing",
        drawing_data: {
          startX: this.lastX,
          startY: this.lastY,
          endX: this.lastX,
          endY: this.lastY,
          color: this.strokeColor,
          thickness: this.lineWidth,
          firstPoint: true
        }
      }));
    }

  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDrawing) return;

    const { offsetX, offsetY } = event;
    if (this.userInfo) {
      this.drawLine(this.lastX, this.lastY, offsetX, offsetY, this.strokeColor, this.lineWidth);

    }

    //Enviar al WebSocket
    this.sendDrawing(this.lastX, this.lastY, offsetX, offsetY);

    this.lastX = offsetX;
    this.lastY = offsetY;
  }

  onMouseUp(): void {
    this.isDrawing = false;
  }

  onMouseOut(): void {
    this.isDrawing = false;
  }

  clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
  }

  sendDrawing(startX: number, startY: number, endX: number, endY: number) {
    if (this.socket) {
      this.socket.send(JSON.stringify({
        type: "drawing",
        drawing_data: {
          startX,
          startY,
          endX,
          endY,
          color: this.strokeColor,
          thickness: this.lineWidth,
          firstPoint: false
        }
      }));
    }
  }

  drawLine(startX: number, startY: number, endX: number, endY: number, color: string, thickness: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = thickness;
    this.ctx.lineCap = 'round';
    this.ctx.stroke();


  }

  drawFromServer(user_name: any, drawingData: any) {
    if (!drawingData || !("startX" in drawingData)) {
      console.warn("Datos de dibujo inválidos recibidos", drawingData);
      return;
    }

    const { startX, startY, endX, endY, color, thickness, firstPoint } = drawingData;

    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = thickness;
    this.ctx.lineCap = 'round';
    this.ctx.stroke();

    if (firstPoint) {
      this.ctx.font = "15px Arial";
      this.ctx.fillStyle = "black";
      this.ctx.fillText(user_name, startX + 5, startY - 5);
    }
  }
}
