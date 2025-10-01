function Profile() {
    return (
        <>
            <main className="flex flex-row gap-[6rem] h-[calc(100vh)] w-full pt-40 overflow-hidden">
                <section className="bg-blue-500 w-1/3 p-4">
                    <h1>Main Settings</h1>
                </section>
                <section className="bg-green-500 flex-1 p-4">
                    <h1>Owned games</h1>
                </section>
            </main>
        </>
    )
}

export default Profile;