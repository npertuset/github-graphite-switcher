// Maps a pull request URL on GitHub to the same PR on Graphite, and back.
// Returns null when the URL isn't a pull request page.
const GRAPHITE_ORIGIN = "https://app.graphite.dev";

function counterpartUrl(url) {
  const github = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (github) {
    const [, owner, repo, number] = github;
    return { label: "Graphite", url: `${GRAPHITE_ORIGIN}/github/pr/${owner}/${repo}/${number}` };
  }

  const graphite = url.match(/^https:\/\/app\.graphite\.(?:dev|com)\/github\/pr\/([^/]+)\/([^/]+)\/(\d+)/);
  if (graphite) {
    const [, owner, repo, number] = graphite;
    return { label: "GitHub", url: `https://github.com/${owner}/${repo}/pull/${number}` };
  }

  return null;
}
