import {PixiApp} from "./App";

const appContainer = document.getElementById("app") as HTMLElement;

(async () => {
    const app = await PixiApp.create(appContainer);
    window.addEventListener("beforeunload", () => {
        app.destroy();
    });
})();