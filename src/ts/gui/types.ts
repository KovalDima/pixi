import * as dat from "dat.gui";

export interface IGUIControl {
    create(folder: dat.GUI): void;
    destroy(): void;
    update?(): void;
}

export type TLabel = {
    label: string
}

export type TBaseControlSettings<T = void> = TLabel & {
    property: string,
    onChange?: (value: T) => void
}

export type TSliderControlSettings = TBaseControlSettings & {
    min: number,
    max: number,
    step: number
}

export type TButtonControlSettings = TLabel & {
    methodName: string
}

export type TDropdownControlSettings = TBaseControlSettings & {
    options: [] | {}
}