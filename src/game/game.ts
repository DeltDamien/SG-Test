import * as PIXI from 'pixi.js';
import {ScenesController} from '../scenes/scenesController';
import {ScenesConstants} from "../scenes/scenesConstants";
import {MainMenu} from "../menu/mainMenu";

export class Game {
    private sceneController: ScenesController;
    private mainMenu : MainMenu;
    private application: PIXI.Application<HTMLCanvasElement>;

    constructor() {
        this.application = new PIXI.Application<HTMLCanvasElement>({
            width: window.innerWidth,
            height: window.innerHeight,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });

        document.body.appendChild(this.application.view);
        window.addEventListener('resize', () => this.onResize());
        this.sceneController = new ScenesController(this.application);
        this.mainMenu = new MainMenu(
            {sceneIds: this.sceneController.getSceneIds(),
                onSwitchToScene: this.sceneController.switchToSceneId.bind(this.sceneController),
                getCurrentFPS: () => {return this.application.ticker.FPS;}
        },this.application)
    }

    public async initialize() {
        await this.sceneController.initialize(ScenesConstants.sceneConfigPath);
        this.application.stage.addChild(this.mainMenu);
        console.log(this.application.stage.children);
        this.application.ticker.maxFPS = 60;
        this.application.ticker.add((deltaTime) => this.update(deltaTime));
    }

    private onResize(): void {
        this.application.renderer.resize(window.innerWidth, window.innerHeight);
    }

    public update(deltaTime: number) {
        this.sceneController.update(deltaTime);
        this.mainMenu.update();
    }
}