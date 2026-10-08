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
  if (!target) {
    host.remove();
    return;
  }

  if (link.href !== target.url) {
    link.href = target.url;
    link.textContent = `Open in ${target.label}`;
  }
  if (!host.isConnected) document.documentElement.append(host);
}

update();
setInterval(update, 500);
