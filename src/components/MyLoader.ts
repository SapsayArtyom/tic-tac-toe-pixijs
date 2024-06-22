import {
    Loader,
    LoaderResource,
} from 'pixi.js';

export default class MyLoader {
    private static loaders: Loader[] = [];

    public static get loader(): Loader {
        let loader: Loader = null;
        loader = new Loader();
        MyLoader.loaders.push(loader);
        return loader;
    }

    public static async loadAssets(loader: Loader): Promise < object > {
        return new Promise((resolve) => {
            loader.load(() => {
                resolve({});
            });
        });
    }

    public static getResource(name: string): LoaderResource {
        let resource: LoaderResource = null;
        for (let i = 0; i < MyLoader.loaders.length; i++) {
            if (MyLoader.loaders[i].resources[name]) {
                resource = MyLoader.loaders[i].resources[name];
                break;
            }
        }
        return resource;
    }

    public static getLoaders() {
        return this.loaders;
    }
}