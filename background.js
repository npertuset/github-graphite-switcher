importScripts("switch.js");

// Toolbar icon click (or the Alt+Shift+G shortcut) swaps the current tab.
chrome.action.onClicked.addListener((tab) => {
  const target = tab.url && counterpartUrl(tab.url);
  if (target) chrome.tabs.update(tab.id, { url: target.url });
});
