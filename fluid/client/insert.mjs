import { SharedString } from "fluid-framework";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";

var cid = '';
const alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const schema = {
    initialObjects: { sharedString: SharedString }
}

const client = new TinyliciousClient();

async function loadContainer(id) {
    const { container, services } = await client.getContainer(id, schema);
    console.log("Loading Existing Node Client----------", id);
    initiateInsertion(container.initialObjects.sharedString, services.audience.audience);
}

function initiateInsertion(text, audience) {
    var index = 0;
    setInterval(() => {
        if (audience.getMembers().size-2 >= 3) {
            const value = alphabets[index % 26];
            console.log(cid +' inserted '+value);
            text.insertText(index, value);
            index++;
        }
    }, 1000);

    const updateConsole = () => {
        console.log("Value: ", text.getText());
    }
    updateConsole();
}

async function start(id) {
    await loadContainer(id);
}

if (!!(process.argv) && process.argv.length > 0 && parseInt(process.argv[2]) >= 0) {
    cid = Math.random()+'';
    const id = process.argv[2];
    start(id).catch(console.error());
}