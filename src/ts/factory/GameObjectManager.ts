import {type IGameObjectFactory} from "./IGameObjectFactory";
import type {TGameObject, TGameObjectMap, TGameObjectConfigMap, TStrategyMap} from "./types";

export class GameObjectManager {
    private strategies: Partial<TStrategyMap> = {};

    public register<K extends TGameObject> (
        type: K,
        strategy: IGameObjectFactory<TGameObjectMap[K], TGameObjectConfigMap[K]>
    ) {
        this.strategies[type] = strategy as TStrategyMap[K];
    }

    public create<K extends TGameObject>(
        type: K,
        config: TGameObjectConfigMap[K]
    ): TGameObjectMap[K] {
        const strategy = this.strategies[type];
        if (!strategy) {
            throw new Error(`No factory strategy registered for type: ${type}`);
        }
        return strategy.create(config);
    }

    public put<K extends TGameObject>(
        type: K,
        obj: TGameObjectMap[K]
    ) {
        const strategy = this.strategies[type];
        if (!strategy) {
            console.error(`No factory strategy registered for type: ${type}. Object won't be pooled.`);
            return;
        }
        strategy.put(obj);
    }
}