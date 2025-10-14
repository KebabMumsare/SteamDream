import testbild from '../assets/testbild.jpg';

function game() {
  function steamsite() {
    window.open("https://store.steampowered.com/app/1272080/PAYDAY_3/", "_blank");
  }

  return (
    <div
      onClick={steamsite}
      className="cursor-pointer hover:scale-[1.01] transition-transform mt-4 w-[85%] mx-auto max-w-[800px] bg-[#1B2838] rounded-[16px] p-2 md:p-3 grid gap-4 sm:grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[250px_1fr_300px]"
    >
      {/* Image */}
      <div
        className="relative rounded-[16px] overflow-hidden bg-black/30"
        style={{ width: '305px', height: '205px' }} // Image size remains the same
      >
        <img src={testbild} alt="Game artwork" className="w-full h-full object-cover" />
      </div>

      {/* Main content */}
      <div className="flex flex-col gap-2">
        {/* Title */}
        <div
          className="flex items-center gap-1.5"
          style={{ transform: 'translateX(50px)' }} // Moves the title further to the right
        >
          <h2 className="bg-[#66C0F4] font-mono font-semibold text-sm md:text-base rounded-[10px] px-2 h-[36px] flex items-center w-max text-white shadow-sm">
            PAYDAY 3
          </h2>
        </div>

        {/* Description panel */}
        <div
          className="relative font-mono text-white/90 bg-[#66C0F4] backdrop-blur-sm border border-white/10 rounded-lg p-2 md:p-3 text-[10px] md:text-[11px] leading-relaxed shadow-inner shadow-black/40 max-h-[200cdpx] overflow-auto scrollbar-thin scrollbar-thumb-[#66C0F4]/25 scrollbar-track-transparent mt-2"
          style={{ transform: 'translateX(50px)', width: '450px' }} // Increased height for the control panel
        >
          <div className="absolute inset-0 pointer-events-none rounded-lg bg-[#66C0F4]/5" />
          <p className="relative z-10">
            Payday 3 är ett förstapersonsskjutspel med starkt fokus på samarbete och strategi, där du tillsammans med upp till tre andra spelare utför avancerade rån. Spelet är en direkt uppföljare till Payday 2 och fortsätter berättelsen om det ökända Payday-gänget, som efter att ha försökt lämna det kriminella livet tvingas tillbaka in i brottets värld. Handlingen utspelar sig i en modern miljö, främst i New York, där nya säkerhetssystem, övervakning och teknologi spelar en större roll än i tidigare delar.
          </p>
        </div>
      </div>
    </div>
  );
}

export default game;
