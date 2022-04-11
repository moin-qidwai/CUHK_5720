var WebSocket = require('ws');
var sharedb = require('sharedb/lib/client');
var richText = require('rich-text');
sharedb.types.register(richText.type);

// Open WebSocket connection to ShareDB server
var collection = 'testing';
var topic = 'richtext';

const alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

console.log("Starting an automated client with arguments: "+process.argv);
var timeAtSubscribe = null;
var uncommittedOps = [];
var interval = null;
var doc = null;
var presence = null;
var localPresence = null;
var index = 0;
var insertionInterval = 100;

if (!!(process.argv) && process.argv.length > 0 && parseInt(process.argv[2]) >= 0) {
    var serverHost = 'localhost';
    if (process.argv.length > 3) {
        serverHost = process.argv[3];
    }
    insertionInterval = parseInt(process.argv[2]);
    var socket = new WebSocket('ws://'+serverHost+':8080');
    var connection = new sharedb.Connection(socket);

    const id = Math.floor(Math.random()*1000000);

    doc = connection.get(collection, topic);

    doc.subscribe(function(error) {
        if (error) return console.error(error);

        presence = connection.getPresence(collection, id);
        presence.subscribe(function(error) {
            if (error) throw error;
        });

        localPresence = presence.create(id+'');
        // The presence value can take any shape
        localPresence.submit({code: 'join', id });

        presence.on('receive', function(_, data) {
            if (data === null) return;

            if (data.code === 'pause') {
                stopInsertions();
            } else if (data.code === 'resume') {
                startInsertions();
            }
        });

        index = 0;
        timeAtSubscribe = Date.now();
        startInsertions();
    });    
}

function startInsertions() {
    interval = setInterval(() => {
        const value = alphabets[index % 26];
        uncommittedOps.push({ op: {insert: value}, timeAtSubscribe, opTime: Date.now() });
        doc.submitOp([{insert: value}]);
        index++;
    }, insertionInterval);
}

function stopInsertions() {
    clearInterval(interval);
    setTimeout(() => {
        localPresence.submit({ code: 'insert', operations: uncommittedOps });
        uncommittedOps = [];
    }, 1000);
}