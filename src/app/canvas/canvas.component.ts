import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DiceLog } from '../models/DiceLog.class';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  roomId = 'ffoundry';
  characterId = '5ORCP1zE71wDU1JBWgr3';

  ngOnInit() {
    this.roomService.joinRoom(this.roomId, this.characterId);
  }

  constructor(private roomService: RoomService) { }

}
