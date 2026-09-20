const axios = require("axios");

const githubApi = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

function getGithubHeaders() {
  const headers = {};

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function getRepository(owner, repo) {
  const response = await githubApi.get(
    `/repos/${owner}/${repo}`,
    {
      headers: getGithubHeaders(),
    }
  );

  return response.data;
}

async function getRepositoryContents(owner, repo) {
  const response = await githubApi.get(
    `/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
    {
      headers: getGithubHeaders(),
    }
  );

  return response.data.tree;
}

async function getFileContent(owner, repo, filePath) {
  const response = await githubApi.get(
    `/repos/${owner}/${repo}/contents/${filePath}`,
    {
      headers: getGithubHeaders(),
    }
  );

  if (response.data.type !== "file") {
    return null;
  }

  const content = Buffer.from(
    response.data.content,
    "base64"
  ).toString("utf-8");

  return content;
}

module.exports = {
  getRepository,
  getRepositoryContents,
  getFileContent,
};