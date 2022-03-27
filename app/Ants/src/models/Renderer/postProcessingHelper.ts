import * as THREE from 'three';
import { BLOOM_LAYER, ENTIRE_SCENE_LAYER, WORLD_LAYER } from './consts';

export default class AntsPostProcessingHelper {
    private darkMaterial: THREE.Material;

    private materials: { [id: string]: THREE.Material };
    private layers: THREE.Layers;

    constructor() {
        this.materials = {};
        this.darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });

        this.layers = new THREE.Layers();
        this.layers.set(ENTIRE_SCENE_LAYER);
    }

    setWorldLayer(obj: THREE.Object3D<THREE.Event>) {
        this.layers.set(WORLD_LAYER);

        if (obj instanceof THREE.Mesh) {
            if (this.layers.test(obj.layers) === false) {
                this.makeDark(obj);
            }
            else {
                this.restoreMaterial(obj);
            }
        }
    }

    setBloomLayer(obj: THREE.Object3D<THREE.Event>) {
        this.layers.set(BLOOM_LAYER);

        if (obj instanceof THREE.Mesh) {
            if (this.layers.test(obj.layers) === false) {
                this.makeDark(obj);
            }
            else {
                this.restoreMaterial(obj);
            }
        }
    }

    setEntireSceneLayer(obj: THREE.Object3D<THREE.Event>) {
        this.layers.set(ENTIRE_SCENE_LAYER);
        if (obj instanceof THREE.Mesh) { this.restoreMaterial(obj); }
    }


    private makeDark(obj: THREE.Mesh) {
        this.materials[obj.uuid] = this.materials[obj.uuid] ?? obj.material;
        obj.material = this.darkMaterial;
    }

    private restoreMaterial(obj: THREE.Mesh) {
        if (this.materials[obj.uuid]) {
            obj.material = this.materials[obj.uuid];
            delete this.materials[obj.uuid];
        }
    }
}