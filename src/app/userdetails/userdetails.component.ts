import { Component, OnInit } from '@angular/core';
import { DiceLog } from '../models/DiceLog.class';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.css']
})
export class UserdetailsComponent implements OnInit {

  constructor(private roomService: RoomService) { }

  ngOnInit() {
  }

  addItem() {
    const newLog: DiceLog = new DiceLog();
    newLog.characterName = 'Rodrigo Diaz';
    newLog.dice.push({ type: 'd4', result: 0});
    newLog.dice.push({ type: 'd6', result: 0});
    newLog.dice.push({ type: 'd8', result: 0});
    newLog.dice.push({ type: 'd10', result: 0});
    newLog.dice.push({ type: 'd12', result: 0});
    newLog.dice.push({ type: 'd20', result: 0});
    newLog.modifier = 2;
    this.roomService.addDiceThrow(newLog);
  }

}
