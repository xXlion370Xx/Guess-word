import { Component } from '@angular/core';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [],
  templateUrl: './person-list.component.html',
  styleUrl: './person-list.component.css'
})
export class PersonListComponent {
  persons = ["persona 1", "persona 2", "persona 3", "persona 4"]
}
