import { Probot } from "probot";
import { addBounty, approveBounty, cancelBounty, isMaintainer, TipUser } from "./utils.js";

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

  // Help command handler
  app.on("issue_comment.created", async (context) => {
    const issue = context.issue();
    try {
      const commentBody = context.payload.comment.body.trim();
      
      if (commentBody === "/help") {
        const isUserMaintainer = await isMaintainer(
          context,
          context.payload.comment.user.id,
          context.payload.repository.owner.login,
          context.payload.repository.name
        );

        const maintainerCommands = `
**Maintainer Commands:**
- \`/bounty $[amount]\` - Create a new bounty
- \`/cancel\` - Cancel an active bounty
- \`/approve @username\` - Approve a bounty for a contributor`;

        const contributorCommands = `
**Contributor Commands:**
- \`/attempt\` - Start working on a bounty
- \`/tip $[amount] @username\` - Send a tip to another user`;

        const helpMessage = isUserMaintainer 
          ? `Here are all available commands:${maintainerCommands}${contributorCommands}`
          : `Here are the commands you can use:${contributorCommands}`;

        await context.octokit.issues.createComment({
          ...issue,
          body: helpMessage
        });
      }
    } catch (error) {
      console.error("Error in help command:", error);
    }
  });

  // when /bounty issue comment is created
  app.on("issue_comment.created", async (context) => {
    const issue = context.issue();
    try {
      const commentBody = context.payload.comment.body;
      if (commentBody.startsWith("/bounty")) {
        // Check if user is maintainer
        const isUserMaintainer = await isMaintainer(
          context,
          context.payload.comment.user.id,
          context.payload.repository.owner.login,
          context.payload.repository.name
        );

        if (!isUserMaintainer) {
          await context.octokit.issues.createComment({
            ...issue,
            body: "⛔ Only repository maintainers can create bounties."
          });
          return;
        }

        const amountMatch = commentBody.match(/^\/bounty\s+\$?([\d.]+)/);
        const amount = amountMatch ? parseFloat(amountMatch[1]) : null;

        if (!amount) {
          await context.octokit.issues.createComment({
            ...issue,
            body: `⚠️ Please provide a valid amount. For example: /bounty $100`
          });
          return;
        }

        // db call
        const databaseCall = await addBounty(
          context.payload.comment.user.id,
          context.payload.issue.id,
          context.payload.issue.html_url,
          amount
        );

        if (!databaseCall.success) {
          await context.octokit.issues.createComment({
            ...issue,
            body: `❌ ${databaseCall.message}`
          });
          return;
        }

        const confirmBountyUrl = `https://gitearn.vercel.app/earn/transactions`;

        await context.octokit.issues.createComment({
          ...issue,
          body: `To confirm your bounty of 💰 $${amount}, please click the link below:

<a href="${confirmBountyUrl}" target="_blank">Confirm Bounty</a>`
        });
      }
    } catch (error) {
      console.error("Error in bounty creation:", error);
      await context.octokit.issues.createComment({
        ...issue,
        body: "❌ An error occurred while creating the bounty. Please try again later."
      });
    }
  });

  // when /bounty is confirmed
  // [automatically from the gitearn platform]

  // when bounty is being cancelled
  app.on("issue_comment.created", async (context) => {
    const issue = context.issue();
    try {
      const commentBody = context.payload.comment.body;
      if (commentBody.startsWith("/cancel")) {
        // Check if user is maintainer
        const isUserMaintainer = await isMaintainer(
          context,
          context.payload.comment.user.id,
          context.payload.repository.owner.login,
          context.payload.repository.name
        );

        if (!isUserMaintainer) {
          await context.octokit.issues.createComment({
            ...issue,
            body: "⛔ Only repository maintainers can cancel bounties."
          });
          return;
        }

        // Fetch current assignees
        const issueData = await context.octokit.issues.get(issue);
        const currentAssignees = issueData.data.assignees;

        if (currentAssignees && currentAssignees.length > 0) {
          await context.octokit.issues.createComment({
            ...issue,
            body: `⛔ Bounty can't be cancelled until all assignees are removed from this issue.`
          });
          return;
        }

        const result = await cancelBounty(
          context.payload.issue.id, 
          context.payload.issue.html_url,  
          context.payload.comment.user.id
        );

        if (!result.success) {
          await context.octokit.issues.createComment({
            ...issue,
            body: `⚠️ ${result.message}`
          });
          return;
        }

        if (!result.data?.bountyAmount) {
          await context.octokit.issues.createComment({
            ...issue,
            body: "❌ An error occurred while processing the bounty amount. Please try again later."
          });
          return;
        }

        const issueComment = context.issue({
          body: `✅ Bounty of $${result.data.bountyAmount} has been cancelled by @${context.payload.comment.user.login}

To transfer the cancelled bounty amount to your wallet, please visit:
[gitearn.vercel.app/earn/transactions](https://gitearn.vercel.app/earn/transactions)`
        });

        await context.octokit.issues.createComment(issueComment);
      }
    } catch (error) {
      console.error("Error in bounty cancellation:", error);
      await context.octokit.issues.createComment({
        ...issue,
        body: "❌ An error occurred while processing the bounty cancellation. Please try again later."
      });
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
    const issue = context.issue();
    try {
      const commentBody = context.payload.comment.body.trim();
    
      if (commentBody.startsWith("/approve")) {
        // Check if user is maintainer
        const isUserMaintainer = await isMaintainer(
          context,
          context.payload.comment.user.id,
          context.payload.repository.owner.login,
          context.payload.repository.name
        );

        if (!isUserMaintainer) {
          await context.octokit.issues.createComment({
            ...issue,
            body: "⛔ Only repository maintainers can approve bounties."
          });
          return;
        }

        const match = commentBody.match(/\/approve\s+@?([\w-]+)/);
    
        if (!match) {
          await context.octokit.issues.createComment({
            ...issue,
            body: "⚠️ Please mention the contributor like `/approve @username`.",
          });
          return;
        }
    
        const contributor = match[1];
        
        // Get current assignees
        const issueData = await context.octokit.issues.get(issue);
        const currentAssignees = issueData.data.assignees;

        if (!currentAssignees || currentAssignees.length === 0) {
          await context.octokit.issues.createComment({
            ...issue,
            body: `⚠️ No one is currently assigned to this issue. Please assign @${contributor} to this issue first.`,
          });
          return;
        }

        const currentAssignee = currentAssignees[0].login;
        if (currentAssignee !== contributor) {
          await context.octokit.issues.createComment({
            ...issue,
            body: `⚠️ @${contributor} is not currently assigned to this issue. Please assign them first before approving.`,
          });
          return;
        };

        
    
        // TODO: Save to DB that this user has won the bounty
        // Get contributor's GitHub ID
        const contributorData = await context.octokit.users.getByUsername({
          username: contributor
        });
        
        const databaseCall = await approveBounty(
          context.payload.issue.id, 
          context.payload.issue.html_url,
          contributorData.data.id
        );

        if (!databaseCall.success) {
          await context.octokit.issues.createComment({
            ...issue,
            body: `❌ ${databaseCall.message}`
          });
          return;
        }

        if (!databaseCall.data?.bountyAmount) {
          await context.octokit.issues.createComment({
            ...issue,
            body: "❌ An error occurred while processing the bounty amount. Please try again later."
          });
          return;
        }
        
        await context.octokit.issues.createComment({
          ...issue,
          body: `🎉 Congratulations @${contributor}! This bounty of $${databaseCall.data.bountyAmount} has been awarded to you.  
   To claim your reward, please visit: [gitearn.vercel.app/earn/claim](https://gitearn.vercel.app/earn/claim)`,
        });
      }
    } catch (error) {
      console.error("Error in bounty approval:", error);
      await context.octokit.issues.createComment({
        ...issue,
        body: "❌ An error occurred while processing the bounty approval. Please try again later."
      });
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
        };

        // Get sender's GitHub ID
        const senderData = await context.octokit.users.getByUsername({
          username: sender
        });

        // Get recipient's GitHub ID
        const recipientData = await context.octokit.users.getByUsername({
          username: recipient
        });

        const databaseCall = await TipUser(
          context.payload.issue.id,
          context.payload.issue.html_url,
          senderData.data.id,
          recipientData.data.id,
          amount
        );

        if (!databaseCall.success) {
          await context.octokit.issues.createComment({
            ...issue,
            body: `❌ ${databaseCall.message}`
          });
          return;
        }

        await context.octokit.issues.createComment({
          ...issue,
          body: `💝 @${sender} has sent a tip of $${amount} to @${recipient}! 
To complete your tip payment, please visit: [gitearn.vercel.app/earn/transactions](https://gitearn.vercel.app/earn/transactions)`
        });
      }
    } catch (error) {
      console.error("Error in tip processing:", error);
    }
  });
};

