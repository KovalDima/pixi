import {type DisplayObject, type Filter, BlurFilter, ColorMatrixFilter} from "pixi.js";
import {gsap} from "gsap";
import type {TAnimateBlurOptions, TBaseFilterAnimateOptions} from "./filter-types";

export class FilterService {
    public blurFilter: BlurFilter | null = null;
    public colorFilter: ColorMatrixFilter | null = null;
    private blurAnimation: gsap.core.Tween | null = null;

    public applyFilters(target: DisplayObject, filters: Filter[]) {
        target.filters = filters;
    }

    public createBlurFilter(strength = 0, quality = 5) {
        this.blurFilter = new BlurFilter();
        this.blurFilter.blur = strength;
        this.blurFilter.quality = quality;
        return this.blurFilter;
    }

    public createColorMatrixFilter() {
        this.colorFilter = new ColorMatrixFilter();
        return this.colorFilter;
    }

    public animateBlur(filter: BlurFilter, options: TAnimateBlurOptions) {
        const {to, duration = 1, delay = 0} = options;
        this.blurAnimation = gsap.to(filter, {
            blur: to,
            duration,
            delay,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1
        });
    }

    public animateHueRotation(filter: ColorMatrixFilter, options: TBaseFilterAnimateOptions) {
        const {duration = 5, delay = 0} = options;
        const animationProps = { rotation: 0 };

        gsap.to(animationProps, {
            rotation: 360,
            duration: duration,
            delay: delay,
            ease: "none",
            repeat: -1,
            onUpdate: () => {
                filter.hue(animationProps.rotation, false);
            }
        });
    }

    public stopBlurAnimation() {
        if (this.blurAnimation) {
            this.blurAnimation.kill();
            this.blurAnimation = null;
        }
    }
}