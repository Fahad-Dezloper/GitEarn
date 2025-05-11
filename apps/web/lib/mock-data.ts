// Mock data for created bounties
export const mockCreatedBounties = {
    bounties: [
      {
        title: "#123 Fix login bug",
        htmlUrl: "https://github.com/org/repo/issues/123",
        status: "APPROVED",
        bountyAmount: 5000000000,
        claimedAmount: 5000000000,
        createdAt: "2024-04-12T10:30:00Z",
        transactions: [
          {
            type: "DEPOSIT",
            status: "CONFIRMED",
            amount: 5000000000,
            txnHash: "5gGkhY4VmZHqR3LG9j8tsjfNqUY2...",
          },
          {
            type: "CLAIM",
            status: "PENDING",
            amount: 5000000000,
            txnHash: "7sDfY98NnHf45vhbDfJK9gjsDf...",
          },
          {
            type: "PAYOUT",
            status: "CONFIRMED",
            amount: 5000000000,
            txnHash: "3jKHL5KJ38fJK2hfSd8H2Lsdf3...",
          },
        ],
      },
      {
        title: "#124 Implement dark mode",
        htmlUrl: "https://github.com/org/repo/issues/124",
        status: "ACTIVE",
        bountyAmount: 3000000000,
        claimedAmount: 0,
        createdAt: "2024-04-15T14:20:00Z",
        transactions: [
          {
            type: "DEPOSIT",
            status: "CONFIRMED",
            amount: 3000000000,
            txnHash: "8hJklM9NbVcX3Z4y5W6uT7sR8q...",
          },
        ],
      },
      {
        title: "#125 Add mobile responsiveness",
        htmlUrl: "https://github.com/org/repo/issues/125",
        status: "CLAIMING",
        bountyAmount: 2500000000,
        claimedAmount: 2500000000,
        createdAt: "2024-04-18T09:45:00Z",
        transactions: [
          {
            type: "DEPOSIT",
            status: "CONFIRMED",
            amount: 2500000000,
            txnHash: "9jKlM8NbVcX3Z4y5W6uT7sR8q...",
          },
          {
            type: "CLAIM",
            status: "CONFIRMED",
            amount: 2500000000,
            txnHash: "2kLmN9OpQrS7tU8vW9xY1zAb...",
          },
        ],
      },
      {
        title: "#126 Fix security vulnerability",
        htmlUrl: "https://github.com/org/repo/issues/126",
        status: "PENDING",
        bountyAmount: 7000000000,
        claimedAmount: 0,
        createdAt: "2024-04-20T16:30:00Z",
        transactions: [
          {
            type: "DEPOSIT",
            status: "PENDING",
            amount: 7000000000,
            txnHash: "3lMnO0PqRs8tU9vW0xY2zA3b...",
          },
        ],
      },
    ],
  }
  
  // Mock data for claimed bounties
  export const mockClaimedBounties = {
    claimed: [
      {
        title: "#456 Add dark mode",
        htmlUrl: "https://github.com/org/repo/issues/456",
        status: "CLAIMED",
        claimedAmount: 3000000000,
        contributorClaimedAdd: "4MySolanaAddress1234...",
        createdAt: "2024-03-22T09:00:00Z",
        transactions: [
          {
            type: "CLAIM",
            status: "CONFIRMED",
            amount: 3000000000,
            txnHash: "Dx9sdHgjfd89sfs8sdjf...",
          },
          {
            type: "PAYOUT",
            status: "CONFIRMED",
            amount: 3000000000,
            txnHash: "Ty91gFjsfdHgk29fsLkF...",
          },
        ],
      },
      {
        title: "#457 Implement authentication",
        htmlUrl: "https://github.com/org/repo/issues/457",
        status: "APPROVED",
        claimedAmount: 5000000000,
        contributorClaimedAdd: "5MySolanaAddress5678...",
        createdAt: "2024-03-25T11:30:00Z",
        transactions: [
          {
            type: "CLAIM",
            status: "CONFIRMED",
            amount: 5000000000,
            txnHash: "Ez0tfIkgfe90tgt9tekf...",
          },
          {
            type: "PAYOUT",
            status: "CONFIRMED",
            amount: 5000000000,
            txnHash: "Uz1uhGktsfdIgk30gtLkG...",
          },
        ],
      },
      {
        title: "#458 Fix API integration",
        htmlUrl: "https://github.com/org/repo/issues/458",
        status: "CLAIMING",
        claimedAmount: 2500000000,
        contributorClaimedAdd: "6MySolanaAddress9012...",
        createdAt: "2024-04-01T14:15:00Z",
        transactions: [
          {
            type: "CLAIM",
            status: "PENDING",
            amount: 2500000000,
            txnHash: "Fa1viJlhtge01uhu0ufli...",
          },
        ],
      },
    ],
  }
  