var WebSocket = require('ws');
var sharedb = require('sharedb/lib/client');
var richText = require('rich-text');
const fs = require('fs');
var os = require('os');
sharedb.types.register(richText.type);

// Open WebSocket connection to ShareDB server
var collection = 'testing';
var id = 'richtext';

var serverHost = 'localhost';
if (process.argv.length > 4) {
    serverHost = process.argv[4];
}
var socket = new WebSocket('ws://'+serverHost+':8080');
var connection = new sharedb.Connection(socket);
var doc = connection.get(collection, id);


const information = [];
var number_of_users = 0;

var start = process.hrtime();

var first_connected = false;
var presence = null;
var localPresence = null;
var unmergedOperations = [];
var mergedOperations = [];
var period = 1;

doc.subscribe(function(error) {
    if (error) return console.error(error);

    presence = connection.getPresence(collection, id);
    presence.subscribe(function(error) {
        if (error) throw error;

        localPresence = presence.create('coordinator');

        presence.on('receive', function(_, data) {
            if (data === null) return;

            if (data.code === 'join') {
                number_of_users++;
                if (!first_connected) {
                    first_connected = true;

                    setTimeout(pauseAllClients, 60000);
                }
            } else if (data.code === 'insert') {
                unmergedOperations = unmergedOperations.concat(data.operations);
            }
        });
    });
});

function elapsed_time() {
    // var precision = 5;
    const ctm = process.hrtime(start);
    const tm = ctm[0] + (ctm[1] / 1000000000);
    return tm;
}

function pauseAllClients() {
    console.log('Stopping period: '+period);
    localPresence.submit({ code: 'pause' });
    setTimeout(() => {
        doc.fetch(function(error) {
            doc.submitOp([{ delete: unmergedOperations.length }]);
            doc.fetch(function(error) {
                unmergedOperations.sort((a, b) => (a.opTime - a.timeAtSubscribe) - (b.opTime - b.timeAtSubscribe));
                unmergedOperations.forEach(operation => doc.submitOp([operation.op]));
                mergedOperations = mergedOperations.concat(unmergedOperations);
                unmergedOperations = [];
                if (parseInt(process.argv[3]) === period) {
                    checkAndUpdateAccuracy();
                } else {
                    resumeAllClients();
                }
            })
        });
    }, 5000);
}

function resumeAllClients() {
    period++;
    console.log('Starting period: '+period);
    localPresence.submit({ code: 'resume' });
    setTimeout(pauseAllClients, 60000);
}

function checkAndUpdateAccuracy() {
    const text = ReverseString(doc.data.ops[0].insert);
        
    fs.writeFile('accuracy_text.txt', text, (err) => {
        if (err) return console.log(err);
        const accuracy = calculateAccuracy(text);
        console.log('Length of text was: '+text.length);
        console.log('Accuracy was: '+accuracy+'%');
        fs.writeFile('accuracy.txt', accuracy+'', (err) => {
            if (err) return console.log(err);
            console.log('File updated');
            process.exit(0);
        });
    });
}

function calculateAccuracy(text) {
    var error = 0;
    const alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    // console.log(text);
    const n_clients = parseInt(process.argv[2]);

    for (var i = 0; i < text.length; i++) {
        const t = alphabets[Math.ceil((i%(n_clients*26)+1)/n_clients)-1];
        if (t !== text[i]) {
            error++;
        }
    }
    
    const result = (1 - error/text.length)*100;
    return result;
}

function getSnapshot() {
    return {
            elapsed: elapsed_time(),
            number_of_clients: number_of_users,
            text: doc.data.ops[0].insert,
            free_memory: os.freemem(),
            total_memory: os.totalmem() - os.freemem(),
            idle_cpu: os.cpus().map(cpu => cpu.times.idle).reduce((prev, curr) => prev+curr, 0),
            used_cpu: os.cpus().map(cpu => (cpu.times.sys + cpu.times.user + cpu.times.idle + cpu.times.irq) - cpu.times.idle).reduce((prev, curr) => prev+curr, 0)
        }
}

function ReverseString(str) {
    return str.split('').reverse().join('')
}