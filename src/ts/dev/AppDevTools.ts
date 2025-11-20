import {type Application} from "pixi.js";
import {initDevtools as initPixiDevTools} from "@pixi/devtools";
import Stats from "stats.js";
import {SoundDevTool} from "./tools/SoundDevTool";
import funnyLogger from "./tools/FunnyLogger";
import {GUIManager} from "../gui/GUIManager";
import {GUIRectangleObject} from "./gui-integrators/GUIRectangleObject";
import {GUISpriteGridObject} from "./gui-integrators/GUISpriteGridObject";
import {GUIFilters} from "./gui-integrators/GUIFilters";
import {type FilterService} from "../services/FilterService";
import {type RectangleObject} from "../gameobjects/RectangleObject";
import {type SpriteGridObject} from "../gameobjects/SpriteGridObject";
import {type SoundService} from "../services/SoundService";

export type TGUIGameObjects = {
    rectangle: RectangleObject,
    spriteGrid: SpriteGridObject
}

export type TGUIServices = {
    filterService: FilterService,
    soundService: SoundService,
}

export class AppDevTools {
    private readonly app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public init(gameObjects: TGUIGameObjects, services: TGUIServices) {
        const guiManager = new GUIManager();
        const {spriteGrid, rectangle} = gameObjects;
        const {filterService, soundService} = services;

        void initPixiDevTools({app: this.app});
        this.runStats();

        this.app.ticker.add(() => {
            guiManager.update();
        });

        new GUIRectangleObject(rectangle, guiManager, () => rectangle.redraw());
        new GUISpriteGridObject(spriteGrid, guiManager, () => spriteGrid.redraw());
        new SoundDevTool(guiManager.getGui(), soundService, funnyLogger)
        new GUIFilters(filterService, guiManager);
    }

    private runStats() {
        const stats = new Stats();
        stats.showPanel(0);
        document.body.appendChild(stats.dom);
        this.app.ticker.add(() => {
            stats.update();
        });
    }
}
