import {Scene} from "../scene";

export class PhoenixFlameScene extends Scene {
    public override update(deltaTime: number): void {
        console.log("PhoenixFlameScene update", deltaTime);
    }
}