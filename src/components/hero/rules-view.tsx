"use client";

export default function RulesView() {
  const rules = [
    {
      title: "1. Discord guidelines",
      content:
        "The Discord Community Guidelines apply to Programming [DE / EN]; users can view these at https://discord.com/guidelines.",
    },
    {
      title: "2. Language",
      content:
        "The language of our community is German and English. In the voice channel, “Public [DE]” German is the primary language. Users can speak English voluntarily. However, users must speak English in the Voice Channel “Public [EN]”.",
    },
    {
      title: "3. Asking questions",
      content: `3.1 Nobody is obliged to help or answer a question. Help is generally free of charge.  
3.2 Members with the role of “HELPER” have volunteered to help with questions.  
3.3 Pinging members to expect a faster response is not allowed.  
3.4 Don't ask questions like “Does anyone know about XY?” ask the question directly, see also ➔ https://dontasktoask.com/.  
3.5 Note the thread “How do I ask a good question?” on Stackoverflow ➔ https://stackoverflow.com/help/how-to-ask.`,
    },
    {
      title: "4. Recording",
      content:
        "The recording of videos (screen sharing, webcam) and sound (voice chat) is not permitted on this Discord.",
    },
    {
      title: "5. Advertising",
      content: "Any kind of third-party advertising is prohibited.",
    },
    {
      title: "6. Moderators",
      content:
        "The moderation team has the right to take appropriate actions against a user, even if a certain rule has not been explicitly violated.",
    },
    {
      title: "7. Direct messages",
      content: "Please refrain from sending direct messages to the administrators.",
    },
    {
      title: "8. Dissemination of personal information",
      content:
        "Dissemination of other people's personal information of any kind without their consent is prohibited and will result in a permanent ban.",
    },
    {
      title: "9. Enforcement of a measure",
      content:
        "The interpretation of the rules is at the discretion of the respective administrator.",
    },
    {
      title: "10. AI Use / Spam / Job listings",
      content:
        "The use of AI to make job listings or other spam content is not permitted. Users found doing so will be jailed, muted, or banned.",
    },
    {
      title: "11. Fake Skills / Code Stacks",
      content:
        "Falsely claiming to have skills or experience for the purpose of scamming or obtaining jobs is prohibited. Users must be able to prove their skills.",
    },
    {
      title: "12. No DM",
      content:
        "No direct messages without previous authorization. If someone reports you, you may be muted or restricted.",
    },
  ];

  return (
    <div className="min-h-screen w-full absolute left-0 z-10 top-30 text-white">
      <div className="px-4 sm:px-6 pb-8 max-w-5xl mx-auto">
        {/* <h1 className="text-3xl font-bold text-red-500 text-center py-6">
          📜 Community Guidelines
        </h1> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="  border backdrop-blur-2xl border-red-800   rounded-xl p-5 shadow-md hover:shadow-lg transition duration-300"
            >
              <h2 className="text-lg font-semibold text-red-400 mb-2">
                {rule.title}
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {rule.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
