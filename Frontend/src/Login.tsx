function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <style>
        {`
          /* Mobil format */
          @media (max-width: 375px) {
            .loginbox {
              width: 50vw !important;
              height: 70vw !important;
              margin-top: 2vw !important;
            }
            .login-title {
              font-size: 3.5vw !important;
              margin-top: 4vw !important;
            }
            .steam-icon {
              width: 14vw !important;
              height: 14vw !important;
            }
          }
          /* iPad format */
          @media (min-width: 376px) and (max-width: 1024px) {
            .loginbox {
              width: 55vw !important;
              height: 60vw !important;
              margin-top: 1vw !important;
            }
            .login-title {
              font-size: 3.5vw !important;
              margin-top: 4vw !important;
            }
            .steam-icon {
              width: 12vw !important;
              height: 12vw !important;
            }
          }
          /* Desktop format */
          @media (min-width: 1025px) {
            .loginbox {
              width: 30vw !important;
              height: 25vw !important;
              margin-top: 4vw !important;
            }
            .login-title {
              font-size: 1.5vw !important;
              margin-top: 4vw !important;
            }
            .steam-icon {
              width: 4vw !important;
              height: 4vw !important;
            }
          }
        `}
      </style>
      <div
        className="bg-[#1B2838] rounded-2xl shadow-lg p-10 flex flex-col items-center w-full mt-32 loginbox"
      >
        <h2
          className="font-bold text-white mb-8 login-title"
        >
          Login with steam
        </h2>
        <form className="flex flex-col gap-3 items-center">
          <a href="/auth/steam">
            <div>
              <img
                src="/src/assets/Icons/SteamLogin.png"
                alt="Login with Steam"
                className="steam-icon"
              />
            </div>
          </a>
        </form>
      </div>
    </div>
  );
}

export default Login;