import { Routes } from '@angular/router';
import { GameRoomComponent } from './domains/pages/game-room/game-room.component';
import { HomepageComponent } from './domains/pages/homepage/homepage.component';

export const routes: Routes = [
    {
        path: '',
        component: HomepageComponent
    },
    {
        path: 'game/:room_id',
        component: GameRoomComponent
    }
];
