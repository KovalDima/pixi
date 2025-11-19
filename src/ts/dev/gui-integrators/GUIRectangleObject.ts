import { type GUIManager } from "../../gui/GUIManager";
import { type RectangleObject } from "../../gameobjects/RectangleObject";
import { SliderControl } from "../../gui/SliderControl";
import { ButtonControl } from "../../gui/ButtonControl";
import { DropdownControl } from "../../gui/DropdownControl";
import {CheckboxControl} from "../../gui/CheckboxControl";
import {Config} from "../../Config";

export class GUIRectangleObject {
    private readonly guiManager: GUIManager;
    private readonly rectangle: RectangleObject;
    private readonly folderName = "Rectangle Controls";
    private readonly onUpdate: () => void;

    private readonly guiState = {
        isDraggable: false
    };

    constructor(rectangle: RectangleObject, guiManager: GUIManager, onUpdate: () => void) {
        this.rectangle = rectangle;
        this.guiManager = guiManager;
        this.onUpdate = onUpdate;
        this.initControls();
    }

    private initControls() {
        const target = this.rectangle.config;
        this.guiManager.addControls([
            new SliderControl(target, { property: "x", label: "Position X", min: -500, max: 500, step: 1, onChange: this.onUpdate }),
            new SliderControl(target, { property: "y", label: "Position Y", min: -500, max: 500, step: 1, onChange: this.onUpdate }),
            new SliderControl(target, { property: "width", label: "Width", min: 50, max: 500, step: 1, onChange: this.onUpdate }),
            new SliderControl(target, { property: "height", label: "Height", min: 50, max: 500, step: 1, onChange: this.onUpdate }),
            new SliderControl(target, { property: "opacity", label: "Opacity", min: 0, max: 1, step: 0.01, onChange: this.onUpdate }),
            new DropdownControl(target, {property: "color", label: "Color", options: Config.colors, onChange: this.onUpdate }),
            new ButtonControl(this.rectangle, { methodName: "randomizeColor", label: "Randomize Color" }),
            new ButtonControl(this.rectangle, { methodName: "reset", label: "Reset Rectangle" }),
            new CheckboxControl(this.guiState, { property: "isDraggable", label: "Draggable", onChange: (value: boolean) => this.rectangle.setDraggable(value)})
        ], this.folderName);
    }
}