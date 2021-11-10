info = OneSecNinetyUsersData

var unique = [info[0]];
var last_value = Math.floor(info[0].elapsed)
info.forEach((value) => {
    if (Math.floor(value.elapsed) !== last_value) {
        unique.push(value);
        last_value = Math.floor(value.elapsed);
    }
});

free_memory = unique.map(i => Math.floor(i.free_memory/1000000))
used_memory = unique.map(i => Math.floor((i.total_memory - i.free_memory)/1000000)).map(i => i < 0 ? 0 : i)
number_of_users = unique.map(i => i.number_of_clients)
document_size = unique.map(i => i.text)
used_cpus = unique.map(i => i.used_cpu)
elapsed = unique.map(i => Math.floor(i.elapsed))

// bb.generate({
//     bindto: "#chart",
//     size: {
//         height: 450,
//         width: 900
//     },
//     axis: {
//         x: {
//             type: 'category',
//             label: "Elapsed Time (ms)"
//         },
//         y: {
//             label: 'Memory (MBs)'
//         }
//     },
//     data: {
//         columns: [
//             ["x", ...elapsed],
//             ["Available_Memory", ...free_memory],
//             ["Used_Memory", ...used_memory],
//         ],
//         types: {
//             Available_Memory: "line",
//             Used_Memory: "line"
//         },
//         colors: {
//             Available_Memory: "green",
//             Used_Memory: "red"
//         },
//         x: "x"
//     }
// });

// bb.generate({
//     bindto: "#chart",
//     size: {
//         height: 450,
//         width: 900
//     },
//     axis: {
//         x: {
//             type: 'category',
//             label: "Elapsed Time (ms)"
//         },
//         y: {
//             label: 'CPU Utilized (Cycles/s)'
//         }
//     },
//     data: {
//         columns: [
//             ["x", ...elapsed],
//             ["CPU_Used", ...used_cpus]
//         ],
//         types: {
//             CPU_Used: "line"
//         },
//         colors: {
//             CPU_Used: "blue"
//         },
//         x: "x"
//     }
// });

// bb.generate({
//     bindto: "#chart",
//     size: {
//         height: 450,
//         width: 900
//     },
//     axis: {
//         x: {
//             type: 'category',
//             label: "Elapsed Time (ms)"
//         },
//         y: {
//             label: 'Number Of Users'
//         }
//     },
//     data: {
//         columns: [
//             ["x", ...elapsed],
//             ["Number_Of_Clients", ...number_of_users]
//         ],
//         types: {
//             Number_Of_Clients: "line"
//         },
//         colors: {
//             Number_Of_Clients: "blue"
//         },
//         x: "x"
//     }
// });

bb.generate({
    bindto: "#chart",
    size: {
        height: 450,
        width: 900
    },
    axis: {
        x: {
            type: 'category',
            label: "Elapsed Time (ms)"
        },
        y: {
            label: 'Document Size (Characters)'
        }
    },
    data: {
        columns: [
            ["x", ...elapsed],
            ["Document_Size", ...document_size]
        ],
        types: {
            Document_Size: "line"
        },
        colors: {
            Document_Size: "blue"
        },
        x: "x"
    }
});
