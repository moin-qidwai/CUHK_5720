info = ScenarioData

const refined_info = info.map(d => ({ 
    ...d,
    free_memory_sharedb: Math.floor(d.free_memory_sharedb/1000000),
    free_memory_yjs: Math.floor(d.free_memory_yjs/1000000),
    idle_cpu_sharedb: Math.floor(d.idle_cpu_sharedb * 100),
    idle_cpu_yjs: Math.floor(d.idle_cpu_yjs * 100),
}));

console.log(refined_info.map(i => i.time))

bb.generate({
    bindto: "#chart_one",
    size: {
        height: 450,
        width: 900
    },
    axis: {
        x: {
            type: 'category',
            label: "Time (t/5 seconds)"
        },
        y: {
            label: 'Memory (MBs)'
        }
    },
    data: {
        columns: [
            ["x", ...refined_info.map(i => i.time)],
            ["Available_Memory_ShareDB", ...refined_info.map(i => i.free_memory_sharedb)],
            ["Available_Memory_YJS", ...refined_info.map(i => i.free_memory_yjs)]
        ],
        types: {
            Available_Memory_ShareDB: "line",
            Available_Memory_YJS: "line"
        },
        colors: {
            Available_Memory_ShareDB: "teal",
            Available_Memory_YJS: "blue"
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
            label: "Time (t/5 seconds)"
        },
        y: {
            label: 'Number Of Users'
        },
        y2: {
            show: true,
            label: 'CPU Available (%)'
        }
    },
    data: {
        columns: [
            ["x", ...refined_info.map(i => i.time)],
            ["Number_Of_Clients_ShareDB", ...refined_info.map(i => i.clients_sharedb)],
            ["Number_Of_Clients_YJS", ...refined_info.map(i => i.clients_yjs)],
            ["Idle_CPU_ShareDB", ...refined_info.map(i => i.idle_cpu_sharedb)],
            ["Idle_CPU_YJS", ...refined_info.map(i => i.idle_cpu_yjs)]
        ],
        types: {
            Number_Of_Clients_ShareDB: "line",
            Number_Of_Clients_YJS: "line",
            Idle_CPU_ShareDB: "line",
            Idle_CPU_YJS: "line"
        },
        colors: {
            Number_Of_Clients_ShareDB: "blue",
            Number_Of_Clients_YJS: "teal",
            Idle_CPU_ShareDB: "brown",
            Idle_CPU_YJS: "orange"
        },
        x: "x",
        axes: {
            Idle_CPU_ShareDB: "y2",
            Idle_CPU_YJS: "y2"
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
            label: "Time (t/5 seconds)"
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
            ["x", ...refined_info.map(i => i.time)],
            ["Document_Size_ShareDB", ...refined_info.map(i => i.doc_size_sharedb)],
            ["Document_Size_YJS", ...refined_info.map(i => i.doc_size_yjs)],
            ["Idle_CPU_ShareDB", ...refined_info.map(i => i.idle_cpu_sharedb)],
            ["Idle_CPU_YJS", ...refined_info.map(i => i.idle_cpu_yjs)]
        ],
        types: {
            Document_Size_ShareDB: "line",
            Document_Size_YJS: "line",
            Idle_CPU_ShareDB: "line",
            Idle_CPU_YJS: "line"
        },
        colors: {
            Document_Size_ShareDB: "blue",
            Document_Size_YJS: "teal",
            Idle_CPU_ShareDB: "brown",
            Idle_CPU_YJS: "orange"
        },
        x: "x",
        axes: {
            Idle_CPU_ShareDB: "y2",
            Idle_CPU_YJS: "y2"
        }
    }
});
