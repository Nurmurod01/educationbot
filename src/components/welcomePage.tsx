import Image from "next/image";
import { Charge, Coins, PlayBtn } from "./image";
interface TelegramUser {
  id: number; // Foydalanuvchi ID
  is_bot?: boolean; // Bot yoki yo‘qligi
  first_name: string; // Ism
  last_name?: string; // Familiya (ba’zan bo‘lmaydi)
  username?: string; // Telegram username (ba’zan bo‘lmaydi)
  language_code?: string; // Tili, masalan "en" yoki "uz"
  is_premium?: boolean; // Premium foydalanuvchi yoki yo‘qligi
  allows_write_to_pm?: boolean; // Botga yozishga ruxsat
  photo_url?: string; // Profil rasmi (agar ochiq bo‘lsa)
}

interface WelcomeScreenProps {
  onStartTest: () => void;
  user: TelegramUser;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartTest, user }) => {
  return (
    <div className="relative overflow-hidden min-h-screen bg-white flex items-center justify-center p-3">
      <div className="absolute top-12 start-0.5 w-15 h-15 rounded-full bg-white/10 z-10"></div>
      <div className="absolute bottom-12 start-0.5 w-15 h-15 rounded-full bg-white/10 z-10"></div>
      <div className="absolute top-1 start-44 w-20 h-20 rounded-full bg-white/10 z-10"></div>
      <div className="absolute bottom-3 start-64 w-20 h-20 rounded-full bg-white/10 z-10"></div>
      <div className="absolute -bottom-5 start-24 w-20 h-20 rounded-full bg-white/10 z-10"></div>
      <div className="absolute top-15 -end-5 w-17 h-17 rounded-full bg-white/10 z-10"></div>
      <div className="absolute bottom-36 end-5 w-20 h-20 rounded-full bg-white/10 z-10"></div>
      <div className="absolute top-80 start-1 w-17 h-17 rounded-full bg-white/10 z-10"></div>
      <div className="absolute top-96 -end-5 w-17 h-17 rounded-full bg-white/10 z-10"></div>
      <div className="absolute top-5 end-56 w-10 h-10 rounded-full bg-white/10 z-10"></div>
      <div className="absolute bottom-44 start-10 w-10 h-10 rounded-full bg-white/10 z-10"></div>

      <div className="absolute top-3 start-3 end-3 bottom-3 rounded-2xl  bg-[#A42FC1]">
        <div className="flex flex-col gap-16 justify-center items-center mt-32  p-3">
          <div className="w-full text-center text-[#A42FC1] drop-shadow-[0_10px_20px_rgba(164,47,193,0.5)]  bg-white shadow-2xl rounded-2xl p-5">
            <h1 className="text-xl font-semibold">Welcome</h1>
            <h1 className="text-4xl font-extrabold">{user?.username}</h1>
            <div className="flex justify-around items-center mt-4 mb-3">
              <div className="flex items-center gap-2 mt-6 text-[#FA3939] font-semibold text-xl">
                <Image src={Charge} alt="Level" />
                <h1>1 Level</h1>
              </div>
              <div className="flex items-center  gap-2 mt-6 text-[#1F8435] font-semibold text-xl">
                <Image src={Coins} alt="Coins" />

                <h1>20 Coins</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex justify-center items-center mt-20">
          <div className="absolute flex items-center justify-center">
            <div className="bg-white/10 rounded-full h-44 w-44 flex items-center justify-center p-3 glow-ring2">
              <div className="bg-white/10 rounded-full h-36 w-36 flex items-center justify-center p-3 glow-ring1"></div>
            </div>
          </div>

          <button
            onClick={onStartTest}
            className="relative z-20 flex  bg-white text-[#A42FC1] font-bold rounded-full h-28 w-28 shadow-lg"
          >
            <Image
              src={PlayBtn}
              height={40}
              width={40}
              alt="Level"
              className="ps-2 mx-auto"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
