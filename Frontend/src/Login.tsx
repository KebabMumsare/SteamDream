function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className="bg-[#1B2838] rounded-2xl shadow-lg p-10 flex flex-col items-center w-full mt-32"
        style={{ width: "25vw", height: "30vw", maxWidth: "500px" }}
      >
        <img
          src="/src/assets/Icons/Logo.png"
          alt="Logo"
          className="w-24 h-24 object-contain mb-6"
          style={{ width: "25vw", height: "3vw"}}
        />
        <h2
          className="font-bold text-white mb-8"
          style={{ fontSize: "1vw" }}
        >
          Login
        </h2>
        <form className="flex flex-col gap-6 items-center">
          <input
            type="text"
            placeholder="Username"
            className="rounded-lg bg-[#22364b] text-white placeholder:text-slate-300 focus:outline-none"
            style={{ width: "15vw", height: "3vw", fontSize: "0.8vw" }}
          />
          <input
            type="password"
            placeholder="Password"
            className="rounded-lg bg-[#22364b] text-white placeholder:text-slate-300 focus:outline-none"
            style={{ width: "15vw", height: "3vw", fontSize: "0.8vw" }}
          />
          <button
            type="submit"
            className="bg-[#66C0F4] text-[#1B2838] font-bold rounded-lg hover:bg-[#4fa3d1] transition-colors"
            style={{ width: "15vw", height: "3vw", fontSize: "0.8vw" }}
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;