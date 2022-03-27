import { ShaderMaterial, UniformsUtils } from "three";
import { ContrastShader } from "../shaders/ContrastShader";

export default class ContrastMaterial extends ShaderMaterial {
    constructor() {
        super();

        this.defines = {};
        this.uniforms = UniformsUtils.clone(ContrastShader.uniforms);
        this.vertexShader = ContrastShader.vertexShader;
        this.fragmentShader = ContrastShader.fragmentShader;
    }
}