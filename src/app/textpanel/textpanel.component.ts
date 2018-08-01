import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { DiceLog } from '../models/DiceLog.class';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-textpanel',
  templateUrl: './textpanel.component.html',
  styleUrls: ['./textpanel.component.css']
})
export class TextpanelComponent implements OnInit {

  constructor(private roomService: RoomService) { }

  ngOnInit() {
  }

  public getAvatarImage(imageUrl: string): String{
    return imageUrl ? imageUrl: 'assets/icons/dice-twenty-faces.png';
  }
}
