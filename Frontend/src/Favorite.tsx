import Card from './components/Card';

interface FavoriteProps {
    colors: {
        headerBg: string;
    };
}

function Favorite({ colors }: FavoriteProps) {
    return (
         <div className="max-w-[90%] mx-auto">
            <div className='z-49 pt-[9vw] w-[100%] fixed left-1/2 transform -translate-x-1/2' style={{ background: `linear-gradient(to bottom, ${colors.headerBg} 0%, ${colors.headerBg} 87%, rgba(0,78,123,0) 100%)` }}>
                <h1
                  className="text-white font-mono font-bold text-center mt-[2vw] mb-[4vw] underline"
                  style={{ fontSize: "1.9vw" }}
        >
                  Favorites
                </h1>
            </div>
            <div className="pt-[15vw] space-y-12">
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
            </div>
        </div>
    );
}

export default Favorite;