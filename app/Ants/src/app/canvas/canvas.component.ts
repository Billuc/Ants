import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MouseDragHandler } from 'src/helpers/mousedrag';
import AntCamera from 'src/models/Camera/camera';
import AntsRenderer from 'src/models/Renderer/renderer';
import AntScene from 'src/models/Scene/scene';
import { SceneService } from '../scene.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, AfterViewInit {

  // Properties

  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  // Data

  private scene: AntScene | null = null;
  private camera: AntCamera | null = null;
  private renderer: AntsRenderer | null = null;

  // Lifecycle Methods

  constructor(private sceneService: SceneService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initialize();
  }

  // Computed Properties

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  // Methods

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private render() {
    if (!this.scene || !this.camera || !this.renderer) throw "Uninitialized";

    this.sceneService.animate(this.scene, this.camera);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());
  }

  private async initialize() {
    this.scene = new AntScene();
    this.camera = new AntCamera(this.getAspectRatio());

    await this.sceneService.initScene(this.scene, this.camera);

    this.renderer = new AntsRenderer(this.canvas, this.getAspectRatio());
    new MouseDragHandler().register(this.canvas, (ev) => { this.sceneService.rotatePlane(ev.movementX) });

    this.render();
  }
}
