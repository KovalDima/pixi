import type {TRectangleConfig, TSpriteGridConfig, TSpriteConfig, TSpineConfig} from "../gameobjects/types";
import {type RectangleObject } from "../gameobjects/RectangleObject";
import {type SpriteGridObject } from "../gameobjects/SpriteGridObject";
import {type IGameObjectFactory} from "./IGameObjectFactory";
import {type SpriteObject} from "../gameobjects/SpriteObject";
import { SpineObject } from "../gameobjects/SpineObject";

export type TGameObjectMap = {
    rectangle: RectangleObject,
    rectangleChess: RectangleObject,
    spriteGrid: SpriteGridObject,
    sprite: SpriteObject,
    spine: SpineObject,
}

export type TGameObjectConfigMap = {
    rectangle: TRectangleConfig,
    rectangleChess: TRectangleConfig,
    spriteGrid: TSpriteGridConfig
    sprite: TSpriteConfig,
    spine: TSpineConfig,
}

export type TGameObject = keyof TGameObjectMap;

export type TStrategyMap = {
    [K in TGameObject]: IGameObjectFactory<TGameObjectMap[K], TGameObjectConfigMap[K]>
}