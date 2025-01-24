// Persistent tab suspension mechanism
const SUSPEND_KEY = 'tab_suspension_data';

async function saveSuspendedTabInfo(tab) {
  const suspendedTabs = await chrome.storage.local.get(SUSPEND_KEY);
  const currentSuspendedTabs = suspendedTabs[SUSPEND_KEY] || {};
  
  currentSuspendedTabs[tab.url] = {
    title: tab.title,
    originalUrl: tab.url,
    suspendedAt: Date.now()
  };

  await chrome.storage.local.set({ 
    [SUSPEND_KEY]: currentSuspendedTabs 
  });
}

async function suspendTab(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    
    // Save tab info before suspension
    await saveSuspendedTabInfo(tab);

    // Create suspend URL with encoded original details
    const suspendUrl = `suspend.html?url=${encodeURIComponent(tab.url)}`;
    
    await chrome.tabs.update(tabId, { url: suspendUrl });
    
    console.log(`Tab ${tabId} suspended`);
  } catch (error) {
    console.error('Suspension failed:', error);
  }
}

async function resumeTab(tabId, url) {
  try {
    const suspendedTabs = await chrome.storage.local.get(SUSPEND_KEY);
    const currentSuspendedTabs = suspendedTabs[SUSPEND_KEY] || {};
    
    // Find the original tab info
    const tabInfo = currentSuspendedTabs[url];
    
    if (tabInfo) {
      // Restore the original URL
      await chrome.tabs.update(tabId, { 
        url: tabInfo.originalUrl 
      });
      
      // Remove this entry from suspended tabs
      delete currentSuspendedTabs[url];
      await chrome.storage.local.set({ 
        [SUSPEND_KEY]: currentSuspendedTabs 
      });
    }
  } catch (error) {
    console.error('Resume failed:', error);
  }
}

// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch(request.action) {
    case 'suspendTab':
      suspendTab(request.tabId);
      break;
    case 'resumeTab':
      resumeTab(request.tabId, request.url);
      break;
  }
});