import { createElement } from "lwc";
import App from "x/app";

globalThis.lwcRuntimeFlags.ENABLE_EXPERIMENTAL_SIGNALS = true;

const elm = createElement("x-app", { is: App });
document.body.appendChild(elm);
