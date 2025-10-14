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
                <div className="pt-[15vw] space-y-12 pb-8">
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                </div>
            </div>
        </>
    );
}

export default Favorite;
