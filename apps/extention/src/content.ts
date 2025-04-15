/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

// This script runs in the context of the GitHub page

// Function to inject our React app container
function injectReactApp() {
  // ✅ 1. Ensure we're on an issue page like /user/repo/issues/123
  const isIssuePage = /^\/[^/]+\/[^/]+\/issues\/\d+/.test(location.pathname);
  if (!isIssuePage) return;

  // console.log("issue page");
  // ✅ 2. Try to find a reliable container for the bounty button
  const issueHeaderActions =
    document.querySelector('.Box-sc-g0xbh4-0.bKeiGd.prc-PageHeader-Actions-ygtmj') || // More stable selector
    document.querySelector('[aria-label="Select milestone"]')?.closest('div'); // Fallback option

  if (!issueHeaderActions) return;

  // console.log("got the div");

  // ✅ 3. Prevent multiple injections
  if (document.getElementById('github-bounty-button-container')) return;

  // ✅ 4. Create containers
  const bountyButtonContainer = document.createElement('div');
  bountyButtonContainer.id = 'github-bounty-button-container';
  bountyButtonContainer.style.marginRight = '8px';

  // console.log("button created");

  const popupContainer = document.createElement('div');
  popupContainer.id = 'github-bounty-popup-container';

  // console.log("popup created");

  // ✅ 5. Inject containers into the page
  issueHeaderActions.prepend(bountyButtonContainer);
  document.body.appendChild(popupContainer);

  // ✅ 6. Inject the React component script
  injectScript((window as any).chrome.runtime.getURL('src/injectApp.js'));
}

// Helper function to inject a script into the page
// @ts-ignore
function injectScript(src: string) {
  const script = document.createElement('script');
  script.src = src;
  script.type = 'module';
  document.head.appendChild(script);
}

// ✅ Run when the page loads (first time)
window.addEventListener('load', () => {
  setTimeout(injectReactApp, 1000); // slight delay for GitHub's SPA to settle
});

// ✅ Handle SPA navigation with MutationObserver
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      setTimeout(injectReactApp, 500); // short delay to allow DOM updates
    }
  }
});

// Start observing for page changes
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
