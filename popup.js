document.getElementById('toggleBionic').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: toggleBionicReading
      });
    });
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
  
  chrome.storage.local.get({ highlights: [] }, function (data) {
    const highlightedList = document.getElementById('highlightedList');
    data.highlights.forEach(highlight => {
      const li = document.createElement('li');
      li.textContent = highlight;
      highlightedList.appendChild(li);
    });
  });
  