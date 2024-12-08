import * as PIXI from "pixi.js";
import {ButtonContainer} from "@pixi/ui"
import {ScenesConstants} from "../scenes/scenesConstants";
import {Container} from "pixi.js";
import {ScenesController} from "../scenes/scenesController";

interface MenuProps {
    getCurrentFPS: () => number;
}

const MenuConstants = {
    imagesAssetFolder: "src/assets/images/ui/",
    buttonImage: "button.png",
    buttonWidth: 250,
    buttonHeight: 50,
    buttonSpacing: 1,
    buttonStartX: 200,
    animatedButtonDuration: 100,
}

export class MainMenu extends PIXI.Container {

    private readonly banner: PIXI.Graphics;
    private readonly fpsText: PIXI.Text;

    constructor(private readonly props: MenuProps, private readonly app: PIXI.Application<HTMLCanvasElement>, private readonly scenesController: ScenesController) {
        super();

        this.banner = new PIXI.Graphics();
        this.fpsText = new PIXI.Text('');

        this.initializeBanner();
        this.initializeFPS();
        this.initializeSwitchScenesButtons();
    }

    private initializeBanner() {
        this.banner.beginFill(0x000000, 0.4);
        this.banner.drawRect(0, 0, this.app.screen.width, ScenesConstants.headerOffset);
        this.banner.endFill();
        this.addChild(this.banner);
    }

    private initializeFPS() {
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

    public initializeSwitchScenesButtons() {
        const sceneIds = this.scenesController.getSceneIds();
        const isVertical = this.app.screen.width < this.app.screen.height;

        // Determine button layout based on screen orientation
        if (isVertical) {
            this.layoutVerticalButtons(sceneIds);
        } else {
            this.layoutHorizontalButtons(sceneIds);
        }
    }

    private layoutVerticalButtons(sceneIds: string[]) {
        // If the layout is vertical, arrange buttons in a column
        for (let i = 0; i < sceneIds.length; i++) {
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
            button.position.set(MenuConstants.buttonStartX, ScenesConstants.spacing * 0.5 + i * (MenuConstants.buttonHeight + MenuConstants.buttonSpacing));
            this.addChild(button);
        }
    }

    private layoutHorizontalButtons(sceneIds: string[]) {
        // If the layout is horizontal, arrange buttons in a row
        for (let i = 0; i < sceneIds.length; i++) {
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
            button.position.set(MenuConstants.buttonStartX + i * (MenuConstants.buttonWidth + MenuConstants.buttonSpacing), ScenesConstants.spacing * 0.5);
            this.addChild(button);
        }
    }

    update() {
        this.fpsText.text = `FPS: ${this.props.getCurrentFPS().toFixed(0)}`;
    }
}
