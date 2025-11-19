declare const __DEV__: boolean;

declare module "res/sounds/sounds_manifest.json" {
    type SoundManifest = typeof import("../resources/sounds/sounds_manifest.json");
    const value: SoundManifest;
    export default value;
}