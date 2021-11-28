info = ScenarioData

var unique = [info[0]];
var last_value = Math.floor(info[0].elapsed)
var i = 0;
info.forEach((value) => {
    if (Math.floor(value.elapsed) !== last_value && (i % 2) === 0) {
        unique.push(value);
        last_value = Math.floor(value.elapsed);
    }
    i++;
});

free_memory = unique.map(i => Math.floor(i.free_memory/1000000))
used_memory = unique.map(i => Math.floor((i.total_memory - i.free_memory)/1000000)).map(i => i < 0 ? 0 : i)
number_of_users = unique.map(i => i.number_of_clients)
document_size = unique.map(i => i.text)
idle_cpus = unique.map(i => i.idle_cpu)
elapsed = unique.map(i => Math.floor(i.elapsed))

bb.generate({
    bindto: "#chart_one",
    size: {
        height: 450,
        width: 900
    },
    axis: {
        x: {
            type: 'category',
            label: "Elapsed Time (s)"
        },
        y: {
            label: 'Memory (MBs)'
        }
    },
    data: {
        columns: [
            ["x", ...elapsed],
            ["Available_Memory", ...free_memory],
            ["Used_Memory", ...used_memory],
        ],
        types: {
            Available_Memory: "line",
            Used_Memory: "line"
        },
        colors: {
            Available_Memory: "green",
            Used_Memory: "red"
        },
        x: "x"
    }
});

bb.generate({
    bindto: "#chart_two",
    size: {
        height: 450,
        width: 900
    },
    axis: {
        x: {
            type: 'category',
            label: "Elapsed Time (s)"
        },
        y: {
            label: 'Number Of Users'
        },
        y2: {
            show: true,
            label: 'Memory (MBs)'
        }
    },
    data: {
        columns: [
            ["x", ...elapsed],
            ["Number_Of_Clients", ...number_of_users],
            ["Available_Memory", ...free_memory]
        ],
        types: {
            Number_Of_Clients: "line",
            Available_Memory: "line"
        },
        colors: {
            Number_Of_Clients: "blue",
            Available_Memory: "green",
        },
        x: "x",
        axes: {
            Available_Memory: "y2"
        }
    }
});

bb.generate({
    bindto: "#chart_three",
    size: {
        height: 450,
        width: 900
    },
    axis: {
        x: {
            type: 'category',
            label: "Elapsed Time (s)"
        },
        y: {
            label: 'Document Size (Characters)'
        },
        y2: {
            show: true,
            label: 'CPU Available (Cycles/s)'
        }
    },
    data: {
        columns: [
            ["x", ...elapsed],
            ["Document_Size", ...document_size],
            ["CPU_Idle", ...idle_cpus]
        ],
        types: {
            Document_Size: "line",
            CPU_Used: "line"
        },
        colors: {
            Document_Size: "blue",
            CPU_Used: "orange"
        },
        x: "x",
        axes: {
            CPU_Used: "y2"
        }
    }
});
