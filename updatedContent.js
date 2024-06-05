chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "applyBionicReading") {
      toggleBionicReading();
    } else if (request.action === "highlightText") {
      highlightText();
    }
  });
  
  function toggleBionicReading() {
    if (document.body.classList.contains('bionic-reading')) {
      document.body.classList.remove('bionic-reading');
    } else {
      document.body.classList.add('bionic-reading');
      applyBionicReading();
    }
  }
  
  function applyBionicReading() {
    const coreContent = extractCoreContent(document.body);
    if (coreContent) {
      const elements = coreContent.querySelectorAll('p, span, a, li');
      elements.forEach(el => {
        const words = el.innerText.split(' ');
        const bionicText = words.map(word => {
          const midpoint = Math.ceil(word.length / 2);
          return `<b>${word.slice(0, midpoint)}</b>${word.slice(midpoint)}`;
        }).join(' ');
        el.innerHTML = bionicText;
      });
    }
  }
  
  function extractCoreContent(rootElement) {
    const coreContent = rootElement.cloneNode(true);
    // Remove unwanted elements
    const selectorsToRemove = ['header', 'nav', 'footer', 'aside', 'img', 'script', 'style', 'link'];
    selectorsToRemove.forEach(selector => {
      const elements = coreContent.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });
    return coreContent;
  }
  
  function highlightText() {
    const selection = window.getSelection().toString();
    if (selection) {
      const span = document.createElement('span');
      span.style.backgroundColor = 'yellow';
      span.innerText = selection;
      const range = window.getSelection().getRangeAt(0);
      range.deleteContents();
      range.insertNode(span);
    }
  }
  