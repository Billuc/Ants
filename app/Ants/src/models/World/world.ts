import * as THREE from "three";
import { AntComponent } from "../../interfaces/AntComponent";
import { BLOOM_LAYER, WORLD_LAYER } from "../Renderer/consts";
import { newMapPars, newStandardLight, newStandardLightPars, newStandardMap, oldMapPars, oldStandardLight, oldStandardLightPars, oldStandardMap } from "../Renderer/shaders/dayNightShaderFragments";
import { WORLD_COLOR, WORLD_EMISSIVE_INTENSITY, WORLD_HEIGHT_MAP_URI, WORLD_HEIGHT_SCALE, WORLD_MAP_URI, WORLD_NIGHT_MAP_URI, WORLD_PRECISION, WORLD_SIZE } from "./consts";


export default class AntWorld implements AntComponent {
    private sphereGeometry: THREE.SphereGeometry;
    private material: THREE.Material;
    private sphere: THREE.Mesh;

    constructor() {
        this.sphereGeometry = new THREE.SphereGeometry(WORLD_SIZE, 8 * WORLD_PRECISION, 6 * WORLD_PRECISION);
        this.material = new THREE.MeshLambertMaterial({ color: WORLD_COLOR });
        this.sphere = new THREE.Mesh(this.sphereGeometry, this.material);
    }

    public async init(): Promise<void> {
        const loader = new THREE.TextureLoader();

        try {
            const world_map = await loader.loadAsync(WORLD_MAP_URI);
            const height_map = await loader.loadAsync(WORLD_HEIGHT_MAP_URI);
            const world_night_map = await loader.loadAsync(WORLD_NIGHT_MAP_URI);

            this.material = new THREE.MeshStandardMaterial({
                color: WORLD_COLOR,
                map: world_map,
                displacementMap: height_map,
                displacementScale: WORLD_HEIGHT_SCALE,
                emissive: WORLD_COLOR,
                emissiveIntensity: WORLD_EMISSIVE_INTENSITY
            });
            this.material.onBeforeCompile = shaders => {
                shaders.uniforms["nightMap"] = { value: world_night_map };

                shaders.fragmentShader = shaders.fragmentShader.replace(oldMapPars, newMapPars);
                shaders.fragmentShader = shaders.fragmentShader.replace(oldStandardLightPars, newStandardLightPars);
                shaders.fragmentShader = shaders.fragmentShader.replace(oldStandardMap, newStandardMap);
                shaders.fragmentShader = shaders.fragmentShader.replace(oldStandardLight, newStandardLight);
            }

            this.sphere = new THREE.Mesh(this.sphereGeometry, this.material);
            this.sphere.layers.toggle(WORLD_LAYER);
        } catch (err) {
            console.error(err);
        }
    }

    public getComponents(): THREE.Object3D<THREE.Event>[] {
        return [this.sphere];
    }

    public getPosition() {
        return this.sphere.position;
    }

    public setPosition(x: number, y: number, z: number) {
        this.sphere.position.set(x, y, z);
    }

    public setVectPosition(vect: THREE.Vector3) {
        this.sphere.position.set(vect.x, vect.y, vect.z);
    }
}