import * as PIXI from "pixi.js";
import {Button, ButtonContainer} from "@pixi/ui"
import {ScenesConstants} from "../scenes/scenesConstants";
import {Graphics} from "pixi.js";

interface MenuProps {
    sceneIds: string[];
    onSwitchToScene: (sceneId: string) => void;
    getCurrentFPS: () => number;
}

const MenuConstants = {
    imagesAssetFolder: "src/assets/images/ui/",
    buttonImage: "button.png",
    buttonWidth: 100,
    buttonHeight: 50,
    buttonSpacing: 10,
    buttonStartX: 10,
    animatedButtonDuration: 100,
}

export class MainMenu extends PIXI.Container {

    private readonly banner: PIXI.Graphics;
    private readonly fpsText: PIXI.Text;

    constructor(private readonly props: MenuProps, private readonly app: PIXI.Application<HTMLCanvasElement>) {
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

    private initializeSwitchScenesButtons() {
        const button = new ButtonContainer(
            new Graphics()
                .fill(0xFFFFFF)
                .roundRect(0, 0, 100, 50, 15)
        );

        button.onPress.connect(() => console.log('onPress'));

        this.addChild(button);
    }

    update() {
        this.fpsText.text = `FPS: ${this.props.getCurrentFPS().toFixed(0)}`;
    }
}