import {Scene} from "../scene";
import {SceneConfig} from "../scenesController";

export class MagicWordscene extends Scene {



    public constructor(config: SceneConfig, app: PIXI.Application<HTMLCanvasElement>) {
        super(config, app);
    }

    public override update(deltaTime: number): void {
        console.log("MagicWordscene update", deltaTime);
    }
}