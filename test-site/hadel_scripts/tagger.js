const params = new URLSearchParams(window.location.search);

if (params.get("mode") === "TAGGING") {
  document.addEventListener('DOMContentLoaded', initialize, false);
}

var display = document.createElement("div");

function initialize() {
    display.style.position = 'fixed';
    display.style.top = 0;
    display.style.left = 0;
    display.style.zIndex = 10000000;

    document.body.appendChild(display);
    refreshHandlers();
}

function refreshHandlers() {
    var allButtons = document.getElementsByTagName("button");
    var allInputs = document.getElementsByTagName("input");

    for (let i = 0; i < allButtons.length; i++) {
        const button = allButtons[i];
        setupElement(button);
    }

    for (let i = 0; i < allInputs.length; i++) {
        const input = allInputs[i];
        setupElement(input);
    }
}

function setupElement(element) {
    element.addEventListener('pointerenter', onPointerEnterElement);
}

function onPointerEnterElement(event) {
    const element = event.target;
    const bounded = element.getBoundingClientRect();
    const highlighted_rect = document.createElement("div");
    highlighted_rect.id = 'hadel_'+Math.random();
    highlighted_rect.style.position = 'absolute';
    highlighted_rect.style.width = bounded.width + 'px';
    highlighted_rect.style.height = bounded.height + 'px';
    highlighted_rect.style.top = bounded.top + 'px';
    highlighted_rect.style.left = bounded.left + 'px';
    highlighted_rect.style.backgroundColor = 'rgba(0,0,150,0.3)';
    highlighted_rect.style.cursor = 'crosshair';
    highlighted_rect.target_node = element;
    element.hadel_box = highlighted_rect;
    display.appendChild(highlighted_rect);

    highlighted_rect.addEventListener('pointerleave', onPointerLeaveHadelBox);
    highlighted_rect.addEventListener('click', onClickElement);
}

function onPointerLeaveHadelBox(event) {
    display.removeChild(event.target);
}

function onClickElement(event) {
    const element = event.target.target_node;
    fetch("http://localhost:4000/api/interactions", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            interaction: {
              title: 'Example Title',
              type: element.type,
              url: window.location.href,
              xpath: XpathFinder.xpath(element, false)
            }
          })
        })
    .then( (response) => console.log(response));
}

const XpathFinder = {
    xpath: function(node, optimized) {
        if (node.nodeType === Node.DOCUMENT_NODE)
          return '/';
      
        const steps = [];
        let contextNode = node;
        while (contextNode) {
          const step = XpathFinder._xPathValue(contextNode, optimized);
          if (!step)
            break;  // Error - bail out early.
          steps.push(step);
          if (step.optimized)
            break;
          contextNode = contextNode.parentNode;
        }
      
        steps.reverse();
        return (steps.length && steps[0].optimized ? '' : '/') + steps.join('/');
    },
    _xPathValue: function(node, optimized) {
        let ownValue;
        const ownIndex = XpathFinder._xPathIndex(node);
        if (ownIndex === -1)
          return null;  // Error.
      
        switch (node.nodeType) {
          case Node.ELEMENT_NODE:
            if (optimized && node.getAttribute('id'))
              return new XpathFinder.Step('//*[@id="' + node.getAttribute('id') + '"]', true);
            ownValue = node.localName;
            break;
          case Node.ATTRIBUTE_NODE:
            ownValue = '@' + node.nodeName;
            break;
          case Node.TEXT_NODE:
          case Node.CDATA_SECTION_NODE:
            ownValue = 'text()';
            break;
          case Node.PROCESSING_INSTRUCTION_NODE:
            ownValue = 'processing-instruction()';
            break;
          case Node.COMMENT_NODE:
            ownValue = 'comment()';
            break;
          case Node.DOCUMENT_NODE:
            ownValue = '';
            break;
          default:
            ownValue = '';
            break;
        }
      
        if (ownIndex > 0)
          ownValue += '[' + ownIndex + ']';
      
        return new XpathFinder.Step(ownValue, node.nodeType === Node.DOCUMENT_NODE);
    },
    _xPathIndex: function(node) {
        // Returns -1 in case of error, 0 if no siblings matching the same expression, <XPath index among the same expression-matching sibling nodes> otherwise.
        function areNodesSimilar(left, right) {
          if (left === right)
            return true;
      
          if (left.nodeType === Node.ELEMENT_NODE && right.nodeType === Node.ELEMENT_NODE)
            return left.localName === right.localName;
      
          if (left.nodeType === right.nodeType)
            return true;
      
          // XPath treats CDATA as text nodes.
          const leftType = left.nodeType === Node.CDATA_SECTION_NODE ? Node.TEXT_NODE : left.nodeType;
          const rightType = right.nodeType === Node.CDATA_SECTION_NODE ? Node.TEXT_NODE : right.nodeType;
          return leftType === rightType;
        }
      
        const siblings = node.parentNode ? node.parentNode.children : null;
        if (!siblings)
          return 0;  // Root node - no siblings.
        let hasSameNamedElements;
        for (let i = 0; i < siblings.length; ++i) {
          if (areNodesSimilar(node, siblings[i]) && siblings[i] !== node) {
            hasSameNamedElements = true;
            break;
          }
        }
        if (!hasSameNamedElements)
          return 0;
        let ownIndex = 1;  // XPath indices start with 1.
        for (let i = 0; i < siblings.length; ++i) {
          if (areNodesSimilar(node, siblings[i])) {
            if (siblings[i] === node)
              return ownIndex;
            ++ownIndex;
          }
        }
        return -1;  // An error occurred: |node| not found in parent's children.
    },
    Step:  class {
        constructor(value, optimized) {
          this.value = value;
          this.optimized = optimized || false;
        }
      
        /**
         * @override
         * @return {string}
         */
        toString() {
          return this.value;
        }
    }
}