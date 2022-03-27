import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import FinalMaterial from '../materials/FinalMaterial';

export default class FinalPass extends ShaderPass {
    constructor(bloomComposer: EffectComposer, worldComposer: EffectComposer) {
        super(new FinalMaterial(), 'bloomTexture');
        this.material.uniforms[ 'bloomTexture' ].value = bloomComposer.renderTarget2.texture;
        this.material.uniforms[ 'worldTexture' ].value = worldComposer.renderTarget2.texture;

        this.needsSwap = true;
    }
}