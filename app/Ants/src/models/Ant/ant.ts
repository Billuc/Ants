import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { AntComponent } from "../../interfaces/AntComponent";
import { ANT_MODEL_URI, ANT_SCALE, ANT_SPEED, HALF_PI } from "./consts";

export default class Ant implements AntComponent {
    private plane: THREE.Object3D | undefined;

    public axis: THREE.Vector3;

    constructor() {
        this.axis = new THREE.Vector3(1, 0, 0);
    }

    public async init() {
        const loader = new GLTFLoader();

        try {
            const gltf = await loader.loadAsync(ANT_MODEL_URI);
            this.plane = gltf.scene;
            this.plane.scale.set(ANT_SCALE, ANT_SCALE, ANT_SCALE);
            this.plane.rotateX(HALF_PI);
        } catch (err) {
            console.error(err);
        }
    }

    public getComponents(): THREE.Object3D<THREE.Event>[] {
        return this.plane ? [this.plane] : [];
    }

    public getPosition(): THREE.Vector3 {
        return this.plane ? this.plane.position.clone() : new THREE.Vector3();
    }

    public setPosition(x: number, y: number, z: number) {
        if (this.plane) this.plane.position.set(x, y, z);
    }

    public setVectPosition(vect: THREE.Vector3) {
        if (this.plane) this.plane.position.set(vect.x, vect.y, vect.z);
    }

    public setSphericalPosition(r: number, phi: number, theta: number) {
        if (this.plane) this.plane.position.setFromSphericalCoords(r, phi, theta);
    }

    public updatePlane() {
        if (!this.plane) return;
     
        let transformation: THREE.Matrix4 = new THREE.Matrix4().makeRotationAxis(this.axis, ANT_SPEED);
        this.plane.position.applyMatrix4(transformation);
        
        const up = this.getPosition().normalize();
        const forward = new THREE.Vector3().crossVectors(this.axis, up);
        this.plane.up = up;
        this.plane.lookAt(forward.add(this.getPosition()));
    }

    public rotatePlane(angle: number) {
        if (!this.plane) return;

        const rotationAxis = this.getPosition().normalize();
        const transformation: THREE.Matrix4 = new THREE.Matrix4().makeRotationAxis(rotationAxis, angle);
        this.axis.applyMatrix4(transformation);
    }
}