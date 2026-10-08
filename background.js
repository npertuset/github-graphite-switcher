importScripts("switch.js");

// Grey out the toolbar icon everywhere except pull request pages. The rules
// persist, but the default disabled state doesn't survive a browser restart.
function disableOffPrPages() {
  chrome.action.disable();
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [GITHUB_PR_URL, GRAPHITE_PR_URL].map(
          (pattern) => new chrome.declarativeContent.PageStateMatcher({ pageUrl: { urlMatches: pattern } })
        ),
        actions: [new chrome.declarativeContent.ShowAction()],
      },
    ]);
  });
}

chrome.runtime.onInstalled.addListener(disableOffPrPages);
chrome.runtime.onStartup.addListener(disableOffPrPages);

// Toolbar icon click (or the Alt+Shift+G shortcut) swaps the current tab.
chrome.action.onClicked.addListener((tab) => {
  const target = tab.url && counterpartUrl(tab.url);
  if (target) chrome.tabs.update(tab.id, { url: target.url });
});
