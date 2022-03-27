import * as THREE from "three";

import AntCamera from "../Camera/camera";
import AntScene from "../Scene/scene";
import AntsPostProcessingEffects from "./postProcessingEffects";

export default class AntsRenderer {
    width: number;
    height: number;

    private renderer: THREE.WebGLRenderer;
    private postProcessing: AntsPostProcessingEffects;

    constructor(pCanvas: HTMLCanvasElement, pixelRatio: number) {
        this.width = pCanvas.clientWidth;
        this.height = pCanvas.clientHeight;

        this.renderer = new THREE.WebGLRenderer({ canvas: pCanvas });
        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.setSize(this.width, this.height);

        this.postProcessing = new AntsPostProcessingEffects();
    }

    async render(scene: AntScene, camera: AntCamera) {
        await this.postProcessing.init(this, scene, camera);

        // this.renderer.render(scene.getScene(), camera.getCamera());
        this.postProcessing.render(scene, camera);
    }

    getRenderer(): THREE.WebGLRenderer {
        return this.renderer;
    }
}