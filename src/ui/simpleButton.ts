import * as PIXI from 'pixi.js';
import {Button} from "@pixi/ui";

// Interface pour les options du bouton
export interface ButtonOptions {
    x: number;
    y: number;
    size?: {width: number, height: number};
    text: string;
    textStyle?: PIXI.TextStyle;
    backgroundTexture?: string;
    onPress: () => void;
    onHover?: () => void;
    onOut?: () => void;
}

export class SimpleButton {
    public readonly button: Button = new Button();
    private readonly view : PIXI.Container;
    private buttonBG: PIXI.Sprite | undefined;
    private buttonText: PIXI.Text | undefined;

    constructor(private readonly props: ButtonOptions) {
        this.view = new PIXI.Container();
        this.button.view = this.view;

        this.createBackgroundButton();
        this.createTextButton();

        if (this.buttonBG) {
            this.view.addChild(this.buttonBG);
        }

        if (this.buttonText) {
            this.view.addChild(this.buttonText);
        }

        this.view.x = this.props.x;
        this.view.y = this.props.y;

        this.bindEvents();

        this.button.enabled = true;
    }

    createBackgroundButton() {
        this.buttonBG = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.buttonBG.anchor.set(0.5);
        this.buttonBG.interactive = true;
        this.buttonBG.tint = 0xffffff;
        // use texture if possible
        if (this.props.backgroundTexture) {
            this.buttonBG = PIXI.Sprite.from(this.props.backgroundTexture);
            this.buttonBG.anchor.set(0.5);
        }
        this.buttonBG.width = this.props.size?.width || 250;
        this.buttonBG.height = this.props.size?.height || 100;
    }

    createTextButton() {
        this.buttonText = new PIXI.Text(this.props.text, this.props.textStyle || {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: '#ffffff',
            strokeThickness: 5,
        });
        this.buttonText.anchor.set(0.5);
        this.buttonText.x = 0;
        this.buttonText.y = 0;
    }

    private bindEvents() {
     this.button.onPress.connect(this.props.onPress);
        if (this.props.onHover) {
            this.button.onHover.connect(this.props.onHover);
        }
        if (this.props.onOut) {
            this.button.onOut.connect(this.props.onOut);
        }
    }

    updateButtonBackgroundTintColor(color: number) {
        if (this.buttonBG) {
            this.buttonBG.tint = color;
        }
    }
}