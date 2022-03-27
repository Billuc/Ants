import * as THREE from "three";
import { AntComponent } from "../../interfaces/AntComponent";
import { BLOOM_LAYER } from "../Renderer/consts";
import { AMBIENT_LIGHT_INTENSITY, LIGHT_COLOR, LIGHT_INTENSITY, LIGHT_RADIUS, LIGHT_START_PHI, LIGHT_START_THETA, SUN_COLOR, SUN_SIZE } from "./consts";

export default class AntLight implements AntComponent {
    dirLight: THREE.DirectionalLight;
    ambientLight: THREE.AmbientLight;
    
    private sphereGeometry: THREE.SphereGeometry;
    private material: THREE.Material;
    private sun: THREE.Mesh;

    constructor() {
        this.dirLight = new THREE.DirectionalLight(
            LIGHT_COLOR, 
            LIGHT_INTENSITY
        );
        this.ambientLight = new THREE.AmbientLight(
            LIGHT_COLOR, AMBIENT_LIGHT_INTENSITY
        );
        
        this.sphereGeometry = new THREE.SphereGeometry(SUN_SIZE);
        this.material = new THREE.MeshLambertMaterial({ color: SUN_COLOR, emissive: SUN_COLOR, emissiveIntensity: 1 });
        this.sun = new THREE.Mesh(this.sphereGeometry, this.material);
        this.sun.layers.toggle(BLOOM_LAYER);

        this.setSphericalPosition(LIGHT_RADIUS, LIGHT_START_PHI, LIGHT_START_THETA);
    }

    public getComponents(): THREE.Object3D[] {
        return [ this.dirLight, this.ambientLight, this.sun ];
    }

    public getPosition() {
        return this.dirLight.position;
    }

    public setPosition(x: number, y: number, z: number) {
        this.dirLight.position.set(x, y, z);
        this.sun.position.set(x, y, z);
    }

    public setVectPosition(vect: THREE.Vector3) {
        this.dirLight.position.set(vect.x, vect.y, vect.z);
        this.sun.position.set(vect.x, vect.y, vect.z);
    }

    public setSphericalPosition(r: number, phi: number, theta: number) {
        this.dirLight.position.setFromSphericalCoords(r, phi, theta);
        this.sun.position.setFromSphericalCoords(r, phi, theta);
    }

    public setTarget(component: AntComponent) {
        const position = component.getPosition();
        this.dirLight.target.position.set(position.x, position.y, position.z);
    }
}