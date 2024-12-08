import * as PIXI from 'pixi.js';
import { Scene } from "../scene";
import { SceneConfig } from "../scenesController";
import { ScenesConstants } from "../scenesConstants";
import {SimpleButton} from "../../ui/simpleButton";
import {SimpleInputText} from "../../ui/SimpleInputText";
import {Ticker} from "pixi.js";

// this could and should be moved to a json to be let designer change it easily
const MagicWordsConstants = {
    initialRandomTexts: [
        "Twix", "Dodue", "Neko", "Tango", "Salto", "Willow", "Kinder", "Chips",
        "Mousse", "Coquelicot", "Fluffy", "Hades"
    ],
    magicWordsImagePath: `${ScenesConstants.imagesAssetFolder}scenes/magicWords/images/`,
    fontSize: {min: 48, max: 84},
    fontFamilies: ['Arial', 'Verdana', 'Courier New', 'Georgia', 'Comic Sans MS'],
    fontWeights: ['normal', 'bold', 'bolder', 'lighter'] as PIXI.TextStyleFontWeight[],
    fontStyles: ['normal', 'italic', 'oblique'] as PIXI.TextStyleFontStyle[],
    strokeThickness: {min: 2, max: 10},
    imageSize: {min: 300, max: 500},
    colors: ['#FF5733', '#33FF57', '#3357FF', '#F39C12', '#8E44AD', '#1ABC9C', '#E74C3C', '#3498DB'],
    timeToDisplay: 2,
    filterRanges: {
        alpha: {min: 0.1, max: 1},
        noise: {min: 0.1, max: 1},
        displacementScale: {min: 20, max: 100},
        brightness: {min: 0.5, max: 1},
        greyscale: {min: 0, max: 1}
    }
}

export class MagicWordsScene extends Scene {
    private images: PIXI.Texture[] = [];
    private randomText: string[] = [];
    private timer: number = 200;
    private imageCount: number = 10;

    private addImageButton: SimpleButton | null = null;
    private imageInput: HTMLInputElement | null = null;
    private addTextButton: SimpleButton | null = null;
    private addTextInput: SimpleInputText | null = null;

    public constructor(config: SceneConfig, app: PIXI.Application<HTMLCanvasElement>) {
        super(config, app);
        this.loadImages();
        this.randomText = MagicWordsConstants.initialRandomTexts;
        this.createFileInput();
        this.createAddImageButton();
        this.createTextInput();
        this.createAddTextButton();
    }

    private createFileInput() {
        this.imageInput = document.createElement('input');
        if (!this.imageInput) {
            console.error("Failed to create input element.");
            return;
        }
        this.imageInput.type = 'file';
        this.imageInput.accept = 'image/*';
        this.imageInput.style.display = 'none';

        document.body.appendChild(this.imageInput);

        this.imageInput.addEventListener("change", (_event) => {
            if (this.imageInput?.files && this.imageInput.files[0]) {
                const file = this.imageInput.files[0];
                const reader = new FileReader();

                reader.onload = (e) => {
                    if (e.target && e.target.result) {
                        const texture = PIXI.Texture.from(e.target.result as string);
                        this.images.push(texture);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    private createAddImageButton() {
        this.addImageButton = new SimpleButton({

            x: 200,
            y: 225,
            text: "Add your Image",
            size: {width: 250, height: 150},
            backgroundTexture: `${ScenesConstants.imagesAssetFolder}ui/button.png`,
            textStyle: new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: 24,
                fill: '#ffffff',
                strokeThickness: 5,
            }),
            onPress: () => {
                this.imageInput?.click();
            },
            onHover: () => {
                this.addImageButton?.updateButtonBackgroundTintColor(0x00ff00);
            },
            onOut: () => {
                this.addImageButton?.updateButtonBackgroundTintColor(0xffffff);
            }
        });

        this.uiContainer.addChild(this.addImageButton.button.view);
    }

    public createAddTextButton() {
        this.addTextButton = new SimpleButton({

            x: 200,
            y: 500,
            text: "Add your Text",
            size: {width: 250, height: 100},
            backgroundTexture: `${ScenesConstants.imagesAssetFolder}ui/button.png`,
            textStyle: new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: 24,
                fill: '#ffffff',
                strokeThickness: 5,
            }),
            onPress: () => {
                if (this.addTextInput?.input.value) {
                    this.randomText.push(this.addTextInput.input.value);
                    this.addTextInput.input.value = "";
                }
            },
            onHover: () => {
                this.addImageButton?.updateButtonBackgroundTintColor(0x00ff00);
            },
            onOut: () => {
                this.addImageButton?.updateButtonBackgroundTintColor(0xffffff);
            }
        });

        this.uiContainer.addChild(this.addTextButton.button.view);
    }

    private createTextInput() {
        this.addTextInput = new SimpleInputText({
            x: 100,
            y: 320,
            maxLength: 15,
            align: "left",
            placeholder: "Enter text",
            secure: false,
            value: "",
            padding: {top: 10, bottom: 10, left: 10, right: 10},
            cleanOnFocus: true,
            addMask: false,
            backgroundColour: 0xffffff,
            roundedRect: {x: 0, y: 0, width: 250, height: 100, radius: 10},
            textStyle: new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: 24,
                fill: '#ffffff',
                fontWeight: 'bold',
                strokeThickness: 5,
            })
        });

        this.uiContainer.addChild(this.addTextInput.input);
    }


    private loadImages() {
        const folderPath = MagicWordsConstants.magicWordsImagePath;

        for (let i = 1; i <= this.imageCount; i++) {
            const fileName = `image_${i}.jpg`;
            const texture = PIXI.Texture.from(`${folderPath}${fileName}`);
            this.images.push(texture);
        }
    }

    private generateRandomTextStyle(): PIXI.TextStyle {
        const randomFontSize = Math.floor(Math.random() * (MagicWordsConstants.fontSize.max - MagicWordsConstants.fontSize.min + 1)) + MagicWordsConstants.fontSize.min;

        const randomFontFamily = MagicWordsConstants.fontFamilies[Math.floor(Math.random() * MagicWordsConstants.fontFamilies.length)];
        const randomFontWeight: PIXI.TextStyleFontWeight = MagicWordsConstants.fontWeights[Math.floor(Math.random() * MagicWordsConstants.fontWeights.length)];
        const randomFontStyle: PIXI.TextStyleFontStyle = MagicWordsConstants.fontStyles[Math.floor(Math.random() * MagicWordsConstants.fontStyles.length)];
        const randomStrokeThickness = Math.floor(Math.random() * (MagicWordsConstants.strokeThickness.max - MagicWordsConstants.strokeThickness.min + 1)) + MagicWordsConstants.strokeThickness.min;

        const randomColor = this.getRandomColor();

        return new PIXI.TextStyle({
            fontFamily: randomFontFamily,
            fontSize: randomFontSize,
            fontStyle: randomFontStyle,
            fontWeight: randomFontWeight,
            fill: randomColor,
            strokeThickness: randomStrokeThickness,
            wordWrap: true,
            wordWrapWidth: 440,
        });
    }

    private getRandomColor(): string | string[] {
        if (Math.random() > 0.5) {
            return MagicWordsConstants.colors[Math.floor(Math.random() * MagicWordsConstants.colors.length)];
        } else {
            const startColor = MagicWordsConstants.colors[Math.floor(Math.random() * MagicWordsConstants.colors.length)];
            const endColor = MagicWordsConstants.colors[Math.floor(Math.random() * MagicWordsConstants.colors.length)];
            return [startColor, endColor];
        }
    }

    // pick random image and text and display them in another container
    private displayRandomImage() {
        this.gameplayContainer.removeChildren();

        const container = new PIXI.Container();

        const imageSprite = this.createRandomImage();
        container.addChild(imageSprite);

        const pixiText = this.createRandomText(imageSprite);
        container.addChild(pixiText);

        this.gameplayContainer.addChild(container);
    }

    private createRandomImage(): PIXI.Sprite {
        const randomImageIndex = Math.floor(Math.random() * this.images.length);
        const randomImage = this.images[randomImageIndex];
        const imageSprite = new PIXI.Sprite(randomImage);

        const maxWidth = Math.floor(Math.random() * (this.app.screen.width - MagicWordsConstants.imageSize.max + 1)) + MagicWordsConstants.imageSize.min;
        const maxHeight = Math.floor(Math.random() * (this.app.screen.height - MagicWordsConstants.imageSize.min + 1)) + MagicWordsConstants.imageSize.max;

        const imageWidth = imageSprite.width;
        const imageHeight = imageSprite.height;

        const scaleX = maxWidth / imageWidth;
        const scaleY = maxHeight / imageHeight;
        const scale = Math.min(scaleX, scaleY);

        imageSprite.width = imageWidth * scale;
        imageSprite.height = imageHeight * scale;

        imageSprite.x = Math.random() * (this.app.screen.width - imageSprite.width);
        imageSprite.y = Math.random() * (this.app.screen.height - imageSprite.height);

        const filter = this.generateRandomPixiFilter();
        if (filter) {
            imageSprite.filters = [filter];
        }

        return imageSprite;
    }

    private createRandomText(imageSprite: PIXI.Sprite): PIXI.Text {
        const randomText = this.randomText[Math.floor(Math.random() * this.randomText.length)];

        const textStyle = this.generateRandomTextStyle();

        const pixiText = new PIXI.Text(randomText, textStyle);
        pixiText.anchor.set(0.5);

        const maxTextWidth = imageSprite.width - 20;
        const maxTextHeight = imageSprite.height - 20;

        const randomX = Math.random() * maxTextWidth + imageSprite.x + 10;
        const randomY = Math.random() * maxTextHeight + imageSprite.y + 10;

        pixiText.x = randomX;
        pixiText.y = randomY;

        return pixiText;
    }


    private generateRandomPixiFilter(): PIXI.Filter | undefined {
        const filters = [
            () => {
                const filter = new PIXI.ColorMatrixFilter();
                const randomBrightness = Math.random() *
                    (MagicWordsConstants.filterRanges.brightness.max - MagicWordsConstants.filterRanges.brightness.min) +
                    MagicWordsConstants.filterRanges.brightness.min;
                const randomGreyscale = Math.random() *
                    (MagicWordsConstants.filterRanges.greyscale.max - MagicWordsConstants.filterRanges.greyscale.min) +
                    MagicWordsConstants.filterRanges.greyscale.min;

                filter.brightness(randomBrightness, false);
                filter.greyscale(randomGreyscale, false);
                return filter;
            },

            () => new PIXI.AlphaFilter(
                Math.random() * (MagicWordsConstants.filterRanges.alpha.max - MagicWordsConstants.filterRanges.alpha.min) +
                MagicWordsConstants.filterRanges.alpha.min
            ),

            () => {
                const displacementSprite = PIXI.Sprite.from(`${MagicWordsConstants.magicWordsImagePath}/map/displacement_map.jpg`);
                const filter = new PIXI.DisplacementFilter(displacementSprite);
                const randomScale = Math.random() *
                    (MagicWordsConstants.filterRanges.displacementScale.max - MagicWordsConstants.filterRanges.displacementScale.min) +
                    MagicWordsConstants.filterRanges.displacementScale.min;

                displacementSprite.scale.set(randomScale / 100); // Scale the displacement map
                return filter;
            },

            // NoiseFilter with random noise intensity
            () => new PIXI.NoiseFilter(
                Math.random() * (MagicWordsConstants.filterRanges.noise.max - MagicWordsConstants.filterRanges.noise.min) +
                MagicWordsConstants.filterRanges.noise.min
            ),

            // Return undefined (no filter applied)
            () => undefined
        ];

        const randomFilter = filters[Math.floor(Math.random() * filters.length)];
        return randomFilter();
    }



    public override update(deltaTime: number): void {
        this.timer += deltaTime * (1 / Ticker.shared.FPS);

        if (this.timer > MagicWordsConstants.timeToDisplay) {
            this.displayRandomImage();
            this.timer = 0;
        }
    }

    public override disable() {
        super.disable();
    }
}
