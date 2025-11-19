import { type GUIManager } from "../../gui/GUIManager";
import { type FilterService } from "../../services/FilterService";
import { SliderControl } from "../../gui/SliderControl";
import { CheckboxControl } from "../../gui/CheckboxControl";

export class GUIFilters {
    private readonly guiManager: GUIManager;
    private readonly folderName = "Filters";
    private readonly filterService: FilterService;

    constructor(filterService: FilterService, guiManager: GUIManager) {
        this.guiManager = guiManager;
        this.filterService = filterService;
        this.initControls();
    }

    private initControls() {
        const controls = [];

        if (this.filterService.blurFilter) {
            controls.push(
                new CheckboxControl(this.filterService.blurFilter, {
                    property: "enabled",
                    label: "Blur Enabled"
                }),
                new SliderControl(this.filterService.blurFilter, {
                    property: "blur",
                    label: "Blur Strength",
                    min: 0,
                    max: 50,
                    step: 0.5,
                    onChange: () => this.filterService.stopBlurAnimation()
                })
            );
        }

        if (this.filterService.colorFilter) {
            controls.push(
                new CheckboxControl(this.filterService.colorFilter, {
                    property: "enabled",
                    label: "ColorMatrix Enabled"
                })
            );
        }

        if (controls.length > 0) {
            this.guiManager.addControls(controls, this.folderName);
        }
    }
}