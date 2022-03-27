import { Vector2 } from "three";

import { EffectComposer, Pass } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import AntCamera from "../Camera/camera";
import AntScene from "../Scene/scene";

import { BLOOM_RADIUS, BLOOM_STRENGTH, BLOOM_THRESHOLD, WORLD_BLOOM_HIGH_THRESHOLD, WORLD_BLOOM_LOW_THRESHOLD, WORLD_BLOOM_RADIUS, WORLD_BLOOM_STRENGTH } from "./consts";
import { ContrastBloomPass } from "./passes/ContrastBloomPass";
import FinalPass from "./passes/FinalPass";
import { HighLowBloomPass } from "./passes/HighLowBloomPass";
import AntsPostProcessingHelper from "./postProcessingHelper";
import AntsRenderer from "./renderer";

// https://threejs.org/examples/webgl_postprocessing_unreal_bloom_selective.html
export default class AntsPostProcessingEffects {
    initialiazed: boolean;
    initialiazing: boolean;

    private bloomComposer: EffectComposer | undefined;
    private finalComposer: EffectComposer | undefined;
    private worldComposer: EffectComposer | undefined;

    private renderPass: RenderPass | undefined;
    private bloomPass: UnrealBloomPass | undefined;
    private finalPass: FinalPass | undefined;
    private worldPass: Pass | undefined;

    private helper: AntsPostProcessingHelper;

    constructor() {
        this.initialiazed = false;
        this.initialiazing = false;
        this.helper = new AntsPostProcessingHelper();
    }

    async init(renderer: AntsRenderer, scene: AntScene, camera: AntCamera): Promise<void> {
        if (this.initialiazing || this.initialiazed) return;

        this.initialiazing = true;

        // Render Pass

        this.renderPass = new RenderPass(
            scene.getScene(),
            camera.getCamera()
        );

        // Bloom Composer

        this.bloomPass = new UnrealBloomPass(
            new Vector2(renderer.width, renderer.height),
            BLOOM_STRENGTH,
            BLOOM_RADIUS,
            BLOOM_THRESHOLD
        );

        this.bloomComposer = new EffectComposer(renderer.getRenderer());
        this.bloomComposer.renderToScreen = false;
        this.bloomComposer.addPass(this.renderPass);
        this.bloomComposer.addPass(this.bloomPass);

        // World Composer

        this.worldPass = new ContrastBloomPass(
            new Vector2(renderer.width, renderer.height),
            WORLD_BLOOM_STRENGTH,
            WORLD_BLOOM_RADIUS
        );

        this.worldComposer = new EffectComposer(renderer.getRenderer());
        this.worldComposer.renderToScreen = false;
        this.worldComposer.addPass(this.renderPass);
        this.worldComposer.addPass(this.worldPass);

        // Final Composer

        this.finalPass = new FinalPass(this.bloomComposer, this.worldComposer);

        this.finalComposer = new EffectComposer(renderer.getRenderer());
        this.finalComposer.renderToScreen = true;
        this.finalComposer.addPass(this.renderPass);
        this.finalComposer.addPass(this.finalPass);

        this.initialiazed = true;
        this.initialiazing = false;
    }

    render(scene: AntScene, camera: AntCamera) {
        if (!this.initialiazed) return;

        scene.getScene().traverse((obj) => this.helper.setBloomLayer(obj));
        this.bloomComposer!.render();

        scene.getScene().traverse((obj) => this.helper.setWorldLayer(obj));
        this.worldComposer!.render();

        scene.getScene().traverse((obj) => this.helper.setEntireSceneLayer(obj));
        this.finalComposer!.render();
    }
}
