import {Graphics, Container, FederatedPointerEvent} from "pixi.js";
import {GameObject} from "./GameObject";
import {type TRectangleConfig} from "./types";
import {AssetConstants} from "../AssetConstants";
import {ColorUtils} from "../utils/ColorUtils";
import {Config} from "../Config";

export class RectangleObject extends GameObject<TRectangleConfig>{
    public readonly view: Container;
    private readonly graphics: Graphics;
    public config: TRectangleConfig = {
        width: 0,
        height: 0,
        color: Config.colors.White,
        opacity: 1,
        x: 0,
        y: 0
    };
    private isDragging: boolean = false;
    private dragOffset = { x: 0, y: 0 };

    constructor() {
        super();
        this.view = new Container();
        this.graphics = new Graphics();
        this.view.addChild(this.graphics);
        this.bindListeners();
    }

    public init(config: TRectangleConfig) {
        this.config = config;
        this.redraw();
    }

    public redraw(newColor?: number) {
        if (!this.config) {
            return;
        }

        const {x, y, width, height, color, opacity, centered = false} = this.config;
        let fillColor = newColor ?? Number(color);

        this.graphics.clear();
        this.graphics.beginFill(fillColor);
        this.graphics.alpha = opacity;
        this.graphics.drawRect(0, 0, width, height);
        this.graphics.endFill();

        if (centered) {
            this.view.pivot.set(width / 2, height / 2);
        } else {
            this.view.pivot.set(0, 0);
        }
        this.view.position.set(x, y);
    }

    public randomizeColor() {
        this.redraw(Math.floor(Math.random() * 0xFFFFFF));
    }

    public setDraggable(isDraggable: boolean) {
        if (isDraggable) {
            this.view.eventMode = "static";
            this.view.cursor = "pointer";
            this.view.on("pointerdown", this.onDragStart);
        } else {
            this.view.eventMode = "auto";
            this.view.cursor = "default";
            this.view.off("pointerdown", this.onDragStart);
            this.onDragEnd();
        }
    }

    private onDragStart(event: FederatedPointerEvent) {
        event.stopPropagation();

        const parent = this.view.parent;
        const parentPos = parent.toLocal(event.global);

        this.isDragging = true;
        this.dragOffset.x = parentPos.x - this.view.x;
        this.dragOffset.y = parentPos.y - this.view.y;

        parent.eventMode = "static";
        parent.on("pointermove", this.onDragMove);
        parent.on("pointerup", this.onDragEnd);
    }

    private onDragMove(event: FederatedPointerEvent) {
        if (!this.isDragging || !this.config) {
            return;
        }

        const parent = this.view.parent;
        const parentPos = parent.toLocal(event.global);
        const newX = parentPos.x - this.dragOffset.x;
        const newY = parentPos.y - this.dragOffset.y;

        this.view.x = newX;
        this.view.y = newY;
        this.config.x = newX;
        this.config.y = newY;
    }

    private onDragEnd() {
        if (!this.isDragging) {
            return;
        }

        const parent = this.view.parent;
        this.isDragging = false;
        parent.eventMode = "auto";
        parent.off("pointermove", this.onDragMove);
        parent.off("pointerup", this.onDragEnd);
    }

    public reset() {
        this.graphics.clear();
        this.graphics.alpha = 1;
        this.view.position.set(0, 0);
        this.view.pivot.set(0, 0);
        this.view.scale.set(1, 1);
        this.view.rotation = 0;
        this.setDraggable(false);
    }

    private bindListeners() {
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragMove = this.onDragMove.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    }
}