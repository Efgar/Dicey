import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as CANNON from 'cannon';
import * as THREE from 'three';
import { DiceObject, DiceD4, DiceD6, DiceD8, DiceD10, DiceD12, DiceD20, DiceManager, DiceOptions } from 'threejs-dice';
import { Subject } from 'rxjs/internal/Subject';
import { RoomService } from '../room.service';

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
  private _skyBox: THREE.Mesh;
  private _controls: any;
  private _throwRunning: boolean;

  results: Subject<{ value: number, color: any }[]> = new Subject();


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
    this.addFloorMesh();
    this.addWallMesh1();
    this.addWallMesh2();
    this.addSkyBox();
    this.addFog();

    this.createWorld();
    this.addFloorBody();
    this.addWallBody1();
    this.addWallBody2();


    this.diceContainer.appendChild(this.rendererDOMElement);
    this.animate();

    this.roomService.diceLogOutput.subscribe(diceLogOut => {
      const dice: { dice: DiceObject, value: number }[] = [];
      diceLogOut.forEach(diceOut => {
        diceOut.dice.forEach(result => {
          dice.push({ dice: this.getDie(result.maxValue, diceOut.colorRGB.toString()), value: result.result });
        });
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
    console.log(maxValue);
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
        console.log('!!!!');
        die = new DiceD20(dieOptions);
        break;
      }
    }
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

  set skyBoxVisible(value: boolean) {
    const sceneContainsSkyBox = this._scene.getObjectByName('skyBox');
    if (value) {
      if (!sceneContainsSkyBox) {
        this._scene.add(this._skyBox);
      }
    } else {
      this._scene.remove(this._skyBox);
    }
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
    const VIEW_ANGLE = 45;
    const NEAR = 0.01;
    const FAR = 20000;

    this._camera = new THREE.PerspectiveCamera(VIEW_ANGLE, this.aspect, NEAR, FAR);
    this._scene.add(this._camera);
    this._camera.position.set(0, 30, 30);
  }

  private createRenderer() {
    this._renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer.setSize(this.width, this.height);
    this._renderer.domElement.id = 'renderer';
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  private addControls() {
    this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    //this._controls.enabled = false;
  }

  private addAmbient() {
    const ambient = new THREE.AmbientLight('#ffffff', 0.3);
    this._scene.add(ambient);
  }

  private addDirectionalLight() {
    const directionalLight = new THREE.DirectionalLight('#ffffff', 0.5);
    directionalLight.position.x = -1000;
    directionalLight.position.y = 1000;
    directionalLight.position.z = 1000;
    this._scene.add(directionalLight);
  }

  private addSpotlight() {
    const light = new THREE.SpotLight(0xefdfd5, 1.3);
    light.position.y = 100;
    light.castShadow = true;
    light.shadow.camera.near = 50;
    light.shadow.camera.far = 110;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    this._scene.add(light);
  }

  private addFloorMesh() {
    const floorMaterial = new THREE.MeshPhongMaterial({ color: '#222222', side: THREE.DoubleSide });
    const floorGeometry = new THREE.PlaneGeometry(30, 30, 10, 10);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.receiveShadow = true;
    floor.rotation.x = Math.PI / 2;
    this._scene.add(floor);
  }

  private addWallMesh1() {
    const wallMaterial = new THREE.MeshPhongMaterial({ color: '#222222', side: THREE.DoubleSide });
    const wallGeometry = new THREE.PlaneGeometry(30, 5, 10, 10);
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.receiveShadow = true;
    wall.rotation.y = Math.PI / 2;
    wall.translateZ(15);
    wall.translateY(2.5);
    this._scene.add(wall);
  }

  private addWallMesh2() {
    const wallMaterial = new THREE.MeshPhongMaterial({ color: '#222222', side: THREE.DoubleSide });
    const wallGeometry = new THREE.PlaneGeometry(30, 5, 10, 10);
    const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall2.receiveShadow = true;
    wall2.translateZ(15);
    wall2.translateY(2.5);
    this._scene.add(wall2);
  }

  private addSkyBox() {
    const skyBoxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
    const skyBoxMaterial = new THREE.MeshPhongMaterial({ color: 0x9999ff, side: THREE.BackSide });
    this._skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    this._skyBox.name = 'skyBox';
    this._scene.add(this._skyBox);
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
    console.log(diceValues);
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

      if (allStable) {
        this.results.next(this._dice.map(d => {
          return {
            value: d.getUpsideValue(),
            color: (<any>d).diceColor
          };
        }));
        DiceManager.world.removeEventListener('postStep', check);
        for (let i = 0; i < diceValues.length; i++) {
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
