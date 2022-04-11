var WebSocket = require('ws');
var sharedb = require('sharedb/lib/client');
var richText = require('rich-text');
sharedb.types.register(richText.type);

// Open WebSocket connection to ShareDB server
var collection = 'testing';
var topic = 'richtext';

const alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

console.log("Starting an automated client with arguments: "+process.argv);

if (!!(process.argv) && process.argv.length > 0 && parseInt(process.argv[2]) >= 0) {
    var serverHost = 'localhost';
    if (process.argv.length > 3) {
        serverHost = process.argv[3];
    }
    const insertionInterval = parseInt(process.argv[2]);
    var socket = new WebSocket('ws://'+serverHost+':8080');
    var connection = new sharedb.Connection(socket);

    var doc = connection.get(collection, topic);
    // doc.preventCompose = true;

    doc.subscribe(function(error) {
        if (error) return console.error(error);

        var presence = connection.getPresence(collection, topic);
        const localPresence = presence.create();
        // The presence value can take any shape
        localPresence.submit({join: 'user'});
        var index = 0;
        setInterval(() => {
            const value = alphabets[index % 26];
            doc.submitOp([{insert: value}]);
            index++;
        }, insertionInterval);
    });
}
