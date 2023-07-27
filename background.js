let lastClick = 0;
let timer = null;

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.sync.get(['websites', 'reverse'], function(data) {
    let websites = data.websites || [];
    let reverse = data.reverse || false;

    if (timer === null) {
      timer = setTimeout(function() {
        for (var i = 0; i < websites.length; i++) {
          chrome.tabs.create({ url: websites[i] });
        }
        timer = null; // reset timer
      }, 300); // set the timer
    } else {
      clearTimeout(timer);
      timer = null;
      chrome.tabs.query({}, function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
          var tab = tabs[i];
          var inList = websites.some(function(website) {
            return tab.url.indexOf(website) === 0;
          });
          if ((reverse && inList) || (!reverse && !inList)) {
            chrome.tabs.remove(tab.id);
          }
        }
      });
    }
  });
});

// Create a context menu item
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: 'options',
    title: 'Edit Websites',
    contexts: ['action']
  });
});

// Handle context menu item clicks
chrome.contextMenus.onClicked.addListener(function(info) {
  if (info.menuItemId === 'options') {
    chrome.runtime.openOptionsPage();
  }
});