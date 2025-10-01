<></>
import testbild from '../assets/testbild.jpg';
import apple from '../assets/Icons/apple.png';
import windows from '../assets/Icons/windows.png';
import star from '../assets/Icons/star.png';
import './Card.css'
function Card() {
    return (
        <>
        <div className='mt-[10px] bg-[#1B2838] w-[1035px] h-[255px] rounded-[60px] pt-[1px] grid grid-cols-[<div className="grid grid-cols-[336px_1fr_450px] ...">]'>
            <img src={testbild} alt='test' className='w-[336px] h-[218px] rounded-bl-[50px] rounded-tl-[50px] rounded-tr-[10px] rounded-br-[10px] mt-[17px] ml-[22px] flex-auto'></img>
             <div className='ml-[17px]'>
                <p className='bg-[#66C0F4] mt-[17px] h-[38px] w-[200px] ml-[22px] rounded-br-[60px] rounded-tr-[60px] rounded-tl-[10px] rounded-bl-[10px] font-mono text-3xl text-left pl-[8px] flex-auto '>PAYDAY 3</p>
                <p className='font-mono flex-auto w-[60px] h-[30] line-through ml-[130px]'>19,99$</p>
                <div className='flex items-center gap-3 ml-[22px]' >
              <div className=' flex items-center gap-3'>
                <span className='font-mono bg-[#44CE3F] rounded-[5px] text-xl px-3 py-1 leading-none shrink-0 text-white'>-50%</span>
                <span className='ml-[30px] font-mono text-2xl leading-none text-white'>10,00$</span>
              </div>
              </div>
              <span className='flex items-center font-mono text-base text-white bg-[#66C0F4] rounded-[10px] p-[5px] mt-[15px] w-[200px] ml-[22px] h-[40px] font-bold'>Strategi and Action</span>
              <div className='mt-2 flex items-center gap-1 ml-[22px]'>
                <img src={windows} alt="windowslogo" className='w-[61px] h-[61px]' />
                <img src={apple} alt="applelogo" className='w-[61px] h-[61px]' />
                 </div>
             </div>
             <div>
                <img src={star} alt="starlogo" className='float-right mr-[22px] w-[51px] h-[51px] mt-[17px] bg-[#66C0F4] rounded-bl-[10px] rounded-br-[10px] rounded-tr-[50px] rounded-tl-[10px]' />
                <p className='font-mono text-white bg-[#66C0F4] rounded-bl-[10px] rounded-br-[50px] rounded-tr-[10px] rounded-tl-[10px] mt-[80px] mr-[22px] h-[150px] text-left pl-[5px] pr-[5px]'>hbvhfbv tert brtb rb rb r b rb ry brbrbr br br ry bry bry ry b rb r ybn r nrf yb r nr n ry nr n ryh br6 h r6 ry bry  r nr h r nr nr n r nr n</p>
                
                </div>
        </div>
       </>
    );
}
export default Card;
