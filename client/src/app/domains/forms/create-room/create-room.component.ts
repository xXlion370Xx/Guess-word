import { Component, inject, signal } from '@angular/core';
import { CreateRoomService } from '../../../services/create-room.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.css'
})
export class CreateRoomComponent {
  private createRoomService = inject(CreateRoomService);
  roomId = signal<any>(null);
  nickNameControl = signal(new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  }))

  createRoom(event: any) {
    this.createRoomService.createRoom(this.nickNameControl().value).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log("Algo salio mal");
        console.log(error);
      }

    })
  }
}
