const query_params = new URLSearchParams(window.location.search);

if (query_params.get("mode") === "TRACKING") {
    document.addEventListener('DOMContentLoaded', initializeTracker, false);
}

function initializeTracker() {
    
    fetch("http://localhost:4000/api/interactions", { method: "get" }) 
    .then((response) => response.json())
    .then(response => {
        const interactions = response.data;
        interactions.forEach(interaction => {
            const xpathResult = document.evaluate(interaction.xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null );
            const node = xpathResult.iterateNext();
            if (node != null) {
                node.addEventListener('click', onTrackedClickElement, false);
            }
        });
    });
}

function onTrackedClickElement(_event) {
    console.log('Tracked node was clicked');
}