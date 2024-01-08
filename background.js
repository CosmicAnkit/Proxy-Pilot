chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({ proxyEnabled: false });
  });
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "toggleProxy") {
      const isEnabled = request.enabled;
      chrome.storage.sync.set({ proxyEnabled: isEnabled });
      updateProxySettings(isEnabled);
    }
  });
  
  function updateProxySettings(isEnabled) {
    const proxySettings = {
      mode: isEnabled ? 'fixed_servers' : 'system',
    };
  
    if (isEnabled) {
      proxySettings.rules = {
        singleProxy: {
          scheme: 'http',
          host: 'localhost',
          port: 6399,
        },
      };
    }
  
    chrome.proxy.settings.set({
      value: proxySettings,
      scope: 'regular',
    });
  }
  