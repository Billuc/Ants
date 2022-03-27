import * as THREE from "three";
import { AntComponent } from "../../interfaces/AntComponent";
import { SCENE_BACKGROUND_COLOR } from "./consts";

export default class AntScene {
    private scene: THREE.Scene;
    
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(SCENE_BACKGROUND_COLOR);
    }

    public addChild(element: AntComponent): void {
        this.scene.add(...element.getComponents());
    }

    public getScene(): THREE.Scene {
        return this.scene;
    }

    // get meshes(): THREE.Mesh[] {
    //     return this.scene.children.filter(child => child instanceof THREE.Mesh) as THREE.Mesh[];
    // }
    
    // get ambientLights(): THREE.AmbientLight[] {
    //     return this.scene.children.filter(child => child instanceof THREE.AmbientLight) as THREE.AmbientLight[];
    // }
    
    // get directionalLights(): THREE.DirectionalLight[] {
    //     return this.scene.children.filter(child => child instanceof THREE.DirectionalLight) as THREE.DirectionalLight[];
    // }
}