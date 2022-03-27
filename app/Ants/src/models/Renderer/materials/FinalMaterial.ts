import { ShaderMaterial, UniformsUtils } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { FinalShader } from "../shaders/FinalShader";

export default class FinalMaterial extends ShaderMaterial {
    constructor() {
        super();

        this.uniforms = UniformsUtils.clone(FinalShader.uniforms);
        this.vertexShader = FinalShader.vertexShader;
        this.fragmentShader = FinalShader.fragmentShader;
        this.defines = {};
    }
}