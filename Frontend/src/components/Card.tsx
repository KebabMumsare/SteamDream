import testbild from '../assets/testbild.jpg';
import apple from '../assets/Icons/apple.png';
import windows from '../assets/Icons/windows.png';
import star from '../assets/Icons/star.png';
import './Card.css';

function Card() {

  return (
  <div className="mt-6 w-full mx-auto max-w-[1300px] bg-[#1B2838] rounded-[40px] p-4 md:p-6 grid gap-8
          sm:grid-cols-1 md:grid-cols-[340px_1fr] lg:grid-cols-[340px_1fr_400px]">
      <div className="relative aspect-[16/10] rounded-[32px] overflow-hidden bg-black/30">
        <img src={testbild} alt="Game artwork" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-4">
          <h2 className="bg-[#66C0F4] font-mono font-semibold text-xl md:text-3xl
                         rounded-tr-[16px] rounded-br-[16px] rounded-bl-[16px] rounded-tl-[16px]
                         px-6 h-[58px] flex items-center w-max shadow-sm text-white">
            PAYDAY 3
          </h2>
          <img src={star} alt="Featured" className="w-10 h-10 object-contain drop-shadow-md bg-[#66C0F4] h-[58px] rounded-tr-[44px] rounded-br-[44px] rounded-bl-[16px] rounded-tl-[16px] w-[60px]" />
        </div>
        <div className="mt-5 flex flex-row items-end gap-8">
          <div className="flex flex-col items-start leading-none">
            <span className="font-mono line-through text-sm md:text-base opacity-70 tracking-wide">19,99$</span>
            <span className="font-mono text-2xl md:text-3xl text-white mt-1">10,00$</span>
          </div>
          <span className="font-mono bg-[#44CE3F] text-white rounded-md px-4 py-2 text-sm md:text-base leading-none shadow self-start">
            -50%
          </span>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-5">
          <div className="inline-flex items-center font-mono text-xs md:text-sm text-white bg-[#66C0F4]
                          rounded-lg px-4 py-2 font-semibold w-max shadow">
            Strategy & Action
          </div>
          <div className="flex items-center gap-4">
            <img src={windows} alt="Windows" className="w-8 h-8 object-contain" />
            <img src={apple} alt="Apple" className="w-8 h-8 object-contain" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="px-3 py-1 rounded-md bg-[#44CE3F]/15 text-[#44CE3F] font-mono text-xs md:text-sm tracking-wide">Co-op</span>
          <span className="px-3 py-1 rounded-md bg-[#44CE3F]/15 text-[#44CE3F] font-mono text-xs md:text-sm tracking-wide">FPS</span>
          <span className="px-3 py-1 rounded-md bg-[#44CE3F]/15 text-[#44CE3F] font-mono text-xs md:text-sm tracking-wide">Online</span>
        </div>
      </div>
      <div className="flex flex-col gap-5 lg:pl-2">
        <div className="relative font-mono text-white/90 bg-[#22394d]/70 backdrop-blur-sm border border-white/10
                        rounded-2xl p-5 md:p-6 text-sm md:text-base leading-relaxed shadow-inner shadow-black/40
                        max-h-[400px] overflow-auto scrollbar-thin scrollbar-thumb-[#66C0F4]/25 scrollbar-track-transparent">
          <div className="absolute inset-0 pointer-events-none rounded-2xl bg-[#66C0F4]" />
          <p className="relative z-10">
            hbvhfbv tert brtb rb rb r b rb ry brbrbr br br ry bry bry ry b rb r ybn r nrf yb r nr n ry nr n ryh br6 h r6 ry bry r nr h r nr nr n r nr n hbvhfbv tert brtb rb rb r b rb ry brbrbr br br ry bry bry ry b rb r ybn r nrf yb r nr n ry nr n ryh br6 h r6 ry bry  r nr h r nr nr n r nr n
          </p>
        </div>
      </div>
    </div>
  );

}

export default Card;
