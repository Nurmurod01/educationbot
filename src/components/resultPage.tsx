"use client";
import Image from "next/image";
import { Home, Return } from "./image";
import React, { useEffect } from "react";
import axios, { AxiosError } from "axios";
import { TelegramUser } from "@/app/page";

interface ResultScreenProps {
  score: number;
  totalAnswered: number;
  home: () => void;
  onrestart: () => void;
  isPracticeMode?: boolean;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  totalAnswered,
  home,
  onrestart,
  isPracticeMode = false,
}) => {
  const [user, setUser] = React.useState<TelegramUser | null>(null);
  const bonus = Math.floor(score / 5);
  const finalScore = score + bonus;

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initDataUnsafe?.user) {
      setUser(tg.initDataUnsafe.user);
    }
  }, []);
  const soundCache: Record<string, HTMLAudioElement> = {};

  // Helper function: audio ni cache ga olish
  const getCachedAudio = (path: string) => {
    if (!soundCache[path]) {
      soundCache[path] = new Audio(path);
      soundCache[path].volume = 0.5; // umumiy volume
    }
    return soundCache[path];
  };
  useEffect(() => {
    const sendData = async () => {
      // Agar practice mode bo'lsa, coin qo'shmaslik
      if (isPracticeMode) {
        console.log("Practice mode: Coins not added to account");
        return;
      }
      try {
        const soundEnabled = localStorage.getItem("sound");
        if (soundEnabled === null || JSON.parse(soundEnabled) !== false) {
          const audio = getCachedAudio("/sound/completed.mp3");

          // qayta o'ynash uchun boshidan qo'yamiz
          audio.currentTime = 0;

          audio.play().catch((error) => {
            console.error("Error playing sound:", error);
          });
        }
      } catch (error) {
        console.error("Sound error:", error);
      }
      try {
        await axios.post("https://api.octava-edu.uz/api/user/add-coin", {
          user_id: user?.id,
          amount: finalScore,
        });
        console.log(`Added ${score} coins to user account`);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response?.data) {
            console.error("Serverdan xatolik:", error.response.data);
          } else {
            console.error("Xatolik:", error.message);
          }
        } else if (error instanceof Error) {
          console.error("Xatolik:", error.message);
        } else {
          console.error("Noma'lum xatolik:", error);
        }
      }
    };

    sendData();
  }, [user?.id, score, isPracticeMode]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center p-4">
      <div
        className={`absolute top-3 start-3 end-3 bottom-3 rounded-2xl p-4 ${
          isPracticeMode ? "bg-orange-600" : "bg-[#A42FC1]"
        }`}
      >
        {/* Decorative circles */}
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

        {/* Practice Mode Banner */}
        {isPracticeMode && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30">
            <div className="bg-white/20 text-white px-4 py-2 rounded-lg shadow-lg text-center">
              <h3 className="font-bold text-sm">PRACTICE MODE</h3>
              <p className="text-xs">No coins added</p>
            </div>
          </div>
        )}

        <div className="w-full bg-white flex flex-col items-center gap-3 mt-44 p-5 rounded-3xl">
          <h1
            className={`text-4xl ${
              isPracticeMode ? "text-orange-500" : "text-[#A42FC1]"
            } text-center font-bold tracking-wider`}
          >
            Score
          </h1>
          <h1 className="text-3xl text-green-600 font-semibold">
            {finalScore}
          </h1>
          <h1 className="font-semibold">
            {score} / {totalAnswered} correct
          </h1>

          {/* Practice Mode Info */}
          {isPracticeMode && (
            <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 mt-2">
              <p className="text-orange-700 text-sm text-center">
                🎓 Practice completed! <br />
                Coins were not added to your account.
              </p>
            </div>
          )}

          <div className="flex justify-around items-center gap-12 mt-4">
            <button onClick={onrestart} className="flex flex-col items-center">
              <Image src={Return} alt="Restart" />
              <span className="text-sm mt-1">
                {isPracticeMode ? "Practice Again" : "Restart"}
              </span>
            </button>
            <button onClick={home} className="flex flex-col items-center">
              <Image src={Home} alt="Home" />
              <span className="text-sm mt-1">Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
