import * as dat from "dat.gui";
import { BaseGUIControl } from "./BaseGUIControl";
import {type TSliderControlSettings} from "./types";

export class SliderControl extends BaseGUIControl {
    constructor(
        private target: any,
        private settings: TSliderControlSettings
    ) {
        super();
    }

    protected createController(folder: dat.GUI) {
        return folder
            .add(
                this.target,
                this.settings.property,
                this.settings.min,
                this.settings.max,
                this.settings.step
            )
            .name(this.settings.label)
            .listen();
    }

    protected configureController(controller: dat.GUIController) {
        if (this.settings.onChange) {
            controller.onChange(this.settings.onChange);
        }
    }
}