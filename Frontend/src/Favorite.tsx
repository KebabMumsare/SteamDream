import Card from './components/Card';

interface FavoriteProps {
    colors: {
        headerBg: string;
    };
}

function Favorite({ colors }: FavoriteProps) {
    return (
         <>
            <div className='z-49 pt-[9vw] w-[90vw] fixed left-0 right-0 mx-auto' style={{ background: `linear-gradient(to bottom, ${colors.headerBg} 0%, ${colors.headerBg} 87%, rgba(0,78,123,0) 100%)` }}>
                <h1
                  className="text-white font-bold text-center mt-[2vw] mb-[4vw] underline"
                  style={{ fontSize: "1.9vw" }}
        >
                  Favorites
                </h1>
            </div>
            <div className="max-w-[90%] mx-auto">
                <div className="pt-[15vw] space-y-12">
                    <Card title="Sample Game 1" image="/assets/testbild.jpg" description="Sample description" />
                    <Card title="Sample Game 2" image="/assets/testbild.jpg" description="Sample description" />
                    <Card title="Sample Game 3" image="/assets/testbild.jpg" description="Sample description" />
                    <Card title="Sample Game 4" image="/assets/testbild.jpg" description="Sample description" />
                    <Card title="Sample Game 5" image="/assets/testbild.jpg" description="Sample description" />
                    <Card title="Sample Game 6" image="/assets/testbild.jpg" description="Sample description" />
                </div>
            </div>
        </>
    );
}

export default Favorite;
