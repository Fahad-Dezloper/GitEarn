import { Probot } from "probot";

export default (app: Probot) => {

  // when issue is opened
  app.on("issues.opened", async (context) => {
    console.log("i am here", context);
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    await context.octokit.issues.createComment(issueComment);
  });

  // when /bounty issue comment is created
  app.on("issue_comment.created", async (context) => {
      const commentBody = context.payload.comment.body;
      console.log("i am here", commentBody);
        if (commentBody.startsWith("/bounty")) {
          console.log("i am here", true);
          const amountMatch = commentBody.match(/^\/bounty\s+\$?([\d.]+)/);
          const amount = amountMatch ? parseFloat(amountMatch[1]) : null;

          if (!amount) {
            const issueComment = context.issue({
              body: `Please provide a valid amount. For example: /bounty $100`
            });
            await context.octokit.issues.createComment(issueComment);
            return;
          }
          
          const confirmBountyUrl = `https://gitearn.vercel.app/earn/transactions`;

          const issueComment = context.issue({
            body: `To confirm your bounty of 💰 $${amount}, please click the link below:

<a href="${confirmBountyUrl}" target="_blank">Confirm Bounty</a>`
          });
          await context.octokit.issues.createComment(issueComment);
          // console.log("i am here comment created");
        } else {
          console.log("i am here", false);
        }
  });


  // when /bounty is confirmed
  // [automatically from the gitearn platform]



  // when bounty is being cancelled
  app.on("issue_comment.created", async (context) => {
    const commentBody = context.payload.comment.body;
    // console.log("i am here", commentBody);

    const commenter = context.payload.comment.user.login;
    if (commentBody.startsWith("/cancel")) {
      console.log("i am here", true);
    // todo
    // make a db call to check if there is any bounty on that issue or not

    // if there is no bounty send a comment to the user that there is no bounty on this issue

    // coming from db
    const amount = 100;

    const issueComment = context.issue({
      body: `Bounty cancelled of $${amount} from this issue by @${commenter}`
    });

    await context.octokit.issues.createComment(issueComment);

    
  } else {
    console.log("i am here", false);
  }    
});


  // when the bounty is being assigned to a user
  app.on("issue_comment.created", async (context) => {
    const commentBody = context.payload.comment.body.trim();
    const issue = context.issue();
    const username = context.payload.comment.user.login;
  
    if (commentBody === "/attempt") {
      const issueData = await context.octokit.issues.get(issue);
      const currentAssignees = issueData.data.assignees;
  
      if (currentAssignees && currentAssignees.length > 0) {
        await context.octokit.issues.createComment({
          ...issue,
          body: `⛔ This issue is already being worked on by @${currentAssignees[0].login}.`,
        });
        return;
      }
  
      await context.octokit.issues.addAssignees({
        ...issue,
        assignees: [username],
      });
  
      await context.octokit.issues.createComment({
        ...issue,
        body: `✅ @${username} has been assigned to this issue.`,
      });
    }
  });


  // when the bounty is being Approved
  app.on("issue_comment.created", async (context) => {
    const commentBody = context.payload.comment.body.trim();
    const issue = context.issue();
    // const maintainer = context.payload.comment.user.login;
  
    if (commentBody.startsWith("/approve")) {
      const match = commentBody.match(/\/approve\s+@?([\w-]+)/);
  
      if (!match) {
        await context.octokit.issues.createComment({
          ...issue,
          body: "⚠️ Please mention the contributor like `/approve @username`.",
        });
        return;
      }
  
      const contributor = match[1];
  
      // TODO: Save to DB that this user has won the bounty
  
      await context.octokit.issues.createComment({
        ...issue,
        body: `🎉 Congratulations @${contributor}! This bounty has been awarded to you.  
   To claim your reward, please visit: [gitearn.vercel.app/earn/claim](https://gitearn.vercel.app/earn/claim)`,
      });
    }
  });  
  
};
