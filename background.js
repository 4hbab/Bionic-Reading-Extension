chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ highlights: [] }, () => {
      console.log('Initial highlights set.');
    });
  });
  