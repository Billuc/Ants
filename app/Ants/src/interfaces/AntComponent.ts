export interface AntComponent {
    getComponents(): THREE.Object3D[];
    getPosition(): THREE.Vector3;
    setPosition(x: number, y: number, z: number): void;
    setVectPosition(vect: THREE.Vector3): void;
}