import * as PIXI from 'pixi.js';
import {ScenesConstants} from "./scenesConstants";
import {SceneConfig} from "./scenesController";
import {TextStyle} from "pixi.js";

export class Scene extends PIXI.Container {

    protected gameplayContainer :PIXI.Container;
    protected uiContainer : PIXI.Container;
    protected backgroundContainer : PIXI.Container;

     constructor(private readonly sceneConfig: SceneConfig, private readonly app : PIXI.Application<HTMLCanvasElement>) {
        super();
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.app.stage.addChild(this);

        this.gameplayContainer = new PIXI.Container();

        this.uiContainer = new PIXI.Container();
         this.backgroundContainer = new PIXI.Container();
        this.gameplayContainer.zIndex = ScenesConstants.gameplayContainerZIndex;
        this.uiContainer.zIndex = ScenesConstants.uiContainerZIndex;
        this.backgroundContainer.zIndex = ScenesConstants.backgroundContainerZIndex;
        this.initialize();

         this.renderable = false;
    }

    public initialize(){
        this.initializeBackground(this.sceneConfig.backgroundImageId);
        this.initializeTitle(this.sceneConfig.displayName);
        this.addChild(this.backgroundContainer);
        this.addChild(this.gameplayContainer);
        this.addChild(this.uiContainer);

    }

    protected initializeTitle(title: string) {
        const titleText = new PIXI.Text(title, {
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff'],
            strokeThickness: 5,
            wordWrap: true,
            wordWrapWidth: 440,
        });

        this.uiContainer.addChild(titleText);

        titleText.x = 50;
        titleText.y = 220;

        titleText.position.set(50, 50);
    }

    protected initializeBackground(backgroundImageId: string | undefined) {
        const pathToBackgroundId = ScenesConstants.imagesAssetFolder + (backgroundImageId ?? ScenesConstants.defaultBackgroundImageId);
        const backgroundSprite = PIXI.Sprite.from(pathToBackgroundId);

        const screenAspectRatio = this.getScreenAspectRatio();
        const backgroundAspectRatio = backgroundSprite.width / backgroundSprite.height;

        if (screenAspectRatio > backgroundAspectRatio) {
            this.backgroundContainer.width = this.app.screen.width;
            this.backgroundContainer.height = this.backgroundContainer.width / backgroundAspectRatio;
        } else {
            this.backgroundContainer.height = this.app.screen.height;
            this.backgroundContainer.width = this.backgroundContainer.height * backgroundAspectRatio;
        }

        this.backgroundContainer.x = this.app.screen.width / 2;
        this.backgroundContainer.y = this.app.screen.height / 2;

        backgroundSprite.anchor.set(0.5);
        backgroundSprite.x = 0;
        backgroundSprite.y = 0;

        this.backgroundContainer.addChild(backgroundSprite);
    }

    private getScreenAspectRatio() {
        return this.app.screen.width / this.app.screen.height;
    }




    public start() {
        this.renderable = true;
    }

    public update(_deltaTime: number)
    {
        // Update the scene elements
    }

    public disable(){
        this.renderable = false;
    }
}