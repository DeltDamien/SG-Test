import * as PIXI from 'pixi.js';
import {Input} from "@pixi/ui";

export interface InputOptions {
    x: number;
    y: number;
    textStyle?: PIXI.TextStyle;
    maxLength: number;
    align: "left" | "center" | "right" | undefined
    placeholder: string;
    secure: boolean;
    value: string;
    padding: {top: number, bottom: number, left: number, right: number};
    cleanOnFocus: boolean;
    addMask: boolean;
    backgroundColour: number;
    roundedRect: {x: number, y: number, width: number, height: number, radius: number};
    onEnter?: () => void;
    onChange?: () => void;
}

export class SimpleInputText {

    public readonly input: Input;
    private readonly inputBg : PIXI.Graphics;


    constructor(private readonly props: InputOptions) {
        this.inputBg = new PIXI.Graphics();
        this.createBackgroundInput();


        this.input = new Input({
            textStyle: this.props.textStyle,
            maxLength: this.props.maxLength,
            align: this.props.align,
            placeholder: this.props.placeholder,
            secure: this.props.secure,
            value: this.props.value,
            padding: [this.props.padding.top, this.props.padding.bottom, this.props.padding.left, this.props.padding.right],
            cleanOnFocus: this.props.cleanOnFocus,
            bg: this.inputBg,
        });
        this.input.x = this.props.x;
        this.input.y = this.props.y;

        this.bindEvents();
        this.input.interactive = true;
    }

    createBackgroundInput() {
        this.inputBg.beginFill(this.props.backgroundColour);
        this.inputBg.drawRoundedRect(this.props.roundedRect.x, this.props.roundedRect.y, this.props.roundedRect.width, this.props.roundedRect.height, this.props.roundedRect.radius);
        this.inputBg.endFill();
    }

    bindEvents() {
        if (this.props.onEnter) {
           this.input.onEnter.connect(this.props.onEnter);
        }

        if (this.props.onChange) {
            this.input.onChange.connect(this.props.onChange);
        }
    }
}