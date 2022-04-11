
const fs = require('fs');

if (!!(process.argv) && process.argv.length >= 5) {
    const source_one_path = process.argv[2];
    const source_two_path = process.argv[3];
    const target_name = process.argv[4];

    fs.readFile(source_one_path, 'utf8', (err1, data_one) => {
        if (err1) {
            console.log(`Error reading file from disk: ${err1}`);
        } else {
            fs.readFile(source_two_path, 'utf8', (err2, data_two) => {
                if (err2) {
                    console.log(`Error reading file from disk: ${err2}`);
                } else {
                    // parse JSON string to JSON object
                    const data_A = JSON.parse(data_one);
                    const data_B = JSON.parse(data_two);
                    var result = [];

                    const initialIdleCpuA = data_A[0].idle_cpu;
                    const initialIdleCpuB = data_B[0].idle_cpu;
           
                    
                    for (var i = 0; i < 20; i++) {
                        result.push({
                            time: i+1,
                            clients_fluid: data_A[i].number_of_clients,
                            clients_sharedb: data_B[i].number_of_clients,
                            doc_size_fluid: data_A[i].text,
                            doc_size_sharedb: data_B[i].text,
                            free_memory_fluid: data_A[i].free_memory,
                            free_memory_sharedb: data_B[i].free_memory,
                            idle_cpu_fluid: Math.floor((data_A[i].idle_cpu/initialIdleCpuA)*100),
                            idle_cpu_sharedb: Math.floor((data_B[i].idle_cpu/initialIdleCpuB)*100),
                        });
                    }
                    fs.writeFile(target_name, JSON.stringify(result), (err) => {
                        if (err) return console.log(err);
                        console.log('File updated');
                    });
                }
            });
        }
    });
}