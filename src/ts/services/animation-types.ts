export type TCallbackOptions = {
    onStart?: () => void,
    onComplete?: () => void,
    onRepeat?: () => void
}

export type TBaseAnimationOptions = {
    duration?: number,
    delay?: number
} & TCallbackOptions;

export type TEase = {
    ease?: string
}

export type TPulsateOptions = TBaseAnimationOptions & {
    maxScale?: number,
    minAlpha?: number
}

export type TAppearOptions = TBaseAnimationOptions & TEase & {
    yOffset?: number
}

export type TSwayOptions = TBaseAnimationOptions & TEase & {
    rotationAmount?: number
}