export type TCoordsOptions = {
    x: number,
    y: number
}

export type TSizeOptions = {
    width: number,
    height: number
}

export type TStarMaskOptions = {
    points: number,
    outerRadius: number,
    innerRadius: number
} & TCoordsOptions;

export type TCheckerboardMaskOptions = {
    numSquaresX: number,
    numSquaresY: number,
    offsetX: number,
    offsetY: number
} & TSizeOptions;

export type TCircleMaskOptions = {
    radius: number
} & TCoordsOptions