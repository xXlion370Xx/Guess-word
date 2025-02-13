import { Component, inject, Input, signal } from '@angular/core';
import { UserInfo } from '../../../model/UserInfo';
import { WebsocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-person-list',
  standalone: true,

  imports: [],
  templateUrl: './person-list.component.html',
  styleUrl: './person-list.component.css'
})
export class PersonListComponent {
  private readonly roomInfo = inject(WebsocketService);
  @Input({ required: true }) userInfo: UserInfo | null = null;

  persons = signal<string[]>([]);

  ngOnInit() {
    if (this.userInfo === null) {
      console.log('No user info');
      return;

    }
    this.roomInfo.getRoomInfo(this.userInfo.room_id).subscribe({
      next: (res) => {

        const jsonString = JSON.stringify(res.message);
        const data = JSON.parse(jsonString);

        for (const i of data) {
          this.persons.update((persons) => [...persons, i["user_name"]]);
        }

      },
      error: (err) => {
        console.log(err);
      }
    }
    )
  }
}
