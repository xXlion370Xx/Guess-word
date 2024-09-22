import { Component, inject, signal } from '@angular/core';
import { CreateRoomService } from '../../../services/create-room.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.css'
})
export class CreateRoomComponent {
  private createRoomService = inject(CreateRoomService);
  private router = inject(Router);
  nickNameControl = signal(new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  }))

  createRoom() {
    this.createRoomService.createRoom(this.nickNameControl().value).subscribe({
      next: (res) => {
        console.log(res.owner);

        this.router.navigate(['game', res.room_id])
      },
      error: (err) => {
        console.log("Something went wrong");
      }
    })
  }
}
