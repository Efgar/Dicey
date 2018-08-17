import { Component, OnInit } from '@angular/core';
import { DiceLog } from '../models/DiceLog.class';
import { RoomService } from '../room.service';
import { Character } from 'src/app/models/Character.class';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.css']
})
export class UserdetailsComponent implements OnInit {
  customExpression: string = '';

  constructor(private roomService: RoomService) {
  }

  ngOnInit() {
  }

  doExpressionRoll() {
    const diceCombination: any = this.roomService.diceExpresionToDiceArray(this.customExpression);
    this.doDiceRoll(diceCombination);
  }

  clearExpression() {
    this.customExpression = null;
  }

  doDiceRoll(diceCombination: Object) {
    const newLog: DiceLog = new DiceLog();
    newLog.characterName = this.roomService.character.name;
    newLog.colorRGB = this.roomService.character.colorRGB;
    newLog.userImageUrl = this.roomService.character.thumbnailUrl;
    newLog.colorRGB = this.roomService.character.colorRGB;

    if (diceCombination['dice']) {
      diceCombination['dice'].forEach(dice => {
        for (let i = 0; i < dice.amount; i++) {
          newLog.dice.push({ maxValue: dice.maxValue, result: 0 });
        }
      });
    }

    if (diceCombination['modifiers']) {
      const aux: any[] = diceCombination['modifiers'];
      aux.forEach(mod => {
        newLog.modifiers.push(Character.getAttributeModifier(this.roomService.character, mod));
      });
    }

    newLog.rollName = diceCombination['rollName'];
    this.roomService.addDiceThrow(newLog);
  }

}
