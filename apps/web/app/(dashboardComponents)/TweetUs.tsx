import React from "react";

const tweetTemplates = [
    "Open source just became a side hustle. GitEarn is the plug.",
    "Why code for free when GitEarn exists?",
    "GitHub issues, now with actual rewards. GitEarn makes sense.",
    "Saw a bug, fixed it, got paid. GitEarn delivers.",
    "This isn’t freelancing. It’s bounty hunting for builders — via GitEarn.",
    "Contributing to open source? Might as well earn while you're at it. GitEarn gets it.",
    "Proof that OSS and payments can co-exist. GitEarn nailed it.",
    "Code once. Get paid. Repeat. Found GitEarn at the right time.",
    "If GitHub had a reward system, it’d look like GitEarn.",
    "Forget internships. GitEarn pays for real contributions.",
    "The smartest way to build your GitHub and your wallet. GitEarn.",
    "Getting paid to improve open source. GitEarn makes too much sense.",
    "Open source incentives finally make sense thanks to GitEarn.",
    "This is how contribution should always feel — thanks GitEarn.",
    "Real impact. Real issues. Real payouts. GitEarn changed the game.",
  ];

const TweetUs = () => {
  const handleTweetClick = () => {
    const tweet = tweetTemplates[Math.floor(Math.random() * tweetTemplates.length)];
    const tweetText = encodeURIComponent(`${tweet}\n\nvia @gitearnhq\nhttps://gitearn.com`);
    const tweetURL = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(tweetURL, "_blank");
  };

  return (
    <div className="flex">
      <button
        onClick={handleTweetClick}
        className="group ml-2 flex h-[45px] cursor-pointer border border-white w-[45px] items-center justify-center overflow-hidden rounded-full bg-black transition-all duration-400 ease-in-out hover:w-[110px] hover:rounded-[30px]"
      >
        <span className="svgIcon text-xl text-white transition-opacity duration-300 group-hover:opacity-0">
          𝕏
        </span>
        <span className="absolute w-[120px] font-semibold text-white opacity-0 transition-opacity duration-400 group-hover:opacity-100">
          Tweet Us
        </span>
      </button>
    </div>
  );
};

export default TweetUs;
