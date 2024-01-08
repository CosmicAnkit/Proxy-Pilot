document.addEventListener('DOMContentLoaded', function () {
    const proxyInput = document.getElementById('proxyInput');
    const portInput = document.getElementById('portInput');
    const applyButton = document.getElementById('applyButton');
    const statusText = document.getElementById('statusText');

    if (proxyInput && portInput && applyButton && statusText) {
        chrome.storage.sync.get(['proxyEnabled', 'proxyAddress', 'proxyPort'], function (data) {
            proxyInput.value = data.proxyAddress || '';
            portInput.value = data.proxyPort || '';
            updateStatusText(data.proxyEnabled);
        });

        applyButton.addEventListener('click', function () {
            const isEnabled = !statusText.textContent.includes('Enabled');
            const proxyAddress = proxyInput.value.trim();
            const proxyPort = portInput.value.trim();

            // Update storage using a callback
            chrome.storage.sync.set({
                proxyEnabled: isEnabled,
                proxyAddress: proxyAddress,
                proxyPort: proxyPort,
            }, function () {
                updateProxySettings(isEnabled, proxyAddress, proxyPort);
                updateStatusText(isEnabled);
                applyButton.classList.toggle('clicked');
                applyButton.textContent = isEnabled ? 'Disable Proxy' : 'Enable Proxy';
            });
        });
    } else {
        console.error('One or more elements not found');
    }
});

function updateStatusText(isEnabled) {
    statusText.textContent = isEnabled ? 'Proxy Enabled' : 'Proxy Disabled';
}

function updateProxySettings(isEnabled, proxyAddress, proxyPort) {
    const proxySettings = {
        mode: isEnabled ? 'fixed_servers' : 'system',
    };

    if (isEnabled) {
        proxySettings.rules = {
            singleProxy: {
                scheme: 'http',
                host: proxyAddress,
                port: parseInt(proxyPort),
            },
        };
    }

    chrome.proxy.settings.set({
        value: proxySettings,
        scope: 'regular',
    });
}
