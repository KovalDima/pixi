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
import {StageEffects} from "./services/StageEffects";
import {Config} from "./Config";
import {GameObjectsConstants} from "./GameObjectsConstants";

export class PixiApp {
    public readonly soundService: SoundService;
    public readonly app: Application;
    private appWidth = 0;
    private appHeight = 0;
    private readonly gameObjectManager: GameObjectManager;
    private stageEffects: StageEffects;
    private readonly animationService: AnimationService;
    private readonly filterService: FilterService;
    private readonly maskService: MaskService;

    private readonly spriteGrid: SpriteGridObject;
    private readonly rectangle: RectangleObject;
    private readonly rectangleChess: RectangleObject;
    private readonly bottomCoin: SpriteObject;

    private constructor(parent: HTMLElement, soundService: SoundService) {
        this.app = PixiApp.initPixi(parent);
        this.updateAppSize();
        this.gameObjectManager = new GameObjectManager();
        this.stageEffects = new StageEffects(this.app);
        this.animationService = new AnimationService();
        this.soundService = soundService;
        this.maskService = new MaskService();
        this.filterService = new FilterService();

        this.registerFactories();

        const {spriteGrid, rectangle, rectangleChess, coin} = this.initGameObjects();
        this.spriteGrid = spriteGrid;
        this.rectangle = rectangle;
        this.rectangleChess = rectangleChess;
        this.bottomCoin = coin;

        this.animateGameObjects();
        this.applyTransformations();
        this.applyMasks();
        this.applyFilters();
        this.startGameLoop();

        if (__DEV__) {
            const { AppDevTools } = require("./dev/AppDevTools");
            const guiGameObjects: import("./dev/AppDevTools").TGUIGameObjects = {
                rectangle: this.rectangle,
                spriteGrid: this.spriteGrid,
            };
            const guiServices: import("./dev/AppDevTools").TGUIServices = {
                filterService: this.filterService,
                soundService: this.soundService,
            };
            new AppDevTools(this.app).init(guiGameObjects, guiServices);
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
        this.gameObjectManager.register(
            GameObjectsConstants.RECTANGLE,
            new PooledGameObjectFactory(() => new RectangleObject(), 10)
        );
        this.gameObjectManager.register(
            GameObjectsConstants.SPRITE_GRID,
            new PooledGameObjectFactory(() => new SpriteGridObject(), 5)
        );
        this.gameObjectManager.register(
            GameObjectsConstants.SPRITE,
            new PooledGameObjectFactory(() => new SpriteObject(), 15)
        );
    }

    private initGameObjects() {
        const spriteGrid = this.gameObjectManager.create(GameObjectsConstants.SPRITE_GRID, {
            imgUrl: AssetConstants.BUNNY_URL,
            x: this.appWidth / 6,
            y: this.appHeight / 4,
            gridAmount: 25,
            columns: 5,
            spacing: 40
        });
        const rectangle = this.gameObjectManager.create(GameObjectsConstants.RECTANGLE, {
            x: this.appWidth / 2,
            y: this.appHeight / 2,
            width: 300,
            height: 300,
            color: Config.colors.Red,
            opacity: 1.0,
            centered: true
        });
        const rectangleChess = this.gameObjectManager.create(GameObjectsConstants.RECTANGLE, {
            x: this.appWidth * 0.75,
            y: this.appHeight * 0.7,
            width: 250,
            height: 250,
            color: Config.colors.Green,
            opacity: 1.0,
            centered: true
        });
        const coin = this.gameObjectManager.create(GameObjectsConstants.SPRITE, {
            imgUrl: AssetConstants.ALIAS_COIN,
            x: this.appWidth * 0.08,
            y: this.appHeight * 0.9,
            anchor: 0.5,
            scale: 0.5
        });

        this.app.stage.addChild(spriteGrid.view);
        this.app.stage.addChild(rectangle.view);
        this.app.stage.addChild(rectangleChess.view);
        this.app.stage.addChild(coin.view);

        return {
            spriteGrid,
            rectangle,
            rectangleChess,
            coin,
        };
    }

    private animateGameObjects() {
        const {appearFromTop, pulsate, fadeOut, sway} = this.animationService;

        appearFromTop(this.rectangle.view);
        pulsate(this.rectangle.view);

        appearFromTop(this.spriteGrid.view, {duration: 2.0, delay: 0.5, yOffset: 600});
        sway(this.spriteGrid.view, {delay: 2.0, duration: 1.0});
        fadeOut(this.spriteGrid.view, {delay: 5.0, duration: 5.0});

        sway(this.bottomCoin.view, {delay: 0, duration: 0.6});
    }

    private applyTransformations() {
        this.rectangle.view.scale.set(1.2, 1.2);
        this.rectangle.view.rotation = 45 * Math.PI / 180;

        this.spriteGrid.view.y += 100;
        this.spriteGrid.view.x += 150;
        this.spriteGrid.view.scale.set(2);
        this.spriteGrid.view.rotation = -20 * Math.PI / 180;
    }

    private applyMasks() {
        const radiusCircleMask = Math.max(this.spriteGrid.localSize.width, this.spriteGrid.localSize.height) / 2;

        const starMask = this.maskService.createStarMask({
            points: 7,
            outerRadius: this.rectangle.config.width / 2,
            innerRadius: 80,
            x: this.rectangle.config.width / 2,
            y: this.rectangle.config.height / 2
        });
        const checkerMask = this.maskService.createCheckerboardMask({
            width: this.rectangleChess.view.width,
            height: this.rectangleChess.view.height,
            numSquaresX: 10,
            numSquaresY: 10,
            offsetX: 0,
            offsetY: 0
        });
        const circleMask = this.maskService.createCircleMask({
            radius: radiusCircleMask,
            x: this.spriteGrid.localCenter.x,
            y: this.spriteGrid.localCenter.y,
        });

        this.maskService.applyMask(this.rectangleChess.view, checkerMask);
        this.maskService.applyMask(this.rectangle.view, starMask);
        this.maskService.applyMask(this.spriteGrid.view, circleMask);
    }

    private applyFilters() {
        const blurFilter = this.filterService.createBlurFilter();
        const colorFilter = this.filterService.createColorMatrixFilter();

        this.filterService.applyFilters(this.spriteGrid.view, [blurFilter, colorFilter]);
        this.filterService.animateBlur(blurFilter, { to: 8, duration: 1.0, delay: 2.0 });

        this.filterService.applyFilters(this.rectangle.view, [colorFilter]);
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
