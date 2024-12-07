import {Scene} from "../scene";

export class MagicWordscene extends Scene {
    public override update(deltaTime: number): void {
        console.log("MagicWordscene update", deltaTime);
    }
}