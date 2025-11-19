import * as dat from "dat.gui";
import {BaseGUIControl} from "./BaseGUIControl";
import {type TSliderControlSettings} from "./types";

export class StatusControl extends BaseGUIControl {
    constructor(
        private target: any,
        private settings: TSliderControlSettings,
    ) {
        super();
    }

    protected createController(folder: dat.GUI) {
        const controller = folder
            .add(this.target, this.settings.property, this.settings.min, this.settings.max, this.settings.step)
            .name(this.settings.label)
            .listen();

        controller.domElement.style.pointerEvents = "none";

        return controller;
    }
}
