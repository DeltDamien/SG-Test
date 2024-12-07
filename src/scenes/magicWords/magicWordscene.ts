import * as PIXI from 'pixi.js';
import {Scene} from "../scene";
import {SceneConfig} from "../scenesController";
import {Input} from "@pixi/ui";

export class MagicWordscene extends Scene {

    public constructor(config: SceneConfig, app: PIXI.Application<HTMLCanvasElement>) {
        super(config, app);



        this.initializeInputField();
    }

    initializeInputField() {
        const fieldGraph =  new PIXI.Graphics();
        fieldGraph.beginFill(0x00ffff, 0.4);
        fieldGraph.drawRect(0, 0, 200, 50);
        fieldGraph.endFill();

        const input = new Input({
            bg: fieldGraph,
            textStyle: {
                fill: 0xffffff,
                fontSize : 12,
                fontWeight: 'bold',
            },
            maxLength : 50,
            align : "left",
            placeholder : "Enter S a text",
            secure:false,
            value: '',
            padding: [0, 7, 0, 7],
            cleanOnFocus: true,
        });

        input.x = 200;
        input.y = 400;
        input.width = 200;
        input.height = 50

        this.addChild(input);
    }

    public override update(deltaTime: number): void {
        console.log("MagicWordscene update", deltaTime);
    }
}