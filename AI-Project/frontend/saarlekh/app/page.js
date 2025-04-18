import Image from "next/image";
import { FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";

export default function Home() {
  return (
    <div className="relative grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] overflow-hidden">
      <Image
        src="/images/1355218.jpg"
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0 opacity-20"
      />

      <main className="z-10 flex flex-col gap-[32px] row-start-2 items-center justify-center w-full">
        <div className="backdrop-blur-sm bg-[#1a1a2e]/70 border border-[#0ff]/20 text-white rounded-2xl shadow-[0_0_30px_#0ff5] flex w-full max-w-lg transition-all duration-300">
          <div className="p-5 w-full">
            <div className="text-left font-bold text-3xl tracking-wide">
              <span className="text-[#ff00cc]">Saar</span>
              <span className="text-[#00ffff]">Lekh</span>
            </div>

            <div className="py-10 flex flex-col items-center text-center w-full">
              <h2 className="text-3xl font-bold text-[#00ffff] mb-2">
                Sign in to your account
              </h2>
              <div className="border-2 w-10 border-[#ff00cc] inline-block mb-4 rounded"></div>

              <div className="flex flex-col items-center">
                <div className="bg-[#0f1533]/80 w-64 p-2 flex items-center mb-4 rounded-xl border border-[#ff00cc]/30 shadow-[0_0_10px_#ff00cc50]">
                  <FaRegEnvelope className="text-[#ff00cc] m-2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="outline-none text-sm flex-1 bg-transparent text-white placeholder-[#ffb3e6]"
                  />
                </div>

                <div className="bg-[#0f1533]/80 w-64 p-2 flex items-center mb-4 rounded-xl border border-[#ff00cc]/30 shadow-[0_0_10px_#ff00cc50]">
                  <MdLockOutline className="text-[#ff00cc] m-2" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="outline-none text-sm flex-1 bg-transparent text-white placeholder-[#ffb3e6]"
                  />
                </div>

                <div className="flex justify-between w-64 mb-5 text-[#cccccc] text-sm">
                  <label className="flex items-center text-xs">
                    <input
                      type="checkbox"
                      name="remember"
                      className="mr-1 accent-[#ff00cc]"
                    />
                    Remember me
                  </label>
                  <a
                    href="#"
                    className="text-xs hover:text-[#ff00cc] transition-colors"
                  >
                    Forgot Password?
                  </a>
                </div>

                <a
                  href="#"
                  className="border-2 border-[#00ffff] text-[#00ffff] rounded-full px-12 py-2 inline-block font-semibold hover:bg-[#00ffff] hover:text-[#0f0c29] transition-all duration-300 shadow-[0_0_15px_#00ffff90]"
                >
                  Sign in
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
