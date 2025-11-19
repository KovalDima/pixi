import type {ILogger} from "../../../common/types/ILogger";

class FunnyLogger implements ILogger {
    public log(message: string) {
        console.log(message);
        const text = document.createElement('div');
        text.textContent = message;
        document.body.appendChild(text);
        Object.assign(text.style, {
            left: "1%",
            top: "99%",
            transform: "translate(0%, -100%)",
            position: "absolute",
            color: "white",
            fontSize: "2em",
            opacity: 1,
            transition: "transform 1s ease-out, opacity 1s ease-out",
        });
        setTimeout(() => {
            Object.assign(text.style, {
                transform: "translateY(-100px)",
                opacity: 0,
            })
        }, 10);
        setTimeout(() => text.remove(), 1000);
    }
}

export default new FunnyLogger();
