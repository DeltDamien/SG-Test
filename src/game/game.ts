import * as PIXI from 'pixi.js';
import {ScenesController} from '../scenes/scenesController';
import {ScenesConstants} from "../scenes/scenesConstants";

export class Game {
    private sceneController: ScenesController;
    private application: PIXI.Application<HTMLCanvasElement>;

    constructor() {
        this.application = new PIXI.Application<HTMLCanvasElement>({
            width: window.innerWidth,
            height: window.innerHeight,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: 0x1099bb,
        });

        document.body.appendChild(this.application.view);
        window.addEventListener('resize', () => this.onResize());
        this.sceneController = new ScenesController(this.application);
    }

    public async initialize() {
        await this.sceneController.initialize(ScenesConstants.sceneConfigPath);
        this.application.ticker.add((deltaTime) => this.update(deltaTime));
    }

    private onResize(): void {
        this.application.renderer.resize(window.innerWidth, window.innerHeight);
    }

    public update(deltaTime: number) {
        this.sceneController.update(deltaTime);
    }
}