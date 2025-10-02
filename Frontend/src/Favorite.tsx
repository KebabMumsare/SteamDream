import Card from './components/Card';

function Favorite() {
    return (
        <div className="max-w-[90%] mx-auto">
            <div className='z-49 pt-[150px] w-[100%]  bottom: [background:linear-gradient(to_bottom,#004E7B_0%,#004E7B_87%,rgba(0,78,123,0)_100%)] fixed left-1/2 transform -translate-x-1/2'>
                <h1 className=" text-white font-mono text-3xl font-bold text-center mb-10">Favorites</h1>
            </div>
            <div className="pt-[220px] space-y-12">
                <Card />
                <Card />
                <Card />
            </div>
        </div>
    );
}

export default Favorite;