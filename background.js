const SUSPENDED_TABS = new Set();

function createSuspendPageUrl(tabId, originalUrl, originalTitle) {
  const encodedUrl = encodeURIComponent(originalUrl);
  const encodedTitle = encodeURIComponent(originalTitle);
  return `suspend.html?tabId=${tabId}&url=${encodedUrl}&title=${encodedTitle}`;
}

async function suspendTab(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    
    await chrome.tabs.update(tabId, {
      url: createSuspendPageUrl(tabId, tab.url, tab.title)
    });

    SUSPENDED_TABS.add(tabId);
    console.log(`Tab ${tabId} suspended`);
  } catch (error) {
    console.error('Suspension failed:', error);
  }
}

async function resumeTab(tabId) {
  try {
    const storageKey = `suspended_tab_${tabId}`;
    const storedData = await chrome.storage.local.get(storageKey);
    
    if (storedData[storageKey]) {
      await chrome.tabs.update(tabId, { 
        url: storedData[storageKey] 
      });
      
      await chrome.storage.local.remove(storageKey);
      SUSPENDED_TABS.delete(tabId);
    }
  } catch (error) {
    console.error('Resume failed:', error);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch(request.action) {
    case 'suspendTab':
      suspendTab(request.tabId);
      break;
    case 'resumeTab':
      resumeTab(request.tabId);
      break;
  }
});