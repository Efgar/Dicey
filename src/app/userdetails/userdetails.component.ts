import { Component, OnInit } from '@angular/core';
import { DiceLog } from '../models/DiceLog.class';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.css']
})
export class UserdetailsComponent implements OnInit {

  constructor(private roomService: RoomService) {
  }

  ngOnInit() {
  }

  addItem(diceCombination: Object) {
    const newLog: DiceLog = new DiceLog();
    newLog.characterName = this.roomService.character.name;
    newLog.colorRGB = this.roomService.character.colorRGB;
    newLog.userImageUrl = this.roomService.character.thumbnailUrl;
    newLog.colorRGB = this.roomService.character.colorRGB;
    newLog.dice.push({ type: 'd4', result: 0});
    newLog.modifier = diceCombination['modifier'];
    newLog.rollName = diceCombination['rollName'];
    this.roomService.addDiceThrow(newLog);
  }

}
