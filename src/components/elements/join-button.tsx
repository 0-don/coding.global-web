"use client";

export function JoinButton() {
  const openDiscord = async () => {
    window.open(
      "https://discord.com/invite/coding",
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="absolute right-0 -bottom-30 left-0 z-10 flex items-center justify-center">
      <button
        onClick={openDiscord}
        className="focus:ring-opacity-50 transform rounded-full border-2 border-red-500 bg-transparent px-8 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-red-500 hover:text-black focus:ring-2 focus:ring-red-400 focus:outline-none"
      >
        Join
      </button>
    </div>
  );
}
