export type TBaseFilterAnimateOptions = {
    duration?: number,
    delay?: number
}

export type TAnimateBlurOptions = {
    to: number
} & TBaseFilterAnimateOptions;