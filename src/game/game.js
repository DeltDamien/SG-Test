import * as PIXI from 'pixi.js';
import { ScenesController } from '../scenes/scenesController';
import { ScenesConstants } from "../scenes/scenesConstants";
import { MainMenu } from "../menu/mainMenu";
export class Game {
    constructor() {
        Object.defineProperty(this, "sceneController", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mainMenu", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "application", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.application = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });
        document.body.appendChild(this.application.view);
        window.addEventListener('resize', () => this.onResize());
        this.sceneController = new ScenesController(this.application);
        this.mainMenu = new MainMenu({ getCurrentFPS: () => { return this.application.ticker.FPS; } }, this.application, this.sceneController);
    }
    async initialize() {
        await this.sceneController.initialize(ScenesConstants.sceneConfigPath);
        this.application.stage.addChild(this.mainMenu);
        console.log(this.application.stage.children);
        this.application.ticker.maxFPS = 60;
        this.application.ticker.add((deltaTime) => this.update(deltaTime));
        this.mainMenu.initializeSwitchScenesButtons();
    }
    onResize() {
        this.application.renderer.resize(window.innerWidth, window.innerHeight);
    }
    update(deltaTime) {
        this.sceneController.update(deltaTime);
        this.mainMenu.update();
    }
}
