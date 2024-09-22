import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-room',
  standalone: true,
  imports: [],
  templateUrl: './game-room.component.html',
  styleUrl: './game-room.component.css'
})
export class GameRoomComponent {
  private route = inject(ActivatedRoute);
  roomid: string | null = "";

  ngOnInit() {
    this.roomid = this.route.snapshot.paramMap.get("room_id")
  }
}
