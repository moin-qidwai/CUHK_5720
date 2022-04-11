import { SharedString } from "fluid-framework";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";

const schema = {
    initialObjects: { sharedString: SharedString }
}

const client = new TinyliciousClient();

async function createContainer() {
    const { container } = await client.createContainer(schema);
    const id = await container.attach();
    console.log("Initializing Observer----------", id);
    return id;
}

async function start() {
    await createContainer();
}

start().catch(console.error());