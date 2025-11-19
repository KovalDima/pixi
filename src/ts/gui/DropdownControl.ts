import * as dat from "dat.gui";
import {BaseGUIControl} from "./BaseGUIControl";
import {type TDropdownControlSettings} from "./types";

export class DropdownControl extends BaseGUIControl {
    constructor(
        private target: any,
        private settings: TDropdownControlSettings,
    ) {
        super();
    }

    protected createController(folder: dat.GUI) {
        return folder
            .add(this.target, this.settings.property, this.settings.options)
            .name(this.settings.label)
    }

    protected configureController(controller: dat.GUIController) {
        if (this.settings.onChange) {
            controller.onChange(this.settings.onChange);
        }
    }
}