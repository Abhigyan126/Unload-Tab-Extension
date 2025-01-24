document.getElementById('resumeBtn').addEventListener('click', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const originalUrl = decodeURIComponent(urlParams.get('url'));
  
  chrome.runtime.sendMessage({ 
    action: 'resumeTab', 
    url: originalUrl 
  });
});

window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const originalUrl = decodeURIComponent(urlParams.get('url'));
  
  // Fetch saved tab info
  chrome.storage.local.get('tab_suspension_data', (data) => {
    const suspendedTabs = data.tab_suspension_data || {};
    const tabInfo = suspendedTabs[originalUrl];
    
    if (tabInfo) {
      // Update page with original title
      document.title = `U: ${tabInfo.title}`;
      document.getElementById('originalTitle').textContent = tabInfo.title;
    }
  });
});