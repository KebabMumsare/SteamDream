import Card from './components/Card';

function Favorite() {
    return (
      <div className="max-w-[90%] mx-auto">
        <div className='z-49 pt-6 md:pt-8 lg:pt-10 w-[100%] [background:linear-gradient(to_bottom,#004E7B_0%,#004E7B_87%,rgba(0,78,123,0)_100%)] fixed left-1/2 transform -translate-x-1/2'>
                <h1
                  className="text-white font-mono font-bold text-center mt-[2vw] mb-[4vw] underline"
                  style={{ fontSize: "1.9vw" }}
                >
                  Favorites
                </h1>
            </div>
      <div className="pt-40 md:pt-48 lg:pt-56 space-y-12">
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