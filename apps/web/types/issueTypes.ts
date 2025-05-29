/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/issueTypes.ts

// Represents a label as received from the GitHub API
export interface GitHubLabel {
    name: string;
    color?: string; // Optional: GitHub provides color hex codes
    description?: string | null; // Optional: GitHub provides description
}

// Represents an issue fetched directly from GitHub API (via your issuesRepo data)
// Tailored for the "Add Bounty" view
export interface AddBountyIssue {
    id: number; // GitHub's numeric issue ID
    number: number; // GitHub's issue number within the repo
    title: string;
    html_url: string; // URL to the issue page on GitHub
    state: "open" | "closed"; // GitHub issue state
    created_at: string; // ISO 8601 date string
    updated_at: string; // ISO 8601 date string
    body?: string | null; // Issue description (can be null or empty)
    labels: GitHubLabel[]; // Array of label objects from GitHub
    repository: string; // Original simple repo name from GitHub data structure
    repositoryName: string; // Added in parent: Simple repo name (e.g., "Crowdify")
    repositoryFullName: string; // Added in parent: Full name (e.g., "Fahad-Dezloper/Crowdify")
    labelNames: string[]; // Added in parent: Just the names of the labels
    assignees?: any[]; // Optional: Add if you need assignee info
    // Include other fields from your `issuesRepo.issues` structure if needed
    // e.g., prRaised, latestComment, activityLog etc.
}

// Represents an issue that already has a bounty, fetched from your database (userBountyIssue data)
// Tailored for the "Manage Bounty" view
export interface ManageBountyIssue {
    repository: any;
    labelNames: any;
    id: string; // Your database's unique ID for the bounty record
    userId: string; // Your database's user ID
    githubId: string; // GitHub's issue ID (stored as string in your example data)
    htmlUrl: string; // URL to the issue page on GitHub
    bounty: number; // The bounty amount
    createdAt: string; // ISO 8601 date string from your database (when bounty was created)
    updatedAt: string; // ISO 8601 date string from your database
    title: string; // Issue title (likely fetched/stored when bounty was added)
    repo: string; // Repository name (e.g., "Fahad-Dezloper/Crowdify")
    tags: string[]; // Labels/Tags associated with the bounty in your system
    posted: string; // Pre-formatted date string from your data (e.g., "25/4/2025")
    createdAtDate: Date; // Added in parent: Parsed Date object from createdAt
    // Include other fields from your `userBountyIssue` structure if needed
}

/**
 * Type guard function to determine if an issue object is of type AddBountyIssue.
 * It checks for properties unique to the AddBountyIssue structure
 * (like `repositoryName` which we added during data prep, or `labels` being an array of objects).
 * @param issue - The issue object to check.
 * @returns True if the object conforms to the AddBountyIssue interface, false otherwise.
 */
export function isAddBountyIssue(issue: any): issue is AddBountyIssue {
    // Check for properties specific to AddBountyIssue that are less likely
    // to accidentally exist on ManageBountyIssue with the same name and type.
    return (
        issue &&
        typeof issue.id === 'number' && // GitHub IDs are numbers
        typeof issue.repositoryName === 'string' &&
        Array.isArray(issue.labels) &&
        (issue.labels.length === 0 || typeof issue.labels[0] === 'object') && // Check if labels is array of objects
        typeof issue.state === 'string' // 'state' exists on GitHub issues
    );
}

// You can also add a type guard for ManageBountyIssue if needed, though
// checking !isAddBountyIssue might be sufficient in a context where you know
// it must be one of the two types.
// export function isManageBountyIssue(issue: any): issue is ManageBountyIssue {
//     return (
//         issue &&
//         typeof issue.bounty === 'number' &&
//         typeof issue.githubId === 'string' && // stored as string in example
//         typeof issue.repo === 'string' &&
//         Array.isArray(issue.tags) &&
//         (issue.tags.length === 0 || typeof issue.tags[0] === 'string') // tags are array of strings
//     );
// }