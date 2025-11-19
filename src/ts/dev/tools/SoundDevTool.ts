import {GUI} from "dat.gui";
import DevToolUtils from "../utils/DevToolUtils";
import type {ILogger} from "../../../common/types/ILogger";
import soundsManifest from "res/sounds/sounds_manifest.json";
import { type SoundService, type SoundName } from "../../services/SoundService";

// noinspection JSUnusedGlobalSymbols
export class SoundDevTool {

    constructor(gui: GUI, private soundService: SoundService, private logger: ILogger) {
        const soundsGui = gui.addFolder("sounds");
        const soundNames = Object.keys(soundsManifest.sounds) as SoundName[];
        soundNames.forEach(soundName => {
            DevToolUtils.setupObj(this.getSoundsActions(soundName), "", soundsGui);
        });
    }

    private getSoundsActions(soundName: SoundName) {
        const soundAction = {
            rate: 1,
            _rateMin: 0.1,
            _rateMax: 5,
            _rateStep: 0.001,
            _rateUpdate: () => {
                this.soundService.setRate(soundName, soundAction.rate);
                this.logger.log(`rateUpdate${soundAction.rate}`);
            },
            volume: 1,
            _volumeMin: 0,
            _volumeMax: 1,
            _volumeStep: 0.001,
            _volumeUpdate: () => {
                this.soundService.setVolume(soundName, soundAction.volume);
                this.logger.log(`volumeUpdate:${soundAction.volume}`);
            },
            play: () => {
                const id = this.soundService.play(soundName);
                if (id) {
                    this.soundService.setRate(soundName, soundAction.rate);
                    this.soundService.setVolume(soundName, soundAction.volume);
                    this.soundService.loop(soundName, soundAction.loop);
                    this.soundService.mute(soundName, soundAction.mute);
                }
                this.logger.log(`Playing ${soundName}`);
            },
            rateUp: () => {
                soundAction.rate += 0.1;
                this.soundService.setRate(soundName, soundAction.rate);
                this.logger.log(`rateUp:${soundAction.rate}`);
            },
            rateDown: () => {
                soundAction.rate -= 0.1;
                this.soundService.setRate(soundName, soundAction.rate);
                this.logger.log(`rateUp:${soundAction.rate}`);
            },
            loop: false,
            _loopUpdate: () => {
                this.soundService.loop(soundName, soundAction.loop);
                this.logger.log(`Loop ${soundName}: ${soundAction.loop}`);
            },
            fadeOut: () => {
                const duration = 1000;
                this.soundService.fadeOut(soundName, duration);
                this.logger.log(`Fading out ${soundName}`);
            },
            fadeIn: () => {
                const duration = 1500;
                this.soundService.fadeIn(soundName, duration);
                this.logger.log(`Fading in ${soundName}`);
            },
            stop: () => {
                this.soundService.stop(soundName);
                this.logger.log(`Stopped ${soundName}`);
            },
            mute: false,
            _muteUpdate: () => {
                this.soundService.mute(soundName, soundAction.mute);
                this.logger.log(`Mute ${soundName}: ${soundAction.mute}`);
            },
        };
        return {
            [`${soundName}`]: soundAction,
        };
    }
}
