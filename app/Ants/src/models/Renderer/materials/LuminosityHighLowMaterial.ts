import { ShaderMaterial, UniformsUtils } from "three";
import { LuminosityHighLowPassShader } from "../shaders/LuminosityHighLowPassShader";

export default class LuminosityHighLowMaterial extends ShaderMaterial {
    constructor() {
        super();

        this.defines = {};
        this.uniforms = UniformsUtils.clone(LuminosityHighLowPassShader.uniforms);
        this.vertexShader = LuminosityHighLowPassShader.vertexShader;
        this.fragmentShader = LuminosityHighLowPassShader.fragmentShader;
    }
}