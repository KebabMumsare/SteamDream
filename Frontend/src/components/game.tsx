import testbild from '../assets/testbild.jpg';

function game() {
 
  return (
    <div
      className="cursor-pointer hover:scale-[1.01] transition-transform mt-4 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] min-[1000px]:max-w-[1000px] mx-auto bg-[#1B2838] rounded-[16px] p-3 md:p-4 flex flex-col md:flex-row gap-3 md:gap-4"
    >
      {/* Image - shows at top on mobile/tablet, left on desktop < 1000px */}
      <div className="relative w-full md:w-[250px] min-[1000px]:hidden aspect-[3/2] md:aspect-auto md:h-[170px] rounded-[16px] overflow-hidden bg-black/30 flex-shrink-0">
        <img src={testbild} alt="Game artwork" className="w-full h-full object-cover" />
      </div>

      {/* Main content */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {/* Description and Image wrapper for > 1000px */}
        <div className="flex flex-col min-[1000px]:flex-row gap-3 min-[1000px]:gap-4">
          {/* Image - shows beside description on screens > 1000px (LEFT SIDE) */}
          <div className="hidden min-[1000px]:block relative w-[305px] h-[205px] rounded-[16px] overflow-hidden bg-black/30 flex-shrink-0">
            <img src={testbild} alt="Game artwork" className="w-full h-full object-cover" />
          </div>

          {/* Title and Description wrapper */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            {/* Title */}
            <div className="flex items-center gap-1.5">
              <h2 className="bg-[#66C0F4] font-mono font-semibold text-sm md:text-base lg:text-lg rounded-[10px] px-3 py-2 md:h-[36px] flex items-center w-max text-white shadow-sm">
                PAYDAY 3
              </h2>
            </div>

            {/* Description panel */}
            <div className="relative font-mono text-white/90 bg-[#66C0F4] backdrop-blur-sm border border-white/10 rounded-lg p-3 md:p-4 text-[11px] md:text-xs lg:text-sm leading-relaxed shadow-inner shadow-black/40 max-h-[150px] sm:max-h-[180px] md:max-h-[200px] max-w-[630px] overflow-auto scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-white/10 md:scrollbar-none">
              <div className="absolute inset-0 pointer-events-none rounded-lg bg-[#66C0F4]/5" />
              <p className="relative z-10">
                Payday 3 är ett förstapersonsskjutspel med starkt fokus på samarbete och strategi, där du tillsammans med upp till tre andra spelare utför avancerade rån. Spelet är en direkt uppföljare till Payday 2 och fortsätter berättelsen om det ökända Payday-gänget, som efter att ha försökt lämna det kriminella livet tvingas tillbaka in i brottets värld. Handlingen utspelar sig i en modern miljö, främst i New York, där nya säkerhetssystem, övervakning och teknologi spelar en större roll än i tidigare delar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default game;
