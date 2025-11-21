import { Container, Assets } from "pixi.js";
import { Spine } from "pixi-spine";
import { GameObject } from "./GameObject";
import type { TSpineConfig } from "./types";

export class SpineObject extends GameObject<TSpineConfig> {
    public readonly view: Container;
    public spine: Spine | null = null;

    constructor() {
        super();
        this.view = new Container();
    }

    public init(config: TSpineConfig) {
        const { imgUrl, x, y, scale = 1, animation, speed = 1 } = config;
        const resource = Assets.get(imgUrl);

        this.spine = new Spine(resource.spineData);
        this.spine.scale.set(scale);
        this.spine.state.timeScale = speed;
        this.view.position.set(x, y);
        this.view.addChild(this.spine);

        if (animation) {
            this.spine.state.setAnimation(0, animation, true);
        }
    }

    public reset() {
        if (this.spine) {
            this.spine.destroy({ children: true });
            this.spine = null;
        }
        this.view.removeChildren();
        this.view.position.set(0, 0);
        this.view.scale.set(1, 1);
        this.view.rotation = 0;
    }
}