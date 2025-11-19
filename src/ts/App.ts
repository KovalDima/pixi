import {Application, Assets} from "pixi.js";
import {AssetConstants} from "./AssetConstants";
import {GameObjectManager} from "./factory/GameObjectManager";
import {PooledGameObjectFactory} from "./factory/PooledGameObjectFactory";
import {RectangleObject} from "./gameobjects/RectangleObject";
import {SpriteGridObject} from "./gameobjects/SpriteGridObject";
import {SpriteObject} from "./gameobjects/SpriteObject";
import {AnimationService} from "./services/AnimationService";
import {SoundService} from "./services/SoundService";
import {FilterService} from "./services/FilterService";
import {MaskService} from "./services/MaskService";
import {type TGameObjectMap} from "./factory/types";
import {StageEffects} from "./services/StageEffects";
import {Config} from "./Config";

export class PixiApp {
    public readonly soundService: SoundService;
    public readonly app: Application;
    private appWidth = 0;
    private appHeight = 0;
    private manager: GameObjectManager;
    private stageEffects: StageEffects;
    private readonly animationService: AnimationService;
    private readonly filterService: FilterService;
    private readonly maskService: MaskService;
    private readonly gameObjects: TGameObjectMap;
    private namedSprites: Record<string, SpriteObject> = {};

    private constructor(parent: HTMLElement, soundService: SoundService) {
        this.app = PixiApp.initPixi(parent);
        this.updateAppSize();
        this.manager = new GameObjectManager();
        this.stageEffects = new StageEffects(this.app);
        this.animationService = new AnimationService();
        this.soundService = soundService;
        this.maskService = new MaskService();
        this.filterService = new FilterService();

        this.registerFactories();
        this.gameObjects = this.initGameObjects();
        this.animateGameObjects();
        this.applyTransformations();
        this.applyMasks();
        this.applyFilters();
        this.startGameLoop();
        if (__DEV__) {
            const { AppDevTools } = require("./dev/AppDevTools");
            new AppDevTools(this).init(this.gameObjects, this.filterService);
        }
    }

    public static async create(parent: HTMLElement): Promise<PixiApp> {
        await Assets.load(AssetConstants.SYMBOLS_JSON);

        const soundService = new SoundService();
        await soundService.loadSounds();

        return new PixiApp(parent, soundService);
    }

    private static initPixi(parent: HTMLElement) {
        const app = new Application({
            resizeTo: window,
            backgroundColor: 0x1a1a2e,
            antialias: true
        });

        parent.appendChild(app.view as HTMLCanvasElement);
        return app;
    }

    private registerFactories() {
        this.manager.register(
            "rectangle",
            new PooledGameObjectFactory(() => new RectangleObject(), 10)
        );
        this.manager.register(
            "spriteGrid",
            new PooledGameObjectFactory(() => new SpriteGridObject(), 5)
        );
        this.manager.register(
            "sprite",
            new PooledGameObjectFactory(() => new SpriteObject(), 15)
        );
    }

    private initGameObjects(): TGameObjectMap {
        const spriteGrid = this.manager.create("spriteGrid", {
            imgUrl: AssetConstants.BUNNY_URL,
            x: this.appWidth / 6,
            y: this.appHeight / 4,
            gridAmount: 25,
            columns: 5,
            spacing: 40
        });
        this.app.stage.addChild(spriteGrid.view);

        const rectangle = this.manager.create("rectangle", {
            x: this.appWidth / 2,
            y: this.appHeight / 2,
            width: 300,
            height: 300,
            color: Config.colors.Red,
            opacity: 1.0,
            centered: true
        });
        this.app.stage.addChild(rectangle.view);

        const rectangleChess = this.manager.create("rectangle", {
            x: this.appWidth * 0.75,
            y: this.appHeight * 0.7,
            width: 250,
            height: 250,
            color: Config.colors.Green,
            opacity: 1.0,
            centered: true
        });
        this.app.stage.addChild(rectangleChess.view);

        const coin = this.manager.create("sprite", {
            imgUrl: "coin.png",
            x: this.appWidth * 0.08,
            y: this.appHeight * 0.9,
            anchor: 0.5,
            scale: 0.5
        });
        this.app.stage.addChild(coin.view);
        this.namedSprites.coin = coin;

        return {
            spriteGrid,
            rectangle,
            rectangleChess,
            sprite: coin
        };
    }

    private animateGameObjects() {
        const {spriteGrid, rectangle} = this.gameObjects;
        const {coin} = this.namedSprites;
        const {appearFromTop, pulsate, fadeOut, sway} = this.animationService;

        appearFromTop(rectangle.view);
        pulsate(rectangle.view, {
            onRepeat: () => this.soundService.play("game_over")
        });

        appearFromTop(spriteGrid.view, {duration: 2.0, delay: 0.5, yOffset: 600});
        sway(spriteGrid.view, {delay: 2.0, duration: 1.0});
        fadeOut(spriteGrid.view, {delay: 5.0, duration: 5.0});

        sway(coin.view, {delay: 0, duration: 0.6})
    }

    private applyTransformations() {
        const {rectangle, spriteGrid} = this.gameObjects;

        rectangle.view.scale.set(1.2, 1.2);
        rectangle.view.rotation = 45 * Math.PI / 180;

        spriteGrid.view.y += 100;
        spriteGrid.view.x += 150;
        spriteGrid.view.scale.set(2);
        spriteGrid.view.rotation = -20 * Math.PI / 180;
    }

    private applyMasks() {
        const {rectangle, rectangleChess, spriteGrid} = this.gameObjects;
        const radiusCircleMask = Math.max(spriteGrid.localSize.width, spriteGrid.localSize.height) / 2;

        const starMask = this.maskService.createStarMask({
            points: 7,
            outerRadius: rectangle.config.width / 2,
            innerRadius: 80,
            x: rectangle.config.width / 2,
            y: rectangle.config.height / 2
        });
        const checkerMask = this.maskService.createCheckerboardMask({
            width: rectangleChess.view.width,
            height: rectangleChess.view.height,
            numSquaresX: 10,
            numSquaresY: 10,
            offsetX: 0,
            offsetY: 0
        });
        const circleMask = this.maskService.createCircleMask({
            radius: radiusCircleMask,
            x: spriteGrid.localCenter.x,
            y: spriteGrid.localCenter.y,
        });

        this.maskService.applyMask(rectangleChess.view, checkerMask);
        this.maskService.applyMask(rectangle.view, starMask);
        this.maskService.applyMask(spriteGrid.view, circleMask);
    }

    private applyFilters() {
        const { spriteGrid, rectangle } = this.gameObjects;
        const blurFilter = this.filterService.createBlurFilter();
        const colorFilter = this.filterService.createColorMatrixFilter();

        this.filterService.applyFilters(spriteGrid.view, [blurFilter, colorFilter]);
        this.filterService.animateBlur(blurFilter, {
            to: 8,
            duration: 1.0,
            delay: 2.0
        });

        this.filterService.applyFilters(rectangle.view, [colorFilter]);
        this.filterService.animateHueRotation(colorFilter, {});
    }

    private startGameLoop() {
        this.app.ticker.add((delta) => {
            this.stageEffects.update(delta);
        });
    }

    private updateAppSize() {
        this.appWidth = this.app.screen.width;
        this.appHeight = this.app.screen.height;
    }

    public destroy() {
        this.app.destroy(true, { children: true });
    }
}
