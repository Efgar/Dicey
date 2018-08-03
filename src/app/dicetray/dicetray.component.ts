import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as CANNON from 'cannon';
import * as THREE from 'three';
import * as DICE from 'threejs-dice';

/*import { OrbitControls } from 'three/examples/js/controls/OrbitControls';*/

@Component({
  selector: 'app-dicetray',
  templateUrl: './dicetray.component.html',
  styleUrls: ['./dicetray.component.css']
})
export class DicetrayComponent implements OnInit {

  @ViewChild('container') elementRef: ElementRef;

  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: any;//OrbitControls;
  private world: CANNON.World;
  private dice: any[];
  private stats: any;
  constructor() {
    console.log(THREE);
  }

  ngOnInit() {
    this.container = this.elementRef.nativeElement;

    console.log(this.container);

    this.init();
  }

  init() {
    console.log('OMG!!!');

    const screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };

    const view = {
      angle: 45,
      aspect: screen.width / screen.height,
      near: 0.1,
      far: 2000
    };

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(view.angle, view.aspect, view.near, view.far);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    this.scene.add(this.camera);

    this.camera.position.set(10, 180, 10);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.renderer.setSize(screen.width, screen.height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // TODO check this
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // TODO stats

    // LIGHTS
    const ambient = new THREE.AmbientLight('#ffffff', 0.3);
    this.scene.add(ambient);

    const directionalLight = new THREE.DirectionalLight('#ffffff', 0.4);
    directionalLight.position.x = -1000;
    directionalLight.position.y = 1000;
    directionalLight.position.z = 1000;
    this.scene.add(directionalLight);

    const light = new THREE.SpotLight(0xefdfd5, 1.3);
    light.position.y = 100;
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.camera.near = 50;
    light.shadow.camera.far = 110;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    this.scene.add(light);


    // FLOOR
    const floorMaterial = new THREE.MeshPhongMaterial({ color: '#00aa00', side: THREE.DoubleSide });
    const floorGeometry = new THREE.PlaneGeometry(30, 30, 10, 10);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.receiveShadow = true;
    floor.rotation.x = Math.PI / 2;
    this.scene.add(floor);

    this.scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);

    this.world = new CANNON.World();

    this.world.gravity.set(0, -9.82 * 20, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.solver.iterations = 16;
    console.log(DICE.DiceManager);
    DICE.DiceManager.setWorld(this.world);
    requestAnimationFrame(this.animate);
  }

  animate() {
    this.updatePhysics();
    this.render();
    this.update();

    requestAnimationFrame(this.animate);

  }

  updatePhysics() {
    this.world.step(1.0 / 60.0);

    for (let i = 0; i < this.dice.length; i++) {
      this.dice[i].updateMeshFromBody();
    }
  }

  update() {

    this.controls.update();
    this.stats.update();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }


  /*
  
    private cube: THREE.Mesh;
  
  
    init() {
  
  
      let geometry = new THREE.BoxGeometry(5, 5, 5),
        material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
  
      this.cube = new THREE.Mesh(geometry, material);
      this.cube.position.set(-50, -50, -50);
  
      this.scene.add(this.cube);
  
      this.render();
    }
  
    render() {
  
      let self: DicetrayComponent = this;
  
      (function render() {
        requestAnimationFrame(render);
        self.renderer.render(self.scene, self.camera);
  
        self.animate();
      }());
  
    }
  
    animate() {
      this.cube.rotateX(0.1);
      this.cube.rotateY(0.1);
      this.cube.position.addScalar(0.2);
  
    }
    */
}
