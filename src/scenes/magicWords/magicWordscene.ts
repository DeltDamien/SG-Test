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
        fieldGraph.beginFill(0xffffff, 0.4);
        fieldGraph.drawRect(0, 0, this.app.screen.width, 50);
        fieldGraph.endFill();


        const input = new Input({
            bg: fieldGraph,
            textStyle: {
                fill: 0xffffff,
                fontSize : 12,
                fontWeight: 'bold',
            },
            maxLength : 50,
            align : "center",
            placeholder : "Enter a text",
            secure:false,
            value: '',
            padding: [0, 7, 0, 7],
            cleanOnFocus: true,
        });

        input.x = 200;
        input.y = 400;

        this.addChild(input);
    }

    public override update(deltaTime: number): void {
        console.log("MagicWordscene update", deltaTime);
    }
}