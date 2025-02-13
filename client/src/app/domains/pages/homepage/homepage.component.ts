import { Component, inject } from '@angular/core';
import { CreateRoomComponent } from '../../components/forms/create-room/create-room.component';
import { JoinRoomComponent } from '../../components/forms/join-room/join-room.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CreateRoomComponent, JoinRoomComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  title = inject(Title)

  ngOnInit() {
    this.title.setTitle("Guess Word")
  }
}
