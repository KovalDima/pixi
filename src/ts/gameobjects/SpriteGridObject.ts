import {Container, Texture, Sprite} from "pixi.js";
import {GameObject} from "./GameObject";
import {type TSpriteGridConfig} from "./types";

export class SpriteGridObject extends GameObject<TSpriteGridConfig> {
    public readonly view: Container;
    public config? : TSpriteGridConfig;
    private texture: Texture | null = null;

    public localCenter: { x: number, y: number } = { x: 0, y: 0 };
    public localSize: { width: number, height: number } = { width: 0, height: 0 };

    constructor() {
        super();
        this.view = new Container();
    }

    public init(config: TSpriteGridConfig) {
        this.config = config;
        const { imgUrl, x, y, gridAmount, columns, spacing } = config;

        this.texture = Texture.from(imgUrl);
        this.view.x = x;
        this.view.y = y;
        this.createShapeGrid(gridAmount, columns, spacing);
    }

    private createShapeGrid(amount: number, columns: number, spacing: number) {
        this.view.removeChildren();

        if (!this.texture) {
            console.error("Texture isn't setup. Call init() first");
            return;
        }

        for (let i = 0; i < amount; i++) {
            const shape = new Sprite(this.texture);
            shape.anchor.set(0.5, 0.5);
            shape.x = (i % columns) * spacing;
            shape.y = Math.floor(i / columns) * spacing;
            shape.rotation = Math.random() * Math.PI * 2;
            this.view.addChild(shape);
        }

        const gridWidth = (columns - 1) * spacing;
        const gridRows = Math.ceil(amount / columns);
        const gridHeight = (gridRows - 1) * spacing;
        this.localSize.width = gridWidth;
        this.localSize.height = gridHeight;

        this.centerSpriteGrid();
    }

    private centerSpriteGrid() {
        this.localCenter.x = this.localSize.width / 2;
        this.localCenter.y = this.localSize.height / 2;
        this.view.pivot.x = this.localCenter.x;
        this.view.pivot.y = this.localCenter.y;
    }

    public redraw() {
        if (!this.config) return;

        this.view.x = this.config.x;
        this.view.y = this.config.y;
    }

    public reset() {
        this.view.removeChildren();
        this.view.position.set(0, 0);
        this.view.pivot.set(0, 0);
        this.view.scale.set(1, 1);
        this.view.rotation = 0;
        this.localCenter.x = 0;
        this.localCenter.y = 0;
        this.localSize.width = 0;
        this.localSize.height = 0;
        this.texture = null;
    }
}