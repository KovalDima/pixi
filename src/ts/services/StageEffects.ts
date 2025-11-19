import {type Application, Sprite} from "pixi.js";
import {ColorUtils} from "../utils/ColorUtils";

export class StageEffects {
    private app: Application;
    private shakeConfig = {
        isEffectEnabled: false,
        shakeElapsed: 0,
        shakeDuration: 3,
        shakeIntensity: 30,
        shakeDelaySeconds: 3,
    };
    private bleedingTime = 0;
    private screenshotSprite: Sprite | null = null;
    private screenshotTimer: number = 0;

    private readonly SCREENSHOT_DURATION_MS = 3000;
    private readonly SCREENSHOT_SCALE = 0.5;
    private readonly SCREENSHOT_MARGIN = 10;
    private readonly BLEED_TIME_INCREMENT = 0.01;

    constructor(app: Application) {
        this.app = app;
        this.runStageShaking(this.shakeConfig.shakeDelaySeconds);
    }

    public runStageShaking(delaySec: number) {
        const ms = 1000;
        setTimeout(() => {
            this.shakeConfig.isEffectEnabled = true;
            this.shakeConfig.shakeElapsed = 0;
        }, delaySec * ms);
    }

    private shakeStage(delta: number) {
        const {isEffectEnabled, shakeIntensity, shakeElapsed, shakeDuration} = this.shakeConfig;
        if (isEffectEnabled) {
            const deltaTimeSeconds = delta / 60;
            const shakeOffsetX = Math.random() * shakeIntensity;
            const shakeOffsetY = Math.random() * shakeIntensity;
            this.shakeConfig.shakeElapsed += deltaTimeSeconds;

            if (shakeElapsed < shakeDuration) {
                this.app.stage.x = shakeOffsetX;
                this.app.stage.y = shakeOffsetY;
            } else {
                this.shakeConfig.isEffectEnabled = false;
                this.app.stage.x = 0;
                this.app.stage.y = 0;
            }
        }
    }

    private bleedStageColors(delta: number) {
        this.bleedingTime += this.BLEED_TIME_INCREMENT * delta;
        this.app.renderer.background.color = ColorUtils.getBleedingColor(this.bleedingTime);
    }

    private showStageScreenshot() {
        const screenshotTexture = this.app.renderer.generateTexture(this.app.stage);
        this.screenshotSprite = new Sprite(screenshotTexture);

        this.screenshotSprite.scale.set(this.SCREENSHOT_SCALE);
        const x = this.app.screen.width - this.screenshotSprite.width - this.SCREENSHOT_MARGIN;
        const y = this.app.screen.height - this.screenshotSprite.height - this.SCREENSHOT_MARGIN;
        this.screenshotSprite.position.set(x, y);
        this.screenshotSprite.alpha = 0.9;
        this.app.stage.addChild(this.screenshotSprite);
    }

    private removeStageScreenshot() {
        if (this.screenshotSprite) {
            this.app.stage.removeChild(this.screenshotSprite);
            this.screenshotSprite = null;
            this.screenshotTimer = 0;
        }
    }

    private makeScreenShotOnShakeFinish() {
        const {isEffectEnabled, shakeElapsed, shakeDuration} = this.shakeConfig;
        if (isEffectEnabled && shakeElapsed > shakeDuration) {
            this.showStageScreenshot();
        }
    }

    private runDelayScreenshotRemove(delta: number) {
        const deltaTimeMS = (delta / 60) * 1000;
        this.screenshotTimer += deltaTimeMS;
        if (this.screenshotTimer > this.SCREENSHOT_DURATION_MS) {
            this.removeStageScreenshot();
        }
    }

    public update(delta: number) {
        this.shakeStage(delta);
        this.makeScreenShotOnShakeFinish();
        if (this.screenshotSprite) {
            this.runDelayScreenshotRemove(delta);
        }
        this.bleedStageColors(delta);
    }
}