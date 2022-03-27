import { AdditiveBlending, ShaderMaterial, UniformsUtils } from "three";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";

export default class CopyMaterial extends ShaderMaterial {
    constructor() {
        super();

        this.uniforms = UniformsUtils.clone(CopyShader.uniforms);
        this.vertexShader = CopyShader.vertexShader,
        this.fragmentShader = CopyShader.fragmentShader,
        this.blending = AdditiveBlending,
        this.depthTest = false,
        this.depthWrite = false,
        this.transparent = true
    }
}