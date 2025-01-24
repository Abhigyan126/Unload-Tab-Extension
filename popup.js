document.getElementById('suspend').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.runtime.sendMessage({action: 'suspend', tabId: tabs[0].id});
      window.close(); // Close popup after action
    });
  });
  
  document.getElementById('suspend-all').addEventListener('click', () => {
    chrome.tabs.query({active: false, currentWindow: true}, (tabs) => {
      tabs.forEach(tab => {
        if (!tab.pinned) {
          chrome.runtime.sendMessage({action: 'suspend', tabId: tab.id});
        }
      });
      window.close();
    });
  });
  
  document.getElementById('resume').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.runtime.sendMessage({action: 'resume', tabId: tabs[0].id});
      window.close();
    });
  });

  document.getElementById('suspend').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      console.log('Attempting to suspend tab:', tabs[0].id);
      chrome.runtime.sendMessage(
        {action: 'suspendTab', tabId: tabs[0].id}, 
        (response) => {
          console.log('Suspension response:', response);
        }
      );
    });
  });