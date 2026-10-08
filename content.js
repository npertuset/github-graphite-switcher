// Floating "Open in Graphite" / "Open in GitHub" link on pull request pages.
// It's a real link, so Cmd-click opens the other side in a new tab.
const host = document.createElement("gh-graphite-switch");
const shadow = host.attachShadow({ mode: "closed" });
shadow.innerHTML = `
  <style>
    :host { all: initial; }
    a {
      position: fixed;
      bottom: 16px;
      right: 16px;
      z-index: 2147483647;
      padding: 6px 12px;
      border-radius: 999px;
      background: #1f2328;
      color: #fff;
      font: 500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      text-decoration: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
      opacity: 0.85;
    }
    a:hover { opacity: 1; }
  </style>
  <a></a>
`;
const link = shadow.querySelector("a");

// GitHub and Graphite are single-page apps, so the URL changes without a
// page load. Check it on a timer and show or hide the link to match.
function update() {
  const target = counterpartUrl(location.href);
  if (target) {
    if (link.href !== target.url) {
      link.href = target.url;
      link.textContent = `Open in ${target.label}`;
    }
    if (!host.isConnected) document.documentElement.append(host);
  } else {
    host.remove();
  }
  reportToToolbar(target ? target.label : null);
}

// Tells background.js which toolbar icon to show for this tab, only when it
// changes.
let reportedLabel;
function reportToToolbar(label) {
  if (label === reportedLabel) return;
  reportedLabel = label;
  chrome.runtime.sendMessage({ label });
}

// A page restored from the back/forward cache keeps this script's state, but
// Chrome has reset the tab's icon, so report again.
window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  reportedLabel = undefined;
  update();
});

// Refresh again right as the link is used, so a click just after moving to
// another page doesn't open the PR you came from.
link.addEventListener("pointerdown", update);
link.addEventListener("click", (event) => {
  update();
  if (!host.isConnected) event.preventDefault();
});

update();
setInterval(update, 500);
