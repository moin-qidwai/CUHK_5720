Object.assign(global, { WebSocket: require('ws') });

const Y = require('yjs');
const pkg = require('y-websocket');
const { WebsocketProvider } = pkg;

const alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' '];

console.log("Starting an automated client with arguments: "+process.argv);

if (!!(process.argv) && process.argv.length > 0 && parseInt(process.argv[2]) >= 0) {
  const id = parseInt(process.argv[2]);

  const ydoc = new Y.Doc();

  const websocketProvider = new WebsocketProvider(
    'ws://localhost:1234', 'crdt-testing', ydoc
  );

  const awareness = websocketProvider.awareness;
  awareness.setLocalStateField('user', 'user_'+id);

  const yText = ydoc.getText('test');

  // observe changes 
  // yText.observe(event => {
    // print updates when the data changes
    // console.log('new text: ' + yText.toString())
  // });
  
  // add sample text to the string
  var index = 1;
  setInterval(() => {
    yText.delete(index);
    index++;
  }, 1000);
}

