import type {TRectangleConfig, TSpriteGridConfig, TSpriteConfig} from "../gameobjects/types";
import {type RectangleObject } from "../gameobjects/RectangleObject";
import {type SpriteGridObject } from "../gameobjects/SpriteGridObject";
import {type IGameObjectFactory} from "./IGameObjectFactory";
import {type SpriteObject} from "../gameobjects/SpriteObject";

export type TGameObjectMap = {
    rectangle: RectangleObject,
    rectangleChess: RectangleObject,
    spriteGrid: SpriteGridObject,
    sprite: SpriteObject
}

export type TGameObjectConfigMap = {
    rectangle: TRectangleConfig,
    rectangleChess: TRectangleConfig,
    spriteGrid: TSpriteGridConfig
    sprite: TSpriteConfig
}

export type TGameObject = keyof TGameObjectMap;

export type TStrategyMap = {
    [K in TGameObject]: IGameObjectFactory<TGameObjectMap[K], TGameObjectConfigMap[K]>
}