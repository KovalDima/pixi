export class ColorUtils {
    private static readonly RED_FREQ = 0.5;
    private static readonly GREEN_FREQ = 0.3;
    private static readonly BLUE_FREQ = 0.7;
    private static readonly COLOR_AMPLITUDE = 127;
    private static readonly COLOR_OFFSET = 128;

    public static getBleedingColor(time: number): number {
        const red = Math.floor(
            Math.sin(time * this.RED_FREQ) * this.COLOR_AMPLITUDE + this.COLOR_OFFSET
        );
        const green = Math.floor(
            Math.sin(time * this.GREEN_FREQ) * this.COLOR_AMPLITUDE + this.COLOR_OFFSET
        );
        const blue = Math.floor(
            Math.sin(time * this.BLUE_FREQ) * this.COLOR_AMPLITUDE + this.COLOR_OFFSET
        );

        return (red << 16) | (green << 8) | blue;
    }
}
