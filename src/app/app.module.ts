import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { LoginComponent } from './login/login.component';
import { UserdetailsComponent } from './userdetails/userdetails.component';
import { CanvasComponent } from './canvas/canvas.component';
import { TextpanelComponent } from './textpanel/textpanel.component';

import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RollcreatorComponent } from './rollcreator/rollcreator.component';
import { DicetrayComponent } from './dicetray/dicetray.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserdetailsComponent,
    CanvasComponent,
    TextpanelComponent,
    RollcreatorComponent,
    DicetrayComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    ClarityModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
