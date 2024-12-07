import { AceOfShadowsScene } from "./aceOfShadows/aceOfShadowScene";
import { MagicWordscene } from "./magicWords/magicWordscene";
import { PhoenixFlameScene } from "./phoenixFlame/phoenixFlameScene";
export class ScenesController {
    constructor(app) {
        Object.defineProperty(this, "app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: app
        });
        Object.defineProperty(this, "scenes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "sceneIdToScene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map([
                ["aceOfShadows", AceOfShadowsScene],
                ["magicWords", MagicWordscene],
                ["phoenixFlame", PhoenixFlameScene],
            ])
        });
        Object.defineProperty(this, "currentScene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
    }
    async initialize(configUrl) {
        await this.loadScenesFromConfig(configUrl);
        this.switchToSceneIndex(0);
    }
    async loadScenesFromConfig(configUrl) {
        let config;
        try {
            const response = await fetch(configUrl);
            if (!response.ok) {
                throw new Error('Failed to load config');
            }
            config = await response.json();
            this.loadScenes(config.scenes);
        }
        catch (error) {
            console.error(`Error loading scenes config: ${error.message}`);
        }
    }
    loadScenes(sceneConfigs) {
        for (const sceneConfig of sceneConfigs) {
            const sceneClass = this.sceneIdToScene.get(sceneConfig.id);
            if (sceneClass) {
                const scene = new sceneClass(sceneConfig, this.app);
                this.scenes.set(sceneConfig.id, scene);
                this.app.stage.addChild(scene);
            }
            else {
                console.error(`Scene class "${sceneConfig.id}" not found.`);
            }
        }
    }
    switchToSceneId(sceneId) {
        const sceneToSwitch = this.scenes.get(sceneId);
        if (sceneToSwitch) {
            this.currentScene?.disable();
            this.currentScene = sceneToSwitch;
            sceneToSwitch.start();
        }
        else {
            console.error(`Scene with id "${sceneId}" not found.`);
        }
    }
    switchToSceneIndex(sceneIndex) {
        const sceneId = Array.from(this.scenes.keys())[sceneIndex];
        this.switchToSceneId(sceneId);
    }
    update(deltaTime) {
        if (this.currentScene) {
            this.currentScene.update(deltaTime);
        }
    }
    getSceneIds() {
        return Array.from(this.scenes.keys());
    }
}
