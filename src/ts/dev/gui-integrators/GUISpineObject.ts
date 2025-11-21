import { type GUIManager } from "../../gui/GUIManager";
import { type SpineObject } from "../../gameobjects/SpineObject";
import { SliderControl } from "../../gui/SliderControl";
import { ButtonControl } from "../../gui/ButtonControl";
import { DropdownControl } from "../../gui/DropdownControl";
import { CheckboxControl } from "../../gui/CheckboxControl";

export class GUISpineObject {
    private readonly guiManager: GUIManager;
    private readonly spineObject: SpineObject;
    private readonly folderName = "Spine Controls";

    private readonly guiState = {
        animation: "walk",
        timeScale: 1.0,
        loop: true,
        shoot: () => this.triggerShoot(),
        jump: () => this.triggerJump(),
        death: () => this.triggerDeath()
    };

    constructor(spineObject: SpineObject, guiManager: GUIManager) {
        this.spineObject = spineObject;
        this.guiManager = guiManager;
        this.initControls();
    }

    private initControls() {
        this.guiManager.addControls([
            new DropdownControl(this.guiState, {
                property: "animation",
                label: "Animation Type",
                options: ["idle", "walk", "run", "hoverboard", "portal", "shoot", "jump"],
                onChange: (value: string) => {
                    this.spineObject.spine?.state.setAnimation(0, value, this.guiState.loop);
                }
            }),
            new CheckboxControl(this.guiState, {
                property: "loop",
                label: "Loop",
                onChange: (val: boolean) => {
                    this.spineObject.spine?.state.setAnimation(0, this.guiState.animation, val);
                }
            }),
            new SliderControl(this.guiState, {
                property: "timeScale",
                label: "Speed",
                min: 0,
                max: 3,
                step: 0.1,
                onChange: (value: number) => {
                    this.spineObject.spine?.state.timeScale = value;
                }
            }),
            new ButtonControl(this.guiState, { methodName: "shoot", label: "Shoot (Track 1)" }),
            new ButtonControl(this.guiState, { methodName: "jump", label: "Jump (Track 0)" }),
            new ButtonControl(this.guiState, { methodName: "death", label: "Death" })

        ], this.folderName);
    }

    private triggerShoot() {
        this.spineObject.spine?.state.setAnimation(1, "shoot", false);
    }

    private triggerJump() {
        this.spineObject.spine?.state.setAnimation(0, "jump", false);
        this.spineObject.spine?.state.addAnimation(0, this.guiState.animation, true, 0);
    }

    private triggerDeath() {
        this.spineObject.spine?.state.setAnimation(0, "death", false);
    }
}