import {type Container} from "pixi.js";
import {type IResetable} from "../pool/IResetable";

export abstract class GameObject<TConfig> implements IResetable {
    public abstract readonly view: Container;

    public abstract init(config: TConfig): void;

    public redraw(): void {};

    public abstract reset(): void;

    public update(delta: number): void {};
}