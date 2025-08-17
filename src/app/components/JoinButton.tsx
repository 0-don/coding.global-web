"use client";
export default function JoinButton() {
  const openDiscord = async () => {

      window.open("https://discord.com/invite/coding", "_blank", "noopener,noreferrer");
   
  };

  return (
    <div className="absolute -bottom-30 left-0 right-0 flex justify-center items-center z-10">
      <button
        onClick={openDiscord}
        className="bg-transparent border-2 border-red-500 hover:bg-red-500 hover:text-black text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
      >
        Join
      </button>
    </div>
  );
}