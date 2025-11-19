import { gsap } from "gsap";
import type { DisplayObject } from "pixi.js";
import type {
    TBaseAnimationOptions, TSwayOptions,
    TPulsateOptions,
    TAppearOptions,
} from "./animation-types";

export class AnimationService {
    public pulsate(target: DisplayObject, options: TPulsateOptions = {}) {
        const { duration = 1.5, maxScale = 1.3, minAlpha = 0.7, delay = 2.0, onRepeat } = options;

        const timeline = gsap.timeline({
            duration,
            delay,
            ease: "power2.inOut",
            yoyo: false,
            repeat: -1,
            onRepeat
        });

        timeline
            .to(target.scale, {
                x: maxScale,
                y: maxScale
            }, 0)
            .to(target, {
                alpha: minAlpha
            }, 0);
    }

    public appearFromTop(target: DisplayObject, options: TAppearOptions = {}) {
        const { duration = 1.5, delay = 0.5, ease = "bounce.out", yOffset = 200 } = options;

        gsap.from(target, {
            y: target.y - yOffset,
            alpha: 0,
            duration,
            delay,
            ease
        });
    }

    public sway(target: DisplayObject, options: TSwayOptions = {}) {
        const { duration = 3.0, rotationAmount = 0.2, ease = "sine.inOut", delay = 0 } = options;

        gsap.fromTo(target,
            {
                rotation: -rotationAmount
            },
            {
                rotation: rotationAmount,
                duration,
                ease,
                yoyo: true,
                repeat: -1,
                delay
            }
        );
    }

    public fadeOut(target: DisplayObject, options: TBaseAnimationOptions = {}) {
        const { duration = 2.0, delay = 0 } = options;

        gsap.to(target, {
            alpha: 0,
            duration,
            delay,
            ease: "power1.out"
        });
    }
}