<></>
import testbild from '../assets/testbild.jpg';
import './Card.css'
function Card() {
    return (
        <>
        <div className='bg-[#1B2838] w-[1235px] h-[305px] rounded-[60px] pt-[1px]'>
            <img src={testbild} alt='test' className='w-[396px] h-[268px] rounded-bl-[50px] rounded-tl-[50px] rounded-tr-[10px] rounded-br-[10px] mt-[17px] ml-[22px]'></img>
             <div>
                <p className='bg-[#66C0F4] h-[58px] w-[289px]'></p>

             </div>
        </div>
       </>
    );
}
export default Card;
