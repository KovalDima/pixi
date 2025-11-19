import {ObjectPool} from "../pool/ObjectPool";
import {type GameObject} from "../gameobjects/GameObject";
import {type IGameObjectFactory} from "./IGameObjectFactory";
import {type IResetable} from "../pool/IResetable";

export class PooledGameObjectFactory<T extends GameObject<Config> & IResetable, Config>
    implements IGameObjectFactory<T, Config> {

    private pool: ObjectPool<T>;

    constructor(factory: () => T, initialSize: number = 0) {
        this.pool = new ObjectPool<T>(factory, initialSize);
    }

    public create(config: Config) {
        const obj = this.pool.get();
        obj.init(config);
        return obj;
    }

    public put(obj: T) {
        this.pool.put(obj);
    }
}