export async function fetchAndSortGitHubIssues(githubToken: string) {
  // console.log("its githubToken", githubToken);
    const headers = {
      Authorization: `token ${githubToken}`,
      Accept: "application/vnd.github+json",
    };
  
    // 1. Fetch all repositories (owned & collaborators)
    const reposRes = await fetch("https://api.github.com/user/repos?per_page=100", {
      headers,
      cache: "no-store",
    });
    const repos = await reposRes.json();
    // console.log("its repos", repos);
  
    const allIssues = [];
  
    // 2. Fetch all issues from each repo
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
        // console.log("its issues", issues);
  
        if (!Array.isArray(issues) || issues.length === 0) break;
  
        for (const issue of issues) {
          // Skip pull requests
          if (issue.pull_request) continue;
          
          // Skip issues that have been assigned to someone
          if (issue.assignees && issue.assignees.length > 0) continue;
          
          // Skip issues that have a bounty label ($[number])
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
    // console.log("its allIssues", allIssues);
    // 3. Sort issues by creation date (newest first)
    return allIssues.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
  