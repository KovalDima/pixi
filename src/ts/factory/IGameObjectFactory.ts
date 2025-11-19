export interface IGameObjectFactory<T, Config> {
    create(config: Config): T,
    put(obj: T): void
}