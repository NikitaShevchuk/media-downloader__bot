import "dotenv/config";
import ExpressServer from "./src/Server";

export const nodeServer = new ExpressServer();
try {
    nodeServer.listen();
} catch (e) {
    console.error(e);
    nodeServer.listen();
}
