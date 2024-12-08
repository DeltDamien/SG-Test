import * as PIXI from 'pixi.js';
import { Emitter } from '@pixi/particle-emitter';
import { Scene } from '../scene';
import { SceneConfig } from '../scenesController';
import { ScenesConstants } from '../scenesConstants';

const PhoenixFlameConstants = {
 emitterConfig : {
    "lifetime": {
        "min": 0.1,
        "max": 1.5
    },
    "frequency": 0.2,
    "emitterLifetime": 0,
    "maxParticles": 9,
    "pos": {
        "x": 0,
        "y": 0
    },
    "behaviors": [
        {
            "type": "alpha",
            "config": {
                "alpha": {
                    "list": [
                        {
                            "time": 0,
                            "value": 1
                        },
                        {
                            "time": 1,
                            "value": 0.5
                        }
                    ]
                }
            }
        },
        {
            "type": "moveSpeedStatic",
            "config": {
                "min": 600,
                "max": 1000
            }
        },
        {
            "type": "scale",
            "config": {
                "scale": {
                    "list": [
                        {
                            "time": 0,
                            "value": 1
                        },
                        {
                            "time": 1,
                            "value": 2
                        }
                    ]
                },
                    "minMult": 1
            }
        },
        {
            "type": "color",
            "config": {
                "color": {
                    "list": [
                        {
                            "time": 0,
                            "value": "ffea00"
                        },
                        {
                            "time": 1,
                            "value": "ff4b1f"
                        }
                    ]
                }
            }
        },
        {
            "type": "rotation",
            "config": {
                "accel": 0,
                "minSpeed": 10,
                "maxSpeed": 10,
                "minStart": 20,
                "maxStart": 80
            }
        },
        {
            "type": "textureRandom",
            "config": {
                "textures": [
                    ScenesConstants.imagesAssetFolder + "scenes/phoenixFlame/particle.png",
                    ScenesConstants.imagesAssetFolder + "scenes/phoenixFlame/fire.png",
                    ScenesConstants.imagesAssetFolder + "scenes/phoenixFlame/flame.png"
                ]
            }
        },
        {
            "type": "spawnShape",
            "config": {
                "type": "torus",
                "data": {
                    "x": 0,
                    "y": 0,
                    "radius": 10,
                    "innerRadius": 1,
                    "affectRotation": false
                }
            }
        }
    ]
}};



export class PhoenixFlameScene extends Scene {

    private readonly particleContainer: PIXI.ParticleContainer;
    private readonly particleEmitter: Emitter;

    private readonly dragonImage: PIXI.Sprite = PIXI.Sprite.from(ScenesConstants.imagesAssetFolder + "scenes/phoenixFlame/dragon.jpg");

    constructor(sceneConfig: SceneConfig, application: PIXI.Application<HTMLCanvasElement>) {
        super(sceneConfig, application);

        this.particleContainer = new PIXI.ParticleContainer(10, { alpha: true, scale: true, rotation: true, tint: true });
        this.gameplayContainer.addChild(this.dragonImage);
        this.gameplayContainer.addChild(this.particleContainer);

        this.particleEmitter = new Emitter(this.particleContainer, PhoenixFlameConstants.emitterConfig);
       this.onResize();
    }

    public override start(): void {
        super.start();
        this.particleEmitter.resetPositionTracking();
        this.particleEmitter.emit = true;
    }

    public override update(deltaTime: number): void {
        super.update(deltaTime);
        this.particleEmitter.update(deltaTime);
    }

    public override disable(): void {
        super.disable();

        this.particleEmitter.emit = false;
    }

    public override onResize() {
        super.onResize();
        this.particleEmitter.spawnPos.x = this.app.screen.width / 2;
        this.particleEmitter.spawnPos.y = this.app.screen.height / 2 - 50;
        this.particleEmitter.spawnPos.x = this.app.screen.width / 2 ;
        this.particleEmitter.spawnPos.y = this.app.screen.height / 2 - 50 ;

        const screenAspectRatio = this.app.screen.width / this.app.screen.height;
        const dragonAspectRatio = this.dragonImage.width / this.dragonImage.height;

        if (screenAspectRatio > dragonAspectRatio) {
            this.dragonImage.width = this.app.screen.width / 2;
            this.dragonImage.height = this.app.screen.width / dragonAspectRatio /2;
        } else {
            this.dragonImage.height = this.app.screen.height/ 2;
            this.dragonImage.width = this.app.screen.height * dragonAspectRatio/ 2;
        }

        this.dragonImage.position.x = this.app.screen.width / 2 - this.dragonImage.width / 2;
    }
}
