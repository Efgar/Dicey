import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as CANNON from 'cannon';
import * as THREE from 'three';
import { DiceService } from 'src/app/dice.service';

/*import { OrbitControls } from 'three/examples/js/controls/OrbitControls';*/

@Component({
  selector: 'app-dicetray',
  templateUrl: './dicetray.component.html',
  styleUrls: ['./dicetray.component.css']
})
export class DicetrayComponent implements OnInit, OnDestroy {

  @ViewChild('container') canvasWrapper: ElementRef;

  private _animationHandle: number;

  constructor(private _diceService: DiceService) { }

  ngOnInit() {
    const container = this.canvasWrapper.nativeElement;
    container.appendChild(this._diceService.rendererDOMElement);
    container.appendChild(this._diceService.statsDOMElement);
    this._animationHandle = requestAnimationFrame(() => this.animate());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this._animationHandle);
    this._animationHandle = undefined;
  }

  roll() {
    this._diceService.randomDiceThrow();
  }

  private animate() {
    this._animationHandle = undefined;
    this._diceService.updatePhysics();
    this._diceService.render();
    this._diceService.update();
    this._animationHandle = requestAnimationFrame(() => this.animate());
  }
}
