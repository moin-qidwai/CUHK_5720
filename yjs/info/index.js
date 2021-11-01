Object.assign(global, { WebSocket: require('ws') });

const Y = require('yjs');
const pkg = require('y-websocket');
const fs = require('fs');
var os = require('os');
const { WebsocketProvider } = pkg;

const ydoc = new Y.Doc();

const information = [];
var current_text = "";
var number_of_users = 0;

var start = process.hrtime();

const websocketProvider = new WebsocketProvider(
  'ws://localhost:1234', 'crdt-testing', ydoc
)

const awareness = websocketProvider.awareness;

const yText = ydoc.getText('test')

awareness.on('change', _ => {
  // Whenever somebody updates their awareness information,
  // we log all awareness information from all users.
  number_of_users = Array.from(awareness.getStates().values()).length;
  console.log(number_of_users);

  information.push({
      elapsed: elapsed_time(),
      number_of_clients: number_of_users,
      text: current_text,
      free_memory: os.freemem(),
      total_memory: os.totalmem() - os.freemem(),
      idle_cpu: os.cpus().map(cpu => cpu.times.idle).reduce((prev, curr) => prev+curr, 0),
      used_cpu: os.cpus().map(cpu => (cpu.times.sys + cpu.times.user + cpu.times.idle + cpu.times.irq) -cpu.times.idle).reduce((prev, curr) => prev+curr, 0)
  });

  fs.writeFile('information.json', JSON.stringify(information), (err) => {
    if (err) return console.log(err);
    console.log('Done');
  });
});

// observe changes 
yText.observe(_ => {
  // print updates when the data changes
  // console.log('new text: ' + yText.toString())
  current_text = yText.toString();
  information.push({
    elapsed: elapsed_time(),
    number_of_clients: number_of_users,
    text: current_text,
    free_memory: os.freemem(),
    total_memory: os.totalmem() - os.freemem(),
    idle_cpu: os.cpus().map(cpu => cpu.times.idle).reduce((prev, curr) => prev+curr, 0),
    used_cpu: os.cpus().map(cpu => (cpu.times.sys + cpu.times.user + cpu.times.idle + cpu.times.irq) -cpu.times.idle).reduce((prev, curr) => prev+curr, 0)
  });
});

function elapsed_time() {
  // var precision = 5;
  const ctm = process.hrtime(start);
  const tm = ctm[0] + (ctm[1] / 1000000000);
  return tm;
}

