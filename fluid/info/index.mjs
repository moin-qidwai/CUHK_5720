import { SharedString } from "fluid-framework";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";
import fs from 'fs';
import os from 'os';

const schema = {
    initialObjects: { sharedString: SharedString }
}

const client = new TinyliciousClient();

const information = [];

var start = process.hrtime();

async function createContainer() {
    const { container, services } = await client.createContainer(schema);
    const id = await container.attach();
    console.log("Initializing Observer----------", id);
    initiateRecording(container.initialObjects.sharedString, services.audience);
}

function initiateRecording(text, audience) {
    information.push({
        elapsed: elapsed_time(),
        number_of_clients: audience.audience.getMembers().size >= 2 ? audience.audience.getMembers().size - 2 : 0,
        text:  text.getText().length,
        free_memory: os.freemem(),
        total_memory: os.totalmem() - os.freemem(),
        idle_cpu: os.cpus().map(cpu => cpu.times.idle).reduce((prev, curr) => prev+curr, 0),
        used_cpu: os.cpus().map(cpu => (cpu.times.sys + cpu.times.user + cpu.times.idle + cpu.times.irq) -cpu.times.idle).reduce((prev, curr) => prev+curr, 0)
    });

    console.log(audience.audience.getMembers());
    
    setInterval(function() {
        information.push({
            elapsed: elapsed_time(),
            number_of_clients: audience.audience.getMembers().size >= 2 ? audience.audience.getMembers().size - 2 : 0,
            text: text.getText().length,
            free_memory: os.freemem(),
            total_memory: os.totalmem() - os.freemem(),
            idle_cpu: os.cpus().map(cpu => cpu.times.idle).reduce((prev, curr) => prev+curr, 0),
            used_cpu: os.cpus().map(cpu => (cpu.times.sys + cpu.times.user + cpu.times.idle + cpu.times.irq) - cpu.times.idle).reduce((prev, curr) => prev+curr, 0)
        });

        fs.writeFile('information.json', JSON.stringify(information), (err) => {
            if (err) return console.log(err);
            console.log('File updated');
        });
    }, 5000);
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