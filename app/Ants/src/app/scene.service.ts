import { Injectable } from '@angular/core';
import Ant from 'src/models/Ant/ant';
import { ANT_RADIUS, ANT_ROTATION_SPEED, ANT_SPEED, HALF_PI } from 'src/models/Ant/consts';
import AntCamera from 'src/models/Camera/camera';
import { CAMERA_PLANE_DISTANCE, CAMERA_RADIUS } from 'src/models/Camera/consts';
import { LIGHT_RADIUS } from 'src/models/Light/consts';
import AntLight from 'src/models/Light/light';
import AntScene from 'src/models/Scene/scene';
import AntWorld from 'src/models/World/world';

import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  world: AntWorld;
  plane: Ant;
  light: AntLight;
  private angle: number = 0;

  constructor() {
    this.world = new AntWorld();
    this.plane = new Ant();
    this.light = new AntLight();
  }

  public async initScene(scene: AntScene, camera: AntCamera): Promise<void> {
    await this.world.init();
    await this.plane.init();

    this.plane.setSphericalPosition(ANT_RADIUS, HALF_PI, 0);
    this.angle = 0;
    this.light.setTarget(this.world);

    scene.addChild(this.world);
    scene.addChild(this.light);
    scene.addChild(this.plane);

    camera.watch(this.world);
  }

  public animate(scene: AntScene, camera: AntCamera): void {
    this.angle += 0.002;

    this.plane.updatePlane();

    const transformation: THREE.Matrix4 = new THREE.Matrix4().makeRotationAxis(this.plane.axis, CAMERA_PLANE_DISTANCE);
    const newCameraPos: THREE.Vector3 = this.plane.getPosition().multiplyScalar(CAMERA_RADIUS / ANT_RADIUS);
    camera.setVectPosition(newCameraPos.applyMatrix4(transformation));
    camera.watch(this.plane);

    this.light.setSphericalPosition(LIGHT_RADIUS, (Math.PI + 0.5 * Math.cos(this.angle / 365)) / 2, - this.angle);
  }

  public rotatePlane(offsetY: number) {
    this.plane.rotatePlane(offsetY * ANT_ROTATION_SPEED);
  }
}
