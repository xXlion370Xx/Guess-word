import { Component, inject, Input } from '@angular/core';
import { createRoomResponse } from '../../../model/CreateRoomResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-person-list',
  standalone: true,

  imports: [],
  templateUrl: './person-list.component.html',
  styleUrl: './person-list.component.css'
})
export class PersonListComponent {
  @Input({ required: true }) userInfo: createRoomResponse | null = null;

  persons = ["persona 1", "persona 2", "persona 3", "persona 4"]


}
