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

    this.characterInfo =  this.db.doc<Character>('Character/' + characterId);
    this.characterObservable = this.characterInfo.valueChanges();
    this.characterObservable.subscribe(response => this.character = response);
    this.roomId = roomId;
  }

  public addDiceThrow(diceThrow: DiceLog) {
    let diceTotal = 0;
    diceThrow.dice.forEach(dice => {
      dice.result = this.calculateRoll(dice.type);
      diceTotal = diceTotal + dice.result;
    });
    if (diceThrow.modifier) {
      diceTotal = diceTotal + diceThrow.modifier;
    }
    diceThrow.roomId = this.roomId;
    diceThrow.total = diceTotal;
    diceThrow.date = new Date();
    this.diceLog.add(JSON.parse(JSON.stringify(diceThrow)));
  }

  private calculateRoll(diceType: String) {
    const maxDiceValue: number = parseInt(diceType.replace('d', ''), 10);
    return Math.floor(Math.random() * maxDiceValue) + 1;
  }
}
