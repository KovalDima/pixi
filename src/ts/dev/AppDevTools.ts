import {initDevtools as initPixiDevTools} from "@pixi/devtools";
import Stats from "stats.js";
import {SoundDevTool} from "./tools/SoundDevTool";
import funnyLogger from "./tools/FunnyLogger";
import {PixiApp} from "../App";
import {GUIManager} from "../gui/GUIManager";
import {GUIRectangleObject} from "./gui-integrators/GUIRectangleObject";
import {GUISpriteGridObject} from "./gui-integrators/GUISpriteGridObject";
import {GUIFilters} from "./gui-integrators/GUIFilters";
import {type TGameObjectMap} from "../factory/types";
import {type FilterService} from "../services/FilterService";

export class AppDevTools {
    private readonly guiManager: GUIManager;

    constructor(private readonly mainApp: PixiApp) {
        this.guiManager = new GUIManager();
    }

    public init(gameObjects: TGameObjectMap, filterService: FilterService) {
        const {spriteGrid, rectangle} = gameObjects;

        void initPixiDevTools({app: this.mainApp.app});
        this.runStats();

        new GUIRectangleObject(rectangle, this.guiManager, () => rectangle.redraw());
        new GUISpriteGridObject(spriteGrid, this.guiManager, () => spriteGrid.redraw());
        new SoundDevTool(this.guiManager.getGui(), this.mainApp.soundService, funnyLogger);
        new GUIFilters(filterService, this.guiManager);

        this.mainApp.app.ticker.add(() => {
            this.guiManager.update();
        });
    }

    private runStats() {
        const stats = new Stats();
        stats.showPanel(0);
        document.body.appendChild(stats.dom);
        this.mainApp.app.ticker.add(() => {
            stats.update();
        });
    }
}
