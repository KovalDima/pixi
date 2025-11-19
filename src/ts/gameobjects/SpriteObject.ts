import {Sprite, Texture} from "pixi.js";
import {GameObject} from "./GameObject";
import {type TSpriteConfig} from "./types";

export class SpriteObject extends GameObject<TSpriteConfig>{
    public readonly view: Sprite;
    public config?: TSpriteConfig;

    constructor() {
        super();
        this.view = new Sprite();
    }

    public init(config: TSpriteConfig) {
        this.config = config;
        try {
            this.view.texture = Texture.from(config.imgUrl);
        } catch (error) {
            throw new Error(`Failed to get texture for: ${config.imgUrl}`);
        }
        this.redraw();
    }

    public redraw() {
        if (!this.config) {
            return;
        }

        const {x, y, scale, anchor} = this.config;

        this.view.position.set(x, y);

        if (typeof scale === 'number') {
            this.view.scale.set(scale, scale);
        } else if (scale) {
            this.view.scale.set(scale.x, scale.y);
        }

        if (typeof anchor === 'number') {
            this.view.anchor.set(anchor, anchor);
        } else if (anchor) {
            this.view.anchor.set(anchor.x, anchor.y);
        }
    }

    public reset() {
        this.view.texture = Texture.EMPTY;
        this.view.position.set(0, 0);
        this.view.scale.set(1, 1);
        this.view.anchor.set(0, 0);
    }
}