import * as PIXI from 'pixi.js';
import { Emitter } from '@pixi/particle-emitter';
import { Scene } from '../scene';
import { SceneConfig } from '../scenesController';
import { ScenesConstants } from '../scenesConstants';

// Configuration de l'émetteur de particules
const emitterConfig = {
    lifetime: {
        min: 0,
        max: 5
    },
    frequency: 0.02,
    spawnChance: 1,
    particlesPerWave: 1,
    maxParticles: 10,
    pos: {
        x: 0,
        y: 0
    },
    behaviors: [
        {
            type: 'alpha',
            config: {
                alpha: {
                    list: [
                        {
                            value: 0.8,
                            time: 0
                        },
                        {
                            value: 0.1,
                            time: 1
                        }
                    ]
                }
            }
        },
        {
            type: 'scale',
            config: {
                scale: {
                    list: [
                        {
                            value: 0.5,
                            time: 0
                        },
                        {
                            value: 0.1,
                            time: 1
                        }
                    ]
                }
            }
        },
        {
            type: 'color',
            config: {
                color: {
                    list: [
                        {
                            value: "fb1010",
                            time: 0
                        },
                        {
                            value: "f5b830",
                            time: 1
                        }
                    ]
                }
            }
        },
        {
            type: 'moveSpeed',
            config: {
                speed: {
                    list: [
                        {
                            value: 1,
                            time: 0
                        },
                        {
                            value: 10,
                            time: 1
                        }
                    ],
                    isStepped: false
                }
            }
        },
        {
            type: 'textureSingle',
            config: {
                texture: PIXI.Texture.from(ScenesConstants.imagesAssetFolder + "scenes/phoenixFlame/flame.png")
            }
        }
    ]
};

export class PhoenixFlameScene extends Scene {

    private readonly particleContainer: PIXI.ParticleContainer;
    private readonly particleEmitter: Emitter;

    constructor(sceneConfig: SceneConfig, application: PIXI.Application<HTMLCanvasElement>) {
        super(sceneConfig, application);

        // Conteneur des particules
        this.particleContainer = new PIXI.ParticleContainer(10, { alpha: true, scale: true, rotation: true, tint: true });
        this.gameplayContainer.addChild(this.particleContainer);

        this.particleEmitter = new Emitter(this.particleContainer, emitterConfig);
        this.particleEmitter.spawnPos.x = this.app.screen.width / 2;
        this.particleEmitter.spawnPos.y = this.app.screen.height / 2;
    }

    public override start(): void {
        super.start();
        this.particleEmitter.emit = true;
    }

    public override update(deltaTime: number): void {
        super.update(deltaTime);
        console.log(this.particleEmitter.particleCount);
        this.particleEmitter.update(deltaTime);
    }

    public override disable(): void {
        super.destroy();

        this.particleEmitter.emit = false;
    }
}
