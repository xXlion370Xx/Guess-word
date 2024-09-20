import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { CreateRoomComponent } from './domains/forms/create-room/create-room.component';
import { JoinRoomComponent } from './domains/forms/join-room/join-room.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CreateRoomComponent, JoinRoomComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = inject(Title)

  ngOnInit() {
    this.title.setTitle("Guess Word")
  }
}
