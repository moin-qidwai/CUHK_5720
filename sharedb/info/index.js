var WebSocket = require('ws');
var sharedb = require('sharedb/lib/client');
var richText = require('rich-text');
const fs = require('fs');
var os = require('os');
sharedb.types.register(richText.type);

// Open WebSocket connection to ShareDB server
var collection = 'testing';
var id = 'richtext';

var socket = new WebSocket('ws://localhost:8080');
var connection = new sharedb.Connection(socket);
var doc = connection.get(collection, id);

const information = [];
var number_of_users = 0;

var start = process.hrtime();

var first_connected = false;

doc.subscribe(function(error) {
    if (error) return console.error(error);

    // information.push({
    //     elapsed: elapsed_time(),
    //     number_of_clients: number_of_users,
    //     text:  doc.data.ops[0].insert,
    //     free_memory: os.freemem(),
    //     total_memory: os.totalmem() - os.freemem(),
    //     idle_cpu: os.cpus().map(cpu => cpu.times.idle).reduce((prev, curr) => prev+curr, 0),
    //     used_cpu: os.cpus().map(cpu => (cpu.times.sys + cpu.times.user + cpu.times.idle + cpu.times.irq) -cpu.times.idle).reduce((prev, curr) => prev+curr, 0)
    // });
    
    var presence = connection.getPresence(collection, id);
    presence.subscribe(function(error) {
        if (error) throw error;
    });
    
    presence.on('receive', function(_, user) {
        number_of_users++;
        if (!first_connected) {
            first_connected = true;

            setInterval(function() {
                // information.push({
                //     elapsed: elapsed_time(),
                //     number_of_clients: number_of_users,
                //     text: doc.data.ops[0].insert,
                //     free_memory: os.freemem(),
                //     total_memory: os.totalmem() - os.freemem(),
                //     idle_cpu: os.cpus().map(cpu => cpu.times.idle).reduce((prev, curr) => prev+curr, 0),
                //     used_cpu: os.cpus().map(cpu => (cpu.times.sys + cpu.times.user + cpu.times.idle + cpu.times.irq) - cpu.times.idle).reduce((prev, curr) => prev+curr, 0)
                // });

                if (doc.data.ops[0].insert.length > 1000) {
                    fs.writeFile('accuracy.txt', calculateAccuracy(doc.data.ops[0].insert)+'', (err) => {
                        if (err) return console.log(err);
                        console.log('File updated');
                        process.exit(0);
                    });
                }
            }, 10000);
        }
    });
});

function elapsed_time() {
    // var precision = 5;
    const ctm = process.hrtime(start);
    const tm = ctm[0] + (ctm[1] / 1000000000);
    return tm;
}

function calculateAccuracy(str) {
    var error = 0;
    const alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    const text = ReverseString(str).substr(0, 1000);
    console.log(text);
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

function ReverseString(str) {
    return str.split('').reverse().join('')
}