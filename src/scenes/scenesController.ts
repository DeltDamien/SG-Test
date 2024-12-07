import * as PIXI from "pixi.js";
import {Scene} from "./scene";
import {AceOfShadowsScene} from "./aceOfShadows/aceOfShadowScene";
import {MagicWordscene} from "./magicWords/magicWordscene";
import {PhoenixFlameScene} from "./phoenixFlame/phoenixFlameScene";


export interface SceneConfig {
    id: string;
    displayName: string;
    backgroundImageId?: string;
}

export class ScenesController {
    private scenes: Map<string, Scene> = new Map();

    private sceneIdToScene: Map<string, typeof Scene> = new Map([
        ["aceOfShadows", AceOfShadowsScene],
        ["magicWords", MagicWordscene],
        ["phoenixFlame", PhoenixFlameScene],
    ]);


    private currentScene: Scene | null = null;

    public constructor(private readonly app: PIXI.Application<HTMLCanvasElement>) {
    }

    public async initialize(configUrl: string) {
        await this.loadScenesFromConfig(configUrl);
        this.switchToSceneIndex(0);
    }

    public async loadScenesFromConfig(configUrl: string): Promise<void> {
        let config: { scenes: SceneConfig[] };
        try {
            const response = await fetch(configUrl);
            if (!response.ok) {
                throw new Error('Failed to load config');
            }
            config = await response.json();
            this.loadScenes(config.scenes);
        } catch (error : any) {
            console.error(`Error loading scenes config: ${error.message}`);
        }
    }


    private loadScenes(sceneConfigs: SceneConfig[]): void {
        for (const sceneConfig of sceneConfigs) {
            const sceneClass = this.sceneIdToScene.get(sceneConfig.id);
            if (sceneClass) {
                const scene = new sceneClass(sceneConfig, this.app);
                this.scenes.set(sceneConfig.id, scene);
                this.app.stage.addChild(scene);
            } else {
                console.error(`Scene class "${sceneConfig.id}" not found.`);
            }
        }
    }

    public switchToSceneId(sceneId: string): void {
        const sceneToSwitch = this.scenes.get(sceneId);
        if (sceneToSwitch) {
            this.currentScene?.disable();
            this.currentScene = sceneToSwitch;
            sceneToSwitch.start();
        } else {
            console.error(`Scene with id "${sceneId}" not found.`);
        }
    }

    public switchToSceneIndex(sceneIndex: number): void {
        const sceneId = Array.from(this.scenes.keys())[sceneIndex];
        this.switchToSceneId(sceneId);
    }

    public update(deltaTime: number): void {
        if (this.currentScene) {
            this.currentScene.update(deltaTime);
        }
    }

    public getSceneIds(): string[] {
        return Array.from(this.scenes.keys());
    }
}

