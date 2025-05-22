import { Probot } from "probot";

export default (app: Probot) => {

  // when issue is opened
  app.on("issues.opened", async (context) => {
    try {
      const issueComment = context.issue({
        body: "Thanks for opening this issue!",
      });
      await context.octokit.issues.createComment(issueComment);
    } catch (error) {
      console.error("Error in issues.opened:", error);
    }
  });

  // when /bounty issue comment is created
  app.on("issue_comment.created", async (context) => {
    try {
      const commentBody = context.payload.comment.body;
      if (commentBody.startsWith("/bounty")) {
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
      }
    } catch (error) {
      console.error("Error in bounty creation:", error);
    }
  });

  // when /bounty is confirmed
  // [automatically from the gitearn platform]

  // when bounty is being cancelled
  app.on("issue_comment.created", async (context) => {
    try {
      const commentBody = context.payload.comment.body;
      const commenter = context.payload.comment.user.login;
      
      if (commentBody.startsWith("/cancel")) {
        // todo
        // make a db call to check if there is any bounty on that issue or not

        // if there is no bounty send a comment to the user that there is no bounty on this issue

        // coming from db
        const amount = 100;

        const issueComment = context.issue({
          body: `Bounty cancelled of $${amount} from this issue by @${commenter}`
        });

        await context.octokit.issues.createComment(issueComment);
      }
    } catch (error) {
      console.error("Error in bounty cancellation:", error);
    }
  });

  // when the bounty is being assigned to a user
  app.on("issue_comment.created", async (context) => {
    try {
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
    } catch (error) {
      console.error("Error in attempt assignment:", error);
    }
  });

  // when the bounty is being Approved
  app.on("issue_comment.created", async (context) => {
    try {
      const commentBody = context.payload.comment.body.trim();
      const issue = context.issue();
    
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
    } catch (error) {
      console.error("Error in bounty approval:", error);
    }
  });

  // when a tip is being sent
  app.on("issue_comment.created", async (context) => {
    try {
      const commentBody = context.payload.comment.body.trim();
      const issue = context.issue();
      const sender = context.payload.comment.user.login;

      if (commentBody.startsWith("/tip")) {
        const tipMatch = commentBody.match(/^\/tip\s+\$?([\d.]+)\s+@?([\w-]+)/);
        
        if (!tipMatch) {
          await context.octokit.issues.createComment({
            ...issue,
            body: `⚠️ Please use the correct format: /tip $[amount] @[user]
Example: /tip $50 @username`
          });
          return;
        }

        const amount = parseFloat(tipMatch[1]);
        const recipient = tipMatch[2];

        if (!amount || amount <= 0) {
          await context.octokit.issues.createComment({
            ...issue,
            body: `⚠️ Please provide a valid amount greater than 0.`
          });
          return;
        }

        // TODO: Add DB integration to handle the tip transaction
        // TODO: Add validation for sender's balance
        // TODO: Add validation for minimum/maximum tip amounts
        // TODO: Add validation to ensure recipient exists

        await context.octokit.issues.createComment({
          ...issue,
          body: `💝 @${sender} has sent a tip of $${amount} to @${recipient}! 
To claim your tip, please visit: [gitearn.vercel.app/earn/claim](https://gitearn.vercel.app/earn/claim)`
        });
      }
    } catch (error) {
      console.error("Error in tip processing:", error);
    }
  });
};
