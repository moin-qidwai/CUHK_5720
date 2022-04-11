import { SharedString } from "fluid-framework";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";
import fs from 'fs';
import os from 'os';

const schema = {
    initialObjects: { sharedString: SharedString }
}

const client = new TinyliciousClient();

var start = process.hrtime();

async function createContainer() {
    const { container, services } = await client.createContainer(schema);
    const id = await container.attach();
    console.log("Initializing Observer----------", id);
    initiateRecording(container.initialObjects.sharedString, services.audience.audience);
}

function initiateRecording(text, audience) {
    setInterval(function() {
        console.log("Clients connected: "+(audience.getMembers().size-2));
        if (text.getText().length > 100) {
            console.log(text.getText());
            fs.writeFile('accuracy.json', calculateAccuracy(text.getText()), (err) => {
                if (err) return console.log(err);
                console.log('File updated');
                process.exit(0);
            });
        }
    }, 10000);
}

function elapsed_time() {
    // var precision = 5;
    const ctm = process.hrtime(start);
    const tm = ctm[0] + (ctm[1] / 1000000000);
    return tm;
}

async function startProcess() {
    await createContainer();
}

startProcess().catch(console.error());

function calculateAccuracy(str) {
    var error = 0;
    const alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    const text = ReverseString(str).substr(0, 100);
    const n_clients = parseInt(process.argv[2]);

    for (var i = 0; i < text.length; i++) {
        const t = alphabets[Math.ceil((i%(n_clients*26)+1)/n_clients)-1];
        if (t !== text[i]) {
            error++;
        }
    }
    
    const result = (1 - error/text.length)*100;
    return result+'';
}

function ReverseString(str) {
    return str.split('').reverse().join('')
}