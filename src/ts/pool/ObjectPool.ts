import {type IResetable} from "./IResetable";

type TFactory<T> = () => T;

export class ObjectPool<T extends IResetable> {
    private pool: T[] = [];
    private factory: TFactory<T>;

    constructor(factory: TFactory<T>, initialSize: number = 0) {
        this.factory = factory;
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.factory());
        }
    }

    public get() {
        const obj = this.pool.pop();
        if (obj) {
            return obj;
        }
        return this.factory();
    }

    public put(obj: T): void {
        obj.reset();
        this.pool.push(obj);
    }
}