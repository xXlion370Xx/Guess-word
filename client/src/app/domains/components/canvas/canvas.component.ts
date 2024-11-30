import { inject, Component, ElementRef, OnInit, ViewChild, PLATFORM_ID , Inject} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { WebsocketService } from '../../../services/websocket.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent implements OnInit {
  @ViewChild('drawingCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private webSocketService = inject(WebsocketService);
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;
  word = '';

  ngOnInit() {
    this.webSocketService.getWord().subscribe({
    next: (res) => {
      let response = res.random_word;
      this.word =  response.toUpperCase()
      },
      error: (err) => {
        console.log("Something went wrong");
        console.log(err);
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      // Lógica que solo debe ejecutarse en el cliente
      const canvas = this.canvasRef.nativeElement;
      this.ctx = canvas.getContext('2d')!;
      canvas.width = 800;
      canvas.height = 600;
    }

  }
 

  onMouseDown(event: MouseEvent): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isDrawing = true;
      this.lastX = event.offsetX;
      this.lastY = event.offsetY;
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (isPlatformBrowser(this.platformId) && this.isDrawing) {
      const { offsetX, offsetY } = event;
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(offsetX, offsetY);
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.lastX = offsetX;
      this.lastY = offsetY;
    }
  }

  onMouseUp(): void {
    this.isDrawing = false;
  }

  onMouseOut(): void {
    this.isDrawing = false;
  }

}
