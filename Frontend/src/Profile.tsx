import Card from './components/Card';

function Profile() {
    return (
        <>
            <main className="flex flex-row gap-[3rem] h-[calc(100vh)] w-full pt-[14%] overflow-hidden">
                <section className="bg-[#1B2838] w-1/3 p-4 rounded-tr-[60px]">
                    <h2 className="underline font-mono text-4xl pb-[20px]">Main Settings:</h2>
                    <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] mt-[15px] hover:scale-105 hover:bg-[#2979A8] font-mono text-xl pl-[20px] flex items-center gap-2 bg-[#66C0F4] rounded-full p-2">Color-scheme: <img src="/src/assets/Icons/colorscheme.png" alt="Color Scheme" className="w-[51px] h-[35px]" /></button>
                    <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] w-[230px] mt-[20px] hover:scale-105 hover:bg-[#2979A8] font-mono text-xl pl-[20px] flex items-center gap-2 bg-[#66C0F4] rounded-full p-2">Font-family: <img src="/src/assets/Icons/Font.png" alt="Color Scheme" className="w-[35px] h-[35px]" /></button>
                    <h2 className="underline font-mono text-3xl pb-[20px] pt-[50px]">Login:</h2>
                    <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] w-[230px] mt-[20px] hover:scale-105 hover:bg-[#661C1D] font-mono text-xl flex items-center justify-center gap-2 bg-[#B73234] rounded-full p-2">Log-out <img src="/src/assets/Icons/Logout.svg" alt="Color Scheme" className="w-[35px] h-[35px]" /></button>
                    
                </section>
                <section className="z-50 flex-1 p-0 h-[calc(100vh-15%)] overflow-y-auto">
                    <div className="sticky top-0 z-[48] bg-[#004E7B]">
                        <h1 className="text-white font-mono text-center py-5 font-bold underline">Owned games</h1>
                    </div>
                    <div className='p-4 space-y-4'>
                        <Card />
                        <Card />
                        <Card />
                        <Card />
                        <Card />
                        <Card />
                    </div>
                </section>
            </main>
        </>
    )
}

export default Profile;