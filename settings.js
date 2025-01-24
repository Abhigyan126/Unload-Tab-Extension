// Settings management for Tab Unloader

// Default settings
const DEFAULT_SETTINGS = {
    excludedSites: [],
    autoSuspend: true,
    inactivityTimeout: 30
  };
  
  // Save settings to storage
  function saveSettings(settings) {
    chrome.storage.sync.set({ tabUnloaderSettings: settings });
  }
  
  // Load settings from storage
  function loadSettings() {
    chrome.storage.sync.get('tabUnloaderSettings', (data) => {
      const settings = data.tabUnloaderSettings || DEFAULT_SETTINGS;
      
      // Populate excluded sites
      const excludedSitesContainer = document.getElementById('excludedSites');
      excludedSitesContainer.innerHTML = '';
      settings.excludedSites.forEach(site => {
        addSiteToList(site);
      });
  
      // Set checkbox and timeout
      document.getElementById('autoSuspend').checked = settings.autoSuspend;
      document.getElementById('inactivityTimeout').value = settings.inactivityTimeout;
    });
  }
  
  // Add site to exclusion list
  function addSiteToList(site) {
    chrome.storage.sync.get('tabUnloaderSettings', (data) => {
      const settings = data.tabUnloaderSettings || DEFAULT_SETTINGS;
      
      // Prevent duplicates
      if (!settings.excludedSites.includes(site)) {
        settings.excludedSites.push(site);
        saveSettings(settings);
        
        const container = document.getElementById('excludedSites');
        const siteItem = document.createElement('div');
        siteItem.className = 'site-item';
        siteItem.innerHTML = `
          <span>${site}</span>
          <button onclick="removeSite('${site}')">Remove</button>
        `;
        container.appendChild(siteItem);
      }
    });
  }
  
  // Remove site from exclusion list
  function removeSite(site) {
    chrome.storage.sync.get('tabUnloaderSettings', (data) => {
      const settings = data.tabUnloaderSettings || DEFAULT_SETTINGS;
      
      settings.excludedSites = settings.excludedSites.filter(s => s !== site);
      saveSettings(settings);
      loadSettings();
    });
  }
  
  // Event Listeners
  document.getElementById('addSite').addEventListener('click', () => {
    const newSiteInput = document.getElementById('newSite');
    const site = newSiteInput.value.trim();
    
    if (site) {
      addSiteToList(site);
      newSiteInput.value = '';
    }
  });
  
  document.getElementById('autoSuspend').addEventListener('change', (e) => {
    chrome.storage.sync.get('tabUnloaderSettings', (data) => {
      const settings = data.tabUnloaderSettings || DEFAULT_SETTINGS;
      settings.autoSuspend = e.target.checked;
      saveSettings(settings);
    });
  });
  
  document.getElementById('inactivityTimeout').addEventListener('change', (e) => {
    chrome.storage.sync.get('tabUnloaderSettings', (data) => {
      const settings = data.tabUnloaderSettings || DEFAULT_SETTINGS;
      settings.inactivityTimeout = parseInt(e.target.value);
      saveSettings(settings);
    });
  });
  
  // Load settings on page load
  document.addEventListener('DOMContentLoaded', loadSettings);
  
  // Expose functions globally for inline event handlers
  window.removeSite = removeSite;