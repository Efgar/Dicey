import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { DiceLog } from './models/DiceLog.class';
import { Character } from 'src/app/models/Character.class';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  public diceLogOutput: Observable<DiceLog[]>;
  private diceLog: AngularFirestoreCollection<DiceLog>;

  public character: Character = new Character();
  private characterObservable: Observable<Character>;
  private characterInfo: AngularFirestoreDocument<Character>;

  private roomId: String;

  constructor(private db: AngularFirestore) {
  }

  public joinRoom(roomId: String, characterId: String) {
    this.diceLog = this.db.collection<DiceLog>('DiceLog', ref => ref.where('roomId', '==', roomId).orderBy('date'));
    this.diceLogOutput = this.diceLog.valueChanges();

    this.characterInfo = this.db.doc<Character>('Character/' + characterId);
    this.characterObservable = this.characterInfo.valueChanges();
    this.characterObservable.subscribe(response => { if (response) { this.character = response } });
    this.roomId = roomId;

    this.mockServerInfo();
  }

  private mockServerInfo() {
    this.character = new Character();
    this.character.name = 'Edgar';
    this.character.colorRGB = 'black';
    this.character.imageUrl = 'assets/icons/helmet_icon.png';

    let diceObject: any = { rollName: 'Random number', modifiers: [{ name: 'STR', value: 2 }], iconName: 'revolt.png', dice: [{ maxValue: 20, amount: 1 }] };
    this.character.diceCombination.push(diceObject);

    let diceObject2: any = { rollName: 'Initiative', dice: [{ maxValue: 20, amount: 1 }, { maxValue: 12, amount: 1 }] };
    this.character.diceCombination.push(diceObject2);

    let diceObject3: any = { rollName: 'Initiative', dice: [{ maxValue: 6, amount: 6 }] };
    this.character.diceCombination.push(diceObject3);
  }

  public addDiceThrow(diceThrow: DiceLog) {
    let diceTotal = 0;
    diceThrow.dice.forEach(dice => {
      dice.result = Math.floor(Math.random() * dice.maxValue) + 1;
      diceTotal = diceTotal + dice.result;
    });
    if (diceThrow.modifiers) {
      diceThrow.modifiers.forEach(modifier => { diceTotal = diceTotal + modifier.value })
    }
    diceThrow.roomId = this.roomId;
    diceThrow.total = diceTotal;
    diceThrow.date = new Date();
    this.diceLog.add(JSON.parse(JSON.stringify(diceThrow)));
  }

  public diceExpresionToDiceArray(diceExpression: string) {
    console.log(diceExpression);
    let diceArray: any[] = [];
    let modifiersArray: any[] = [];
    diceExpression = diceExpression.replace(/\s/g, '');
    diceExpression.split('+').forEach(part => {
      if (/^\d+d\d+$/.test(part)) {
        const diceSplited = part.split('d');
        diceArray.push({ amount: diceSplited[0], maxValue: diceSplited[1] })
      } else if (/^\d+$/.test(part)) {
        modifiersArray.push({ value: Number(part) });
      }
    });

    let diceCombination: any = {};
    diceCombination.dice = diceArray;
    diceCombination.modifiers = modifiersArray;

    return diceCombination;
  }

  public diceArrayToExpresion(diceCombination) {
    let expression = '';

    if (diceCombination.dice) {
      diceCombination.dice.forEach(dice => {
        if (dice.maxValue) {
          expression += dice.amount + 'd' + dice.maxValue + ' + ';
        }
      });
    }

    if (diceCombination.modifiers) {
      diceCombination.modifiers.forEach(modifier => {
        if (modifier.name) {
          expression += '[' + modifier.name + '] ';
        }
        expression += modifier.value + ' + ';
      })
    }

    if (expression.endsWith(' + ')) {
      expression = expression.substr(0, expression.length - 3);
    }

    return expression;
  }
}
