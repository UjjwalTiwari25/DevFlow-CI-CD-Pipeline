const { config } = require('../config');

async function reportCommitStatus(token, fullName, sha, state, description, targetUrl = null) {
  try {
    const url = `https://api.github.com/repos/${fullName}/statuses/${sha}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        state, // 'error', 'failure', 'pending', or 'success'
        description: description.substring(0, 140),
        context: 'devflow/ci',
        ...(targetUrl && { target_url: targetUrl })
      })
    });
    if (!res.ok) {
      console.error(`Failed to report GitHub status: ${await res.text()}`);
    }
  } catch (error) {
    console.error('Error reporting GitHub status:', error);
  }
}

module.exports = { reportCommitStatus };
