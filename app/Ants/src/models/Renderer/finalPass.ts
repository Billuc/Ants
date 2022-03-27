import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

import { vertexShader, fragmentShader } from "./shaders/finalShader";

export default class FinalPass extends ShaderPass {
    constructor(composer: EffectComposer) {
        super(new THREE.ShaderMaterial({
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: composer.renderTarget2.texture }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            defines: {}
        }), 'baseTexture');

        this.needsSwap = true;
    }
}