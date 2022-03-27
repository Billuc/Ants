import { AntComponent } from "src/interfaces/AntComponent";
import * as THREE from "three";
import { Vector3 } from "three";
import { FAR_CLIPPING_PLANE, FIELD_OF_VIEW, NEAR_CLIPPING_PLANE, START_CAMERA_X, START_CAMERA_Y, START_CAMERA_Z } from "./consts";

export default class AntCamera {
    private camera: THREE.PerspectiveCamera;

    constructor(aspectRatio: number) {
        this.camera = new THREE.PerspectiveCamera(
            FIELD_OF_VIEW,
            aspectRatio,
            NEAR_CLIPPING_PLANE, 
            FAR_CLIPPING_PLANE
        );

        this.camera.position.set(START_CAMERA_X, START_CAMERA_Y, START_CAMERA_Z);
    }

    public getCamera(): THREE.Camera {
        return this.camera;
    }

    public setPosition(x: number, y: number, z: number): void {
        this.camera.position.set(x, y, z);
    }

    public setVectPosition(vect: THREE.Vector3) {
        this.camera.position.set(vect.x, vect.y, vect.z);
    }

    public setSphericalPosition(r: number, phi: number, theta: number) {
        this.camera.position.setFromSphericalCoords(r, phi, theta);
    }

    public watchObject(object: THREE.Object3D) {
        this.camera.lookAt(object.position);
        this.camera.up = this.camera.position.clone();
    }

    public watch(object: AntComponent) {
        this.watchObject(object.getComponents()[0]);
    }
}