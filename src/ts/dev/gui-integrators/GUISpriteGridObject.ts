import { type GUIManager } from "../../gui/GUIManager";
import {type SpriteGridObject} from "../../gameobjects/SpriteGridObject";
import { SliderControl } from "../../gui/SliderControl";
import {ButtonControl} from "../../gui/ButtonControl";

export class GUISpriteGridObject {
    private readonly guiManager: GUIManager;
    private readonly spriteGridObject: SpriteGridObject;
    private readonly folderName = "SpriteGrid Controls";
    private readonly onUpdate: () => void;

    constructor(spriteContainer: SpriteGridObject, guiManager: GUIManager, onUpdate: () => void) {
        this.guiManager = guiManager;
        this.spriteGridObject = spriteContainer;
        this.onUpdate = onUpdate;
        this.initControls();
    }

    private initControls() {
        const target = this.spriteGridObject.config;
        this.guiManager.addControls([
            new SliderControl(target, { property: "x", label: "Position X", min: 0, max: 1000, step: 1, onChange: this.onUpdate }),
            new SliderControl(target, { property: "y", label: "Position Y", min: 0, max: 1000, step: 1, onChange: this.onUpdate }),
            new ButtonControl(this.spriteGridObject, { methodName: "reset", label: "Reset Sprites" })
        ], this.folderName);
    }
}