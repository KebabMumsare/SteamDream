function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className="bg-[#1B2838] rounded-2xl shadow-lg p-10 flex flex-col items-center w-full mt-32"
        style={{ width: "20vw", height: "30vw", maxHeight: "700px", minWidth: "300px" }}
      >
        <h2
          className="font-bold text-white mb-8"
          style={{ fontSize: "1.5vw" }}
        >
          Login
        </h2>
        <form className="flex flex-col gap-3 items-center">
          <input
            type="text"
            placeholder="Username"
            className="rounded-lg bg-[#22364b] text-white placeholder:text-slate-300 focus:outline-none"
            style={{ width: "15vw", height: "3vw", fontSize: "0.8vw", paddingLeft: "0.7vw" }}
          />
          <input
            type="password"
            placeholder="Password"
            className="rounded-lg bg-[#22364b] text-white placeholder:text-slate-300 focus:outline-none"
            style={{ width: "15vw", height: "3vw", fontSize: "0.8vw", paddingLeft: "0.7vw" }}
          />
          <button
            type="submit"
            className="bg-[#66C0F4] text-[#1B2838] font-bold rounded-lg hover:bg-[#4fa3d1] transition-colors"
            style={{
              width: "15vw",
              height: "3vw",
              fontSize: "1vw",
              marginBottom: "2vw",
              minWidth: "120px",
              minHeight: "28px",
              marginTop: "1vw",
            }}
          >
            Log in
          </button>

          <span className="text-white font-mono text-[0.9vw] mt-1 mb-0">or log in with</span>
          <a href="/auth/steam">
            <div>
              <img
                src="/src/assets/Icons/SteamLogin.png"
                alt="Login with Steam"
                style={{ width: "3vw", height: "3vw", marginTop: "-0.6vw" }}
              />
            </div>
          </a>
        </form>
      </div>
    </div>
  );
}

export default Login;