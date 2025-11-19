import * as dat from "dat.gui";
import { BaseGUIControl } from "./BaseGUIControl";
import {type TBaseControlSettings} from "./types";

export class CheckboxControl extends BaseGUIControl {
    constructor(
        private target: any,
        private settings: TBaseControlSettings<boolean>,
    ) {
        super();
    }

    protected createController(folder: dat.GUI) {
        return folder.add(this.target, this.settings.property).name(this.settings.label);
    }

    protected configureController(controller: dat.GUIController) {
        if (this.settings.onChange) {
            controller.onChange(this.settings.onChange);
        }
    }
}