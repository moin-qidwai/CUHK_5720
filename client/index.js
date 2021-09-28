Object.assign(global, { WebSocket: require('ws') });

const Y = require('yjs');
const pkg = require('y-websocket');
const { WebsocketProvider } = pkg;

const ydoc = new Y.Doc()

const websocketProvider = new WebsocketProvider(
  'ws://localhost:1234', 'crdt-testing', ydoc
)

const yText = ydoc.getText('test')

// observe changes 
yText.observe(event => {
  // print updates when the data changes
  console.log('new text: ' + yText.toString())
})

// add sample text to the string
yText.insert(0, 'my name is unknown');
yText.insert(5, 'fine');