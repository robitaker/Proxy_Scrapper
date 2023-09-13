
import { RequestsController } from "./requests.js";
import { options } from "../options.js";


export class MethodsController {



    callMethod(methodName, args) {
        if (typeof this[methodName] === 'function') {
            return this[methodName](args);
        } else {
            console.log(`The ${methodName} function does not exist in the "MethodsController" class`);
            return false;
        }
    }

    async checkInit(args) {
        let permiteds = ["getProxies"];
        if (permiteds.indexOf(args[0]) != -1) {
            this.callMethod(args[0], args);
        } else {
            console.log("Method not found, see README file");
        }
    }

    getProxies(args) {
        try {

            let output = options.output_default;
            let timeout = options.timeout;

            for (let i = 0; i < args.length; i++) {
                const arg = args[i];

                if (arg === "-o" || arg === "--output") {
                    const nextArg = args[i + 1];
                    if (nextArg) {
                        output = nextArg;
                        i++;
                    } else {
                        throw new Error(`No argument found after ${arg}`);
                    }
                } else if (arg === "-t" || arg === "--timeout") {
                    const nextArg = args[i + 1];
                    if (nextArg && /^[0-9]+$/.test(nextArg)) {
                        timeout = nextArg;
                        i++;
                    } else {
                        throw new Error(`Values for "${arg}" can only contain numbers.`);
                    }
                }
            }

            new RequestsController().getProxies(output, parseInt(timeout));

        } catch (err) {
            console.log(err);
        }
    }

}