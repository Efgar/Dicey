import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as CANNON from 'cannon';
import * as THREE from 'three';
import { DiceObject, DiceD4, DiceD6, DiceD8, DiceD10, DiceD12, DiceD20, DiceManager, DiceOptions } from 'threejs-dice';
import { Subject } from 'rxjs/internal/Subject';
import { RoomService } from '../room.service';
import { filter, map, take, takeLast } from 'rxjs/operators';
import { last } from 'rxjs/internal/operators/last';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { distinct } from 'rxjs/internal/operators/distinct';
import { skip } from 'rxjs/internal/operators/skip';
import { first } from 'rxjs/internal/operators/first';

declare const require: (moduleId: string) => any;
const OrbitControls = require('three-orbit-controls')(THREE);

@Component({
  selector: 'app-dicetray',
  templateUrl: './dicetray.component.html',
  styleUrls: ['./dicetray.component.css']
})
export class DicetrayComponent implements OnInit, OnDestroy {

  @ViewChild('container') canvasWrapper: ElementRef;

  private diceContainer: HTMLElement;

  private _animationHandle: number;
  private _world: CANNON.World;
  private _dice: DiceObject[] = [];
  private _scene: THREE.Scene;
  private _renderer: THREE.WebGLRenderer;
  private _camera: THREE.PerspectiveCamera;
  private _controls: any;
  private _throwRunning: boolean;
  test: boolean;


  constructor(private roomService: RoomService) { }

  ngOnDestroy(): void {
    cancelAnimationFrame(this._animationHandle);
    this._animationHandle = undefined;
  }

  ngOnInit() {
    this.diceContainer = this.canvasWrapper.nativeElement;
    window.addEventListener('resize', () => {
      this._camera.aspect = this.aspect;
      this._camera.updateProjectionMatrix();
      this._renderer.setSize(this.width, this.height);
    });

    this._scene = new THREE.Scene();
    this.addCamera();
    this.createRenderer();
    this.addControls();
    this.addAmbient();
    this.addDirectionalLight();
    this.addSpotlight();
    this.addFog();

    this.createWorld();
    this.addFloorBody();
    this.addWallBody1();
    this.addWallBody2();


    this.diceContainer.appendChild(this.rendererDOMElement);
    this.animate();

    this.roomService.latestDiceLogOutput.subscribe(diceLogOut => {
      const dice: { dice: DiceObject, value: number }[] = [];
      diceLogOut.forEach(diceOut => {
        if (!diceOut.rendered) {
          diceOut.dice.forEach(result => {
            dice.push({ dice: this.getDie(result.maxValue, diceOut.colorRGB.toString()), value: result.result });
          });
          diceOut.rendered = true;
        }
      });

      this.prepareValues(dice);
    });
  }

  private getDie(maxValue: number, diceColor: string): DiceObject {
    let die: any;
    const dieOptions: DiceOptions = {
      size: 1.5,
      backColor: diceColor
    };
    switch (maxValue.toString()) {
      case '4': {
        die = new DiceD4(dieOptions);
        break;
      }
      case '6': {
        die = new DiceD6(dieOptions);
        break;
      }
      case '8': {
        die = new DiceD8(dieOptions);
        break;
      }
      case '10': {
        die = new DiceD10(dieOptions);
        break;
      }
      case '12': {
        die = new DiceD12(dieOptions);
        break;
      }
      case '20': {
        die = new DiceD20(dieOptions);
        break;
      }
    }

    const yRand = Math.random() * 20;
    die.getObject().position.x = -15 - (yRand % 3) * 1.5;
    die.getObject().position.y = 2 + Math.floor(yRand / 3) * 1.5;
    die.getObject().position.z = -15 + (yRand % 3) * 1.5;
    die.getObject().quaternion.x = (Math.random() * 90 - 45) * Math.PI / 180;
    die.getObject().quaternion.z = (Math.random() * 90 - 45) * Math.PI / 180;
    die.updateBodyFromMesh();
    const rand = Math.random() * 5;
    die.getObject().body.velocity.set(25 + rand, 40 + yRand, 15 + rand);
    die.getObject().body.angularVelocity.set(20 * Math.random() - 10, 20 * Math.random() - 10, 20 * Math.random() - 10);
    this._scene.add(die.getObject());
    this._dice.push(die);
    setTimeout(() => this._scene.remove(die.getObject()), 3500);
    return die;
  }

  private animate() {
    this._animationHandle = undefined;
    this.updatePhysics();
    this.render();
    this.update();
    this._animationHandle = requestAnimationFrame(() => this.animate());
  }

  private get width() {
    return this.diceContainer.clientWidth;
  }

  private get height() {
    return this.diceContainer.clientHeight;
  }

  private get aspect() {
    return this.width / this.height;
  }

  get rendererDOMElement() {
    return this._renderer.domElement;
  }

  updatePhysics() {
    this._world.step(1.0 / 60.0);
    // tslint:disable-next-line:prefer-const
    for (let i in this._dice) {
      if (this._dice.hasOwnProperty(i)) {
        this._dice[i].updateMeshFromBody();
      }
    }
  }

  update() {
    this._controls.update();
  }

  render() {
    this._renderer.render(this._scene, this._camera);
  }

  private addCamera() {
    const VIEW_ANGLE = 40;
    const NEAR = 1;
    const FAR = this.height / this.aspect / Math.tan(10 * Math.PI / 180);

    this._camera = new THREE.PerspectiveCamera(VIEW_ANGLE, this.aspect, NEAR, FAR);
    this._scene.add(this._camera);
    this._camera.position.set(0, VIEW_ANGLE + 5, 0);
  }

  private createRenderer() {
    this._renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    this._renderer.setSize(this.width, this.height);
    this._renderer.domElement.id = 'renderer';
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  private addControls() {
    this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    this._controls.enabled = false;
  }

  private addAmbient() {
    const ambient = new THREE.AmbientLight('#ffffff', 0.3);
    this._scene.add(ambient);
  }

  private addDirectionalLight() {
    const directionalLight = new THREE.DirectionalLight('#ffffff', 0.2);
    directionalLight.position.x = -1000;
    directionalLight.position.y = 1000;
    directionalLight.position.z = 1000;
    this._scene.add(directionalLight);
  }

  private addSpotlight() {
    const light = new THREE.SpotLight(0xefdfd5, 0.5);
    light.position.y = 100;
    light.castShadow = true;
    light.shadow.camera.near = 50;
    light.shadow.camera.far = 110;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    this._scene.add(light);
  }

  private addFog() {
    this._scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);
  }

  private createWorld() {
    this._world = new CANNON.World();
    this._world.gravity.set(0, -9.82 * 20, 0);
    this._world.broadphase = new CANNON.NaiveBroadphase();
    this._world.solver.iterations = 16;
    DiceManager.setWorld(this._world);
  }

  private addFloorBody() {
    const floorBody = new CANNON.Body({ mass: 0, material: DiceManager.floorBodyMaterial });
    floorBody.addShape(new CANNON.Plane());
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    this._world.addBody(floorBody);
  }

  private addWallBody1() {
    const wallShape = new CANNON.Box(new CANNON.Vec3(2, 5, 30));
    const wallBody = new CANNON.Body({ mass: 0 });
    wallBody.addShape(wallShape);
    wallBody.position.set(17, 0, 0);
    this._world.addBody(wallBody);
  }

  private addWallBody2() {
    const wallShape2 = new CANNON.Box(new CANNON.Vec3(30, 5, 2));
    const wallBody2 = new CANNON.Body({ mass: 0 });
    wallBody2.addShape(wallShape2);
    wallBody2.position.set(0, 0, 17);
    this._world.addBody(wallBody2);
  }

  private getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  /**
   *
   * @param {array} diceValues
   * @param {DiceObject} [diceValues.dice]
   * @param {number} [diceValues.value]
   *
   */
  private prepareValues(diceValues) {
    if (this._throwRunning) {
      throw new Error('Cannot start another throw. Please wait, till the current throw is finished.');
    }
    for (let i = 0; i < diceValues.length; i++) {
      if (diceValues[i].value < 1 || diceValues[i].dice.values < diceValues[i].value) {
        throw new Error('Cannot throw die to value ' +
          diceValues[i].value +
          ', because it has only ' +
          diceValues[i].dice.values +
          ' sides.');
      }
    }
    this._throwRunning = true;
    for (let i = 0; i < diceValues.length; i++) {
      diceValues[i].dice.simulationRunning = true;
      diceValues[i].vectors = diceValues[i].dice.getCurrentVectors();
      diceValues[i].stableCount = 0;
    }

    const check = () => {
      let allStable = true;
      for (let i = 0; i < diceValues.length; i++) {
        if (diceValues[i].dice.isFinished()) {
          diceValues[i].stableCount++;
        } else {
          diceValues[i].stableCount = 0;
        }

        if (diceValues[i].stableCount < 50) {
          allStable = false;
        }
      }
      const results: Subject<{ value: number, color: any }[]> = new Subject();
      if (allStable) {
        results.next(this._dice.map(d => {
          return {
            value: d.getUpsideValue(),
            color: (<any>d).diceColor
          };
        }));
        DiceManager.world.removeEventListener('postStep', check);
        for (let i = 0; i < diceValues.length; i++) {
          diceValues[i].dice.shiftUpperValue(diceValues[i].value);
          diceValues[i].dice.setVectors(diceValues[i].vectors);
          diceValues[i].dice.simulationRunning = false;
        }

        this._throwRunning = false;
      } else {
        DiceManager.world.step(DiceManager.world.dt);
      }
    };

    this._world.addEventListener('postStep', check);
  }
}
