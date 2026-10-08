importScripts("switch.js");

// The toolbar icon is grey by default (see manifest.json). On GitHub and
// Graphite, content.js reports whether the tab is on a PR, and the icon turns
// blue there. Chrome resets these per-tab settings whenever a tab loads a new
// page, and content.js reports again for the new page.
//
// Chrome's own greyed-out "disabled" look can't do this: it never greys the
// icon on a page the extension can act on, and activeTab counts as that on
// every site.
chrome.runtime.onMessage.addListener(({ label }, sender) => {
  const tabId = sender.tab.id;
  if (label) {
    chrome.action.setIcon({ tabId, path: { 16: "icons/icon16.png", 32: "icons/icon32.png" } });
    chrome.action.setTitle({ tabId, title: `Open this PR in ${label}` });
  } else {
    chrome.action.setIcon({ tabId, path: { 16: "icons/off16.png", 32: "icons/off32.png" } });
    chrome.action.setTitle({ tabId, title: "Not on a pull request" });
  }
});

// Toolbar icon click (or the Alt+Shift+G shortcut) swaps the current tab.
chrome.action.onClicked.addListener((tab) => {
  const target = tab.url && counterpartUrl(tab.url);
  if (target) chrome.tabs.update(tab.id, { url: target.url });
});
