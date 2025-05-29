import React from 'react';

const Earning = () => {
  return (
    <div className="flex  items-center">
      <button
        className="relative flex items-center gap-1 px-9 py-2 border-4 border-transparent text-[16px] bg-transparent rounded-full font-semibold text-green-400 shadow-[0_0_0_2px_rgb(74,222,128)] cursor-pointer overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_0_0_12px_transparent] hover:rounded-[12px] active:scale-[0.95] active:shadow-[0_0_0_4px_greenyellow] group"
      >
        {/* arr-2 */}
        <svg
          viewBox="0 0 24 24"
          className="absolute w-6 fill-green-400 z-[9] left-[-25%] transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:left-4 group-hover:fill-[#fff]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>

        <span className="relative z-[1] transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] -translate-x-3 group-hover:translate-x-3 group-hover:text-[#fff]">
          Start Earning
        </span>

        {/* circle */}
        <span className="absolute top-1/2 left-1/2 w-5 h-5 bg-green-500 rounded-full opacity-0 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100" />

        {/* arr-1 */}
        <svg
          viewBox="0 0 24 24"
          className="absolute w-6 fill-green-400 z-[9] right-4 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:right-[-25%] group-hover:fill-[#212121]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
      </button>
    </div>
  );
};

export default Earning;
