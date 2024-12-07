import * as PIXI from "pixi.js";
import { ButtonContainer } from "@pixi/ui";
import { ScenesConstants } from "../scenes/scenesConstants";
import { Container } from "pixi.js";
const MenuConstants = {
    imagesAssetFolder: "src/assets/images/ui/",
    buttonImage: "button.png",
    buttonWidth: 250,
    buttonHeight: 50,
    buttonSpacing: 10,
    buttonStartX: 200,
    animatedButtonDuration: 100,
};
export class MainMenu extends PIXI.Container {
    constructor(props, app, scenesController) {
        super();
        Object.defineProperty(this, "props", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: props
        });
        Object.defineProperty(this, "app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: app
        });
        Object.defineProperty(this, "scenesController", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: scenesController
        });
        Object.defineProperty(this, "banner", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fpsText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.banner = new PIXI.Graphics();
        this.fpsText = new PIXI.Text('');
        this.initializeBanner();
        this.initializeFPS();
    }
    initializeBanner() {
        this.banner.beginFill(0x000000, 0.4);
        this.banner.drawRect(0, 0, this.app.screen.width, ScenesConstants.headerOffset);
        this.banner.endFill();
        this.addChild(this.banner);
    }
    initializeFPS() {
        const fpsStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
        });
        this.fpsText.style = fpsStyle;
        this.fpsText.x = 10;
        this.fpsText.y = 10;
        this.addChild(this.fpsText);
    }
    initializeSwitchScenesButtons() {
        const sceneIds = this.scenesController.getSceneIds();
        for (let i = 0; i < sceneIds.length; i++) {
            console.log(sceneIds[i]);
            const button = new ButtonContainer();
            button.enabled = true;
            button.onPress.connect(() => {
                this.scenesController.switchToSceneId(sceneIds[i]);
            });
            const buttonView = new Container();
            const text = sceneIds[i];
            buttonView.addChild(new PIXI.Text(text, {
                fontFamily: 'Arial',
                fontSize: 24,
                fill: 0xffffff
            }));
            button.addChild(buttonView);
            button.position.set(MenuConstants.buttonStartX + MenuConstants.buttonWidth * i + ScenesConstants.spacing, ScenesConstants.spacing * 0.5);
            this.addChild(button);
        }
    }
    update() {
        this.fpsText.text = `FPS: ${this.props.getCurrentFPS().toFixed(0)}`;
    }
}
