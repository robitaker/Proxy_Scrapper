import { MethodsController } from "./controllers/methods.js";


const args = process.argv.slice(2);

if (args.length > 0) {

    const methodsInstance = new MethodsController();
    await methodsInstance.checkInit(args);
   
} else {
    console.log("No arguments were passed at initialization, see README file");
}