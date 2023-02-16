import "dotenv/config";
import ExpressServer from "./src/Server";

export const nodeServer = new ExpressServer();
try {
    nodeServer.listen();
} catch (error) {
    console.error(error);
    nodeServer.listen();
}
