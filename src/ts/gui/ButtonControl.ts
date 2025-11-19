import * as dat from "dat.gui";
import {BaseGUIControl} from "./BaseGUIControl";
import {type TButtonControlSettings} from "./types";

export class ButtonControl extends BaseGUIControl {
    constructor(
        private target: any,
        private settings: TButtonControlSettings,
    ) {
        super();
    }

    protected createController(folder: dat.GUI) {
        return folder.add(this.target, this.settings.methodName).name(this.settings.label);
    }
}