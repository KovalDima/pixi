import {GUI, GUIController} from "dat.gui";

export default class DevToolUtils {
    public static setupObj(
        obj:any,
        folderName:string,
        rootFolder:GUI,
        ignore?:string[],
        onAnyUpdate?:() => void
    ):GUI {
        const ignoreList = ignore ?? [];
        const folder = folderName ? rootFolder.addFolder(folderName) : rootFolder;
        Object.getOwnPropertyNames(obj)
            .filter(methodName => ignoreList.indexOf(methodName) == -1)
            .filter(methodName => methodName[0] != "_")
            .forEach(methodName => {
                if (!obj[`_${methodName}Items`] && typeof obj[methodName] == "object") {
                    this.setupObj(obj[methodName], methodName, folder, ignore, onAnyUpdate);
                    return;
                }
                const min = obj[`_${methodName}Min`];
                const max = obj[`_${methodName}Max`];
                const step = obj[`_${methodName}Step`];
                const items = obj[`_${methodName}Items`];
                const status = obj[`_${methodName}Status`];
                const update = obj[`_${methodName}Update`];
                let controller:GUIController;
                if (min != undefined && max != undefined && step != undefined) {
                    controller = folder.add(obj, methodName, min, max, step);
                } else if (items) {
                    controller = folder.add(obj, methodName, items);
                } else if (status != undefined) {
                    controller = folder.add(obj, methodName, status);
                } else {
                    controller = folder.add(obj, methodName);
                }
                if (update) {
                    controller.onChange(update);
                }
                if (onAnyUpdate) {
                    controller.onChange(onAnyUpdate);
                }
            });
        return folder;
    }
}
