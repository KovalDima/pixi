import { Graphics, type Container } from "pixi.js";
import type {TCheckerboardMaskOptions, TCircleMaskOptions, TStarMaskOptions} from "./mask-types";

export class MaskService {
    public createStarMask(options: TStarMaskOptions) {
        const {points, outerRadius, innerRadius, x, y} = options;
        const mask = new Graphics();
        mask.beginFill(0xFFFFFF);

        const path = [];
        const angleStep = (Math.PI * 2) / (points * 2);

        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = i * angleStep - (Math.PI / 2);
            path.push(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
        }

        mask.drawPolygon(path);
        mask.endFill();
        return mask;
    }

    public createCheckerboardMask(options: TCheckerboardMaskOptions) {
        const {width, height, offsetY, offsetX, numSquaresY, numSquaresX} = options;
        const mask = new Graphics();
        mask.beginFill(0xFFFFFF);

        const squareWidth = width / numSquaresX;
        const squareHeight = height / numSquaresY;

        for (let y = 0; y < numSquaresY; y++) {
            for (let x = 0; x < numSquaresX; x++) {
                if ((x + y) % 2 === 0) {
                    mask.drawRect(
                        offsetX + x * squareWidth,
                        offsetY + y * squareHeight,
                        squareWidth,
                        squareHeight
                    );
                }
            }
        }
        mask.endFill();
        return mask;
    }

    public createCircleMask(options: TCircleMaskOptions) {
        const {x, y, radius} = options;
        const mask = new Graphics();
        mask.beginFill(0xFFFFFF);
        mask.drawCircle(x, y, radius);
        mask.endFill();
        return mask;
    }

    public applyMask(target: Container, mask: Graphics) {
        target.mask = mask;
        target.addChild(mask);
    }
}