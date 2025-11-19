import * as dat from "dat.gui";
import type { IGUIControl } from "./types";

export abstract class BaseGUIControl implements IGUIControl {
    protected controller: dat.GUIController | null = null;
    protected folder: dat.GUI | null = null;

    public create(folder: dat.GUI) {
        this.folder = folder;
        this.controller = this.createController(folder);
        this.configureController(this.controller);
    }

    public destroy() {
        if (this.controller && this.folder) {
            this.folder.remove(this.controller);
            this.controller = null;
            this.folder = null;
        }
    }

    protected abstract createController(folder: dat.GUI): dat.GUIController;
    protected configureController(controller: dat.GUIController) {}
}