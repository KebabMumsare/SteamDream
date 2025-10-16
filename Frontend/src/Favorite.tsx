import Card from './components/Card';

interface FavoriteProps {
    colors: {
        headerBg: string;
    };
    searchTerm: string;
}

function Favorite({ colors, searchTerm }: FavoriteProps) {
    const games = [
        {
            title: "Portal 2",
            genre: "Puzzle & Adventure",
            originalPrice: 9.99,
            currentPrice: 1.99,
            discountPercent: 80,
            platforms: { windows: true, apple: true },
            tags: ['Co-op', 'Puzzle', 'Singleplayer'],
            description: "Portal 2 är ett pussel-plattformsspel och uppföljaren till den prisbelönta titeln Portal. Du använder en portal-pistol för att lösa utmanande pussel i Aperture Science laboratorium under GLaDOS övervakning.",
            steamUrl: "https://store.steampowered.com/app/620/Portal_2/"
        },
        {
            title: "Stardew Valley",
            genre: "Simulation & RPG",
            currentPrice: 14.99,
            platforms: { windows: true, apple: true },
            tags: ['Farming', 'Relaxing', 'Multiplayer'],
            description: "Stardew Valley är ett lantbruksimulationsspel där du tar över din farfars gamla gård. Odla grödor, ta hand om djur, utforska grottor och bygg relationer med byns invånare i detta charmiga pixel-art äventyr.",
            steamUrl: "https://store.steampowered.com/app/413150/Stardew_Valley/"
        },
        {
            title: "Hollow Knight",
            genre: "Metroidvania & Action",
            originalPrice: 14.99,
            currentPrice: 7.49,
            discountPercent: 50,
            platforms: { windows: true, apple: true },
            tags: ['Indie', 'Difficult', 'Atmospheric'],
            description: "Hollow Knight är ett handgjort 2D action-äventyr genom ett vackert och döende insektsrike. Utforska labyrinter av grottor, kämpa mot korrumperade varelser och bli vän med excentriska insekter.",
            steamUrl: "https://store.steampowered.com/app/367520/Hollow_Knight/"
        },
        {
            title: "Hades",
            genre: "Roguelike & Action",
            originalPrice: 24.99,
            currentPrice: 12.49,
            discountPercent: 50,
            platforms: { windows: true, apple: true },
            tags: ['Roguelike', 'Greek Mythology', 'Fast-Paced'],
            description: "Hades är ett roguelike dungeon crawler där du spelar som Zagreus, son till Hades, och försöker fly från underjorden. Möt gudarna på Olympus som hjälper dig med kraftfulla gåvor i detta prisbelönta spel.",
            steamUrl: "https://store.steampowered.com/app/1145360/Hades/"
        },
        {
            title: "Terraria",
            genre: "Sandbox & Adventure",
            originalPrice: 9.99,
            currentPrice: 4.99,
            discountPercent: 50,
            platforms: { windows: true, apple: true },
            tags: ['Sandbox', 'Crafting', 'Multiplayer'],
            description: "Terraria är ett 2D sandbox-äventyr där du kan gräva, bygga, utforska och slåss. Med otaliga monster att besegra och objekt att skapa är möjligheterna i denna pixelbaserade värld oändliga.",
            steamUrl: "https://store.steampowered.com/app/105600/Terraria/"
        },
        {
            title: "The Witcher 3",
            genre: "RPG & Adventure",
            originalPrice: 39.99,
            currentPrice: 9.99,
            discountPercent: 75,
            platforms: { windows: true, apple: true },
            tags: ['Open World', 'Story Rich', 'Dark Fantasy'],
            description: "The Witcher 3: Wild Hunt är ett story-drivet, öppet världs RPG. Du är Geralt av Rivia, en monsterjägare på jakt efter ett barn från profetian. Utforska en visuellt fantastisk värld full av monster, magi och moral.",
            steamUrl: "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/"
        }
    ];

    const filteredGames = games.filter(game => 
        game.title.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    return (
         <>
            <div className='z-49 pt-0 pb-[3vw] w-[90vw] fixed top-0 left-0 right-0 mx-auto' style={{ background: `linear-gradient(to bottom, ${colors.headerBg} 0%, ${colors.headerBg} 70%, rgba(0,78,123,0) 100%)`, paddingTop: '10vw' }}>
                <h1
                  className="text-white font-bold text-center underline"
                  style={{ fontSize: "1.9vw" }}
        >
                  Favorites
                </h1>
            </div>
            <div className="max-w-[90%] mx-auto">
                <div className="pt-[18vw] space-y-12 pb-8">
                    {filteredGames.map((game, index) => (
                        <Card 
                            key={index}
                            title={game.title}
                            genre={game.genre}
                            originalPrice={game.originalPrice}
                            currentPrice={game.currentPrice}
                            discountPercent={game.discountPercent}
                            platforms={game.platforms}
                            tags={game.tags}
                            description={game.description}
                            steamUrl={game.steamUrl}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Favorite;
