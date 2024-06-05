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
    const elements = document.querySelectorAll('p, span, a, li');
    elements.forEach(el => {
      const words = el.innerText.split(' ');
      const bionicText = words.map(word => {
        const midpoint = Math.ceil(word.length / 2);
        return `<b>${word.slice(0, midpoint)}</b>${word.slice(midpoint)}`;
      }).join(' ');
      el.innerHTML = bionicText;
    });
  }
  
  document.addEventListener('mouseup', (event) => {
    const selection = window.getSelection().toString().trim();
    if (selection) {
      setTimeout(() => {
        showToolbar(event.pageX, event.pageY);
      }, 100); // Adding a slight delay to allow the selection to complete
    } else {
      removeToolbar();
    }
  });
  
  function showToolbar(x, y) {
    removeToolbar();
    const toolbar = document.createElement('div');
    toolbar.id = 'highlightToolbar';
    toolbar.style.position = 'absolute';
    toolbar.style.left = `${x}px`;
    toolbar.style.top = `${y}px`;
    toolbar.style.backgroundColor = '#fff';
    toolbar.style.border = '1px solid #ccc';
    toolbar.style.padding = '5px';
    toolbar.style.zIndex = '1000';
    const highlightButton = document.createElement('button');
    highlightButton.textContent = 'Highlight';
    highlightButton.addEventListener('click', (e) => {
      e.stopPropagation();
      highlightText();
      removeToolbar();
    });
    toolbar.appendChild(highlightButton);
    document.body.appendChild(toolbar);
  }
  
  function removeToolbar() {
    const toolbar = document.getElementById('highlightToolbar');
    if (toolbar) {
      toolbar.remove();
    }
  }
  
  function highlightText() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (selectedText) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.backgroundColor = 'yellow';
      span.textContent = selectedText;
  
      // To avoid moving the toolbar, create a marker to save the selection position
      const marker = document.createElement('span');
      marker.id = 'selection-marker';
      range.insertNode(marker);
      range.deleteContents();
      range.insertNode(span);
  
      const markerPosition = marker.getBoundingClientRect();
      const toolbar = document.getElementById('highlightToolbar');
      if (toolbar) {
        toolbar.style.left = `${markerPosition.left}px`;
        toolbar.style.top = `${markerPosition.top + window.scrollY}px`;
      }
      marker.remove();
  
      chrome.storage.local.get({ highlights: [] }, function (data) {
        const highlights = data.highlights;
        highlights.push(selectedText);
        chrome.storage.local.set({ highlights: highlights });
      });
    }
  }
  