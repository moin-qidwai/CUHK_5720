info = ScenarioData

const refined_info = info.map(d => ({ 
    ...d,
    free_memory_sharedb: Math.floor(d.free_memory_sharedb/1000000),
    free_memory_fluid: Math.floor(d.free_memory_fluid/1000000),
    idle_cpu_sharedb: Math.floor(d.idle_cpu_sharedb * 100),
    idle_cpu_fluid: Math.floor(d.idle_cpu_fluid * 100),
}));

console.log(refined_info)

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
            ["Available_Memory_fluid", ...refined_info.map(i => i.free_memory_fluid)],
            ["Available_Memory_sharedb", ...refined_info.map(i => i.free_memory_sharedb)]
        ],
        types: {
            Available_Memory_sharedb: "line",
            Available_Memory_fluid: "line"
        },
        colors: {
            Available_Memory_sharedb: "teal",
            Available_Memory_fluid: "blue"
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
            ["Number_Of_Clients_fluid", ...refined_info.map(i => i.clients_fluid)],
            ["Number_Of_Clients_sharedb", ...refined_info.map(i => i.clients_sharedb)],
            ["Idle_CPU_fluid", ...refined_info.map(i => i.idle_cpu_fluid)],
            ["Idle_CPU_sharedb", ...refined_info.map(i => i.idle_cpu_sharedb)]
        ],
        types: {
            Number_Of_Clients_fluid: "line",
            Number_Of_Clients_sharedb: "line",
            Idle_CPU_fluid: "line",
            Idle_CPU_sharedb: "line"
        },
        colors: {
            Number_Of_Clients_fluid: "blue",
            Number_Of_Clients_sharedb: "teal",
            Idle_CPU_fluid: "brown",
            Idle_CPU_sharedb: "orange"
        },
        x: "x",
        axes: {
            Idle_CPU_fluid: "y2",
            Idle_CPU_sharedb: "y2"
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
            ["Document_Size_fluid", ...refined_info.map(i => i.doc_size_fluid)],
            ["Document_Size_sharedb", ...refined_info.map(i => i.doc_size_sharedb)],
            ["Idle_CPU_fluid", ...refined_info.map(i => i.idle_cpu_fluid)],
            ["Idle_CPU_sharedb", ...refined_info.map(i => i.idle_cpu_sharedb)]
        ],
        types: {
            Document_Size_fluid: "line",
            Document_Size_sharedb: "line",
            Idle_CPU_fluid: "line",
            Idle_CPU_sharedb: "line"
        },
        colors: {
            Document_Size_fluid: "blue",
            Document_Size_sharedb: "teal",
            Idle_CPU_fluid: "brown",
            Idle_CPU_sharedb: "orange"
        },
        x: "x",
        axes: {
            Idle_CPU_fluid: "y2",
            Idle_CPU_sharedb: "y2"
        }
    }
});
