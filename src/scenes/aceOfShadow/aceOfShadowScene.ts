import {Scene} from "../scene";
import {SceneConfig} from "../scenesController";
import * as PIXI from "pixi.js";
import {ScenesConstants} from "../scenesConstants";
import {Ticker} from "pixi.js";

// this could and should be moved to a json to be let designer change it easily
const AceOfShadowConstants = {
    totalCard: 144,
    belowCardOffset: 10,
    stackXOffset: 300,
    moveEverySeconds: 1,
    timeToMove: 2,
}

export class AceOfShadowsScene extends Scene {

    private cardImages: PIXI.Texture[] = [];
    private firstStack : PIXI.Sprite[] = [];
    private secondStack : PIXI.Sprite[] = [];

    private animationTicker: PIXI.Ticker;
    private timeSinceLastMove: number = 0;

    private firstStackPosition : {x:number, y:number} = {x:0, y:0};
    private secondStackPosition : {x:number, y:number} = {x:0, y:0};

    constructor(config: SceneConfig, app: PIXI.Application<HTMLCanvasElement>) {
        super(config, app);

        this.loadImages();
        this.firstStackPosition =  {x : this.app.screen.width * 0.5 - AceOfShadowConstants.stackXOffset, y: this.app.screen.height * 0.4};
        this.secondStackPosition =  {x : this.app.screen.width * 0.5 + AceOfShadowConstants.stackXOffset, y: this.app.screen.height * 0.4};

        this.animationTicker = new PIXI.Ticker();
        this.animationTicker.add(this.handleAnimation, this);

    }

    private initializeCards() {
        for(let i = 0; i < AceOfShadowConstants.totalCard; i++) {
            const randomImageIndex = Math.floor(Math.random() * this.cardImages.length);
            const randomImage = this.cardImages[randomImageIndex];

            const card = new PIXI.Sprite(randomImage);
            this.initializeCardPosition(i, card);
            this.gameplayContainer.addChild(card);
            this.firstStack.push(card);
        }
    }

    private initializeCardPosition(cardIndex: number, card: PIXI.Sprite) {
        if (cardIndex !== AceOfShadowConstants.totalCard - 1 && cardIndex !== AceOfShadowConstants.totalCard -2) {
            card.visible = false;
        }
        card.x = this.firstStackPosition.x + (cardIndex === AceOfShadowConstants.totalCard - 1 ? AceOfShadowConstants.belowCardOffset : 0);
        card.y = this.firstStackPosition.y + (cardIndex === AceOfShadowConstants.totalCard - 1 ? -AceOfShadowConstants.belowCardOffset : 0);;
    }

    public override start() {
        super.start();

        this.initializeCards();
        this.animationTicker.start();
    }

    private loadImages() {
        const folderPath = `${ScenesConstants.imagesAssetFolder}scenes/aceOfShadow/`;

        for (let i = 1; i <= 16; i++) {
            const fileName = `card_${i}.png`;
            const texture = PIXI.Texture.from(`${folderPath}${fileName}`);
            this.cardImages.push(texture);
        }
    }

    private handleAnimation(deltaTime: number): void {
        this.timeSinceLastMove += deltaTime * (1 / Ticker.shared.FPS);

        if (this.timeSinceLastMove > AceOfShadowConstants.moveEverySeconds && this.firstStack.length > 0) {
            this.timeSinceLastMove = 0;
            this.moveTopCard();
        }
    }

    private moveTopCard(): void {
        const topCard = this.firstStack.pop();
        if (!topCard) {
            return;
        }
        // Add the card to the second stack
        const cardIndex = this.secondStack.length - 1;
        this.secondStack.push(topCard);

        // move to top of container
        this.gameplayContainer.removeChild(topCard);
        this.gameplayContainer.addChild(topCard);


        // Show the next card in the first stack
        const firstStackLength = this.firstStack.length;

        // Show the card below the top card with a decal to show the stack without displaying lot's of sprite and move the top card to the top of the second stack
        if (firstStackLength > 0) {
            this.firstStack[firstStackLength- 1].visible = true;
            this.firstStack[firstStackLength-1].position.x += AceOfShadowConstants.belowCardOffset;
            this.firstStack[firstStackLength-1].position.y -= AceOfShadowConstants.belowCardOffset;
            if (firstStackLength > 1) {
                this.firstStack[firstStackLength - 2].visible = true;
            }
        }

        // Animate the card's movement
        const targetPosition = { x: this.secondStackPosition.x, y: this.secondStackPosition.y};
        const startPosition = { x: this.firstStackPosition.x + AceOfShadowConstants.belowCardOffset, y:this.firstStackPosition.y -AceOfShadowConstants.belowCardOffset};
        let elapsed = 0;

        const moveTicker = new PIXI.Ticker();
        moveTicker.add((deltaTime: number) => {
            if (this.animationTicker.started === false) {
                moveTicker.stop();
                return;
            }
            elapsed += deltaTime * (1 / Ticker.shared.FPS);
            const progress = Math.min(elapsed / AceOfShadowConstants.timeToMove, 1);

            // Interpolate card position
            topCard.x = startPosition.x + (targetPosition.x - startPosition.x) * progress;
            topCard.y = startPosition.y + (targetPosition.y - startPosition.y) * progress;

            // a card just finished moving
            if (progress === 1) {
                topCard.filters = [];
                // Hide card 2 rank below the top, recal below the top card and show the card below with decals to show the stack without displaying lot's of sprite
                if (cardIndex >= 1) {
                    topCard.position.x += AceOfShadowConstants.belowCardOffset;
                    topCard.position.y -= AceOfShadowConstants.belowCardOffset;
                    this.secondStack[cardIndex-1].position.x =  this.secondStackPosition.x;
                    this.secondStack[cardIndex-1].position.y = this.secondStackPosition.y;
                    if (cardIndex > 2) {
                        this.secondStack[cardIndex-2].visible = false;
                    }
                }
                moveTicker.stop();
            }
        });
        moveTicker.start();
    }

    public override disable() {
        super.disable();
        this.animationTicker.stop();
        // remove all children from the gameplay container
        this.gameplayContainer.removeChildren();
        // empty the stacks
        this.firstStack = [];
        this.secondStack = [];
    }

    public override update(_deltaTime: number): void {}
}