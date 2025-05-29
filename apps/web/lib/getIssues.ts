export async function fetchAndSortGitHubIssues(githubToken: string) {
    const headers = {
      Authorization: `token ${githubToken}`,
      Accept: "application/vnd.github+json",
    };
  
    const reposRes = await fetch("https://api.github.com/user/repos?per_page=100", {
      headers,
      cache: "no-store",
    });
    const repos = await reposRes.json();
  
    const allIssues = [];
  
    for (const repo of repos) {
      let page = 1;
      let done = false;
  
      while (!done) {
        const issuesRes = await fetch(
          `https://api.github.com/repos/${repo.owner.login}/${repo.name}/issues?state=all&per_page=100&page=${page}`,
          {
            headers,
            cache: "no-store",
          }
        );
  
        const issues = await issuesRes.json();
  
        if (!Array.isArray(issues) || issues.length === 0) break;
  
        for (const issue of issues) {
          if (issue.pull_request) continue;
          
          if (issue.assignees && issue.assignees.length > 0) continue;
          
          const hasBountyLabel = issue.labels && issue.labels.some(
            (label: { name: string }) => 
              typeof label === 'object' && 
              label.name && 
              /^\$\d+[kKmM]?$/.test(label.name)
          );
          
          if (hasBountyLabel) continue;
          
          allIssues.push({
            ...issue,
            repo: repo.name,
          });
        }
  
        if (issues.length < 100) done = true;
        page++;
      }
    }
    return allIssues.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
  