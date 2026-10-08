// Maps a pull request URL on GitHub to the same PR on Graphite, and back.
// Returns null when the URL isn't a pull request page.
const GRAPHITE_ORIGIN = "https://app.graphite.dev";

// Strings rather than regex literals so background.js can also hand them to
// declarativeContent, which takes RE2 patterns as strings.
const GITHUB_PR_URL = "^https://github\\.com/([^/]+)/([^/]+)/pull/(\\d+)";
const GRAPHITE_PR_URL = "^https://app\\.graphite\\.(?:dev|com)/github/pr/([^/]+)/([^/]+)/(\\d+)";

function counterpartUrl(url) {
  const github = url.match(new RegExp(GITHUB_PR_URL));
  if (github) {
    const [, owner, repo, number] = github;
    return { label: "Graphite", url: `${GRAPHITE_ORIGIN}/github/pr/${owner}/${repo}/${number}` };
  }

  const graphite = url.match(new RegExp(GRAPHITE_PR_URL));
  if (graphite) {
    const [, owner, repo, number] = graphite;
    return { label: "GitHub", url: `https://github.com/${owner}/${repo}/pull/${number}` };
  }

  return null;
}
