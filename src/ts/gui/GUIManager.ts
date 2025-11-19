import * as dat from "dat.gui";
import type {IGUIControl} from "./types";

export class GUIManager {
    private readonly gui: dat.GUI;
    private folders: Map<string, dat.GUI> = new Map();

    constructor(config?: { width?: number }) {
        this.gui = new dat.GUI(config);
    }

    public update() {
        this.gui.updateDisplay();
    }

    public getGui() {
        return this.gui;
    }

    private getFolder(name: string, autoOpen: boolean = false) {
        if (!this.folders.has(name)) {
            const folder = this.gui.addFolder(name);
            if (autoOpen) {
                folder.open();
            }
            this.folders.set(name, folder);
        }
        return this.folders.get(name)!;
    }

    private addControl(control: IGUIControl, folderName?: string) {
        const target = folderName ? this.getFolder(folderName) : this.gui;
        control.create(target);
    }

    public addControls(controls: IGUIControl[], folderName?: string) {
        controls.forEach(control => this.addControl(control, folderName));
    }
}