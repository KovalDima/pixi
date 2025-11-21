export type TPosition = {
    x: number,
    y: number
}

export type TSpriteUrl = {
    imgUrl: string
}

export type TRectangleConfig = {
    width: number,
    height: number,
    color: number,
    opacity: number,
    centered?: boolean
} & TPosition;

export type TSpriteGridConfig = {
    gridAmount: number,
    columns: number,
    spacing: number
} & TPosition & TSpriteUrl;

export type TSpriteConfig = {
    scale?: number | TPosition,
    anchor?: number | TPosition
} & TPosition & TSpriteUrl;

export type TSpineConfig = {
    animation?: string,
    speed?: number,
    scale?: number,
} & TPosition & TSpriteUrl;