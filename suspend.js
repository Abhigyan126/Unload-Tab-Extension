document.getElementById('resumeBtn').addEventListener('click', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabId = parseInt(urlParams.get('tabId'));
    
    chrome.runtime.sendMessage({ 
      action: 'resumeTab', 
      tabId: tabId 
    });
  });
  
  window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const originalUrl = decodeURIComponent(urlParams.get('url'));
    const originalTitle = decodeURIComponent(urlParams.get('title'));
    const tabId = parseInt(urlParams.get('tabId'));
    
    // Display original page title
    const titleElement = document.getElementById('originalTitle');
    titleElement.textContent = originalTitle;
    
    document.title = `U: ${originalTitle}`;
    
    // Store the original URL
    chrome.storage.local.set({
      [`suspended_tab_${tabId}`]: originalUrl
    });
  });