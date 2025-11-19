import { Howl } from "howler";
import soundsManifest from "res/sounds/sounds_manifest.json";

export type SoundName = keyof typeof soundsManifest.sounds;
export type TFadeConfig = {
    from?: number,
    to: number,
    duration: number
}

export class SoundService {
    private soundMap: Map<SoundName, Howl> = new Map();

    public loadSounds() {
        const basePath = soundsManifest.basePath;

        return Promise.all(Object.keys(soundsManifest.sounds).map((soundName) => {
            return new Promise<void>((resolve, reject) => {
                const sound = new Howl({
                    src: [basePath + soundsManifest.sounds[soundName as SoundName]],
                    onload: () => {
                        this.soundMap.set(soundName as SoundName, sound);
                        resolve();
                    },
                    onloaderror: () => {
                        reject(`Failed to load sound: ${soundName}`);
                    }
                });
            });
        }));
    }

    public play(name: SoundName) {
        const sound = this.getSound(name);
        sound.stop();
        return sound.play();
    }

    public stop(name: SoundName) {
        this.getSound(name).stop();
    }

    public setVolume(name: SoundName, volume: number) {
        this.getSound(name).volume(volume);
    }

    public getVolume(name: SoundName) {
        return this.getSound(name).volume();
    }

    public setRate(name: SoundName, rate: number) {
        this.getSound(name).rate(rate);
    }

    public loop(name: SoundName, shouldLoop: boolean) {
        this.getSound(name).loop(shouldLoop);
    }

    public mute(name: SoundName, shouldMute: boolean) {
        this.getSound(name).mute(shouldMute);
    }

    public fadeOut(name: SoundName, duration: number) {
        this.fade(name, {to: 0, duration: duration});
    }

    public fadeIn(name: SoundName, duration: number) {
        this.fade(name, {to: 1.0, duration: duration});
    }

    public fade(name: SoundName, config: TFadeConfig) {
        const {from = this.getVolume(name), to, duration} = config;
        this.getSound(name).fade(from, to, duration);
    }

    public getHowl(name: SoundName) {
        return this.soundMap.get(name);
    }

    private getSound(name: SoundName) {
        const sound = this.soundMap.get(name);
        if (!sound) {
            throw new Error(`SoundService: Sound not found or not loaded: ${name}`);
        }
        return sound;
    }
}