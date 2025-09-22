"use client";
import Image from "next/image";
import { Charge, Coins, PlayBtn, WhitePlay } from "./image";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import clsx from "clsx";
import { usePersistedState } from "./usePresidenthook";

interface TelegramUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}

interface WelcomeScreenProps {
  onStartTest: () => void;
  user: TelegramUser | null;
  limitReached: boolean;
  onUserInfoLoaded?: (tryCount: number) => void;
  isPracticeMode?: boolean;
  setIsPracticeMode: React.Dispatch<React.SetStateAction<boolean>>;
  swap: "eng-uzb" | "uzb-eng";
  setSwap: React.Dispatch<React.SetStateAction<"eng-uzb" | "uzb-eng">>;
}

export interface UserInfo {
  user_id: number;
  username: string;
  full_name: string;
  level: {
    name: string;
  };
  coin: number;
  try_count: number;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartTest,
  user,
  limitReached,
  onUserInfoLoaded,
  isPracticeMode = false,
  setIsPracticeMode,
  swap,
  setSwap,
}) => {
  const [data, setData] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sound, setSound] = usePersistedState<boolean>("sound", true);

  useEffect(() => {
    // if (!user || !user.id) {
    //   setLoading(false);
    //   setError("Siz telegramdan kirmadingiz!");
    //   return;
    // }
    const userID = user?.id || 822245102;
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = `https://api.octava-edu.uz/api/user-info/${userID}`;
        const res = await axios.get<UserInfo>(apiUrl);

        setData(res.data);
        if (res.data.try_count <= 0) {
          setIsPracticeMode(true);
        } else {
          setIsPracticeMode(false);
        }
        if (onUserInfoLoaded) {
          onUserInfoLoaded(res.data.try_count);
        }
      } catch (err: unknown) {
        let errorMessage = "Failed to load user information";

        if (err instanceof AxiosError) {
          if (err.response) {
            errorMessage += `: ${err.response.status} - ${err.response.data}`;
          } else if (err.request) {
            errorMessage += ": Network error";
          } else {
            errorMessage += `: ${err.message}`;
          }
        } else if (err instanceof Error) {
          errorMessage += `: ${err.message}`;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 100);

    return () => clearTimeout(timer);
  }, [user?.id]);

  if (loading) {
    return (
      <div className="relative overflow-hidden min-h-screen bg-white flex items-center justify-center p-3">
        <div className="absolute top-3 start-3 end-3 bottom-3 p-3 rounded-2xl bg-[#A42FC1]">
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

          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-sm mx-auto text-center bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A42FC1]"></div>
              </div>

              <h2 className="text-xl font-semibold text-[#A42FC1] mb-2">
                Loading...
              </h2>
              <p className="text-gray-600 text-sm">Fetching your information</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative overflow-hidden min-h-screen bg-white flex items-center justify-center p-3">
        <div className="absolute top-3 start-3 end-3 bottom-3 p-3 rounded-2xl bg-[#A42FC1]">
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

          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-sm mx-auto text-center bg-white rounded-2xl p-8 shadow-2xl">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-red-500 mb-2">Error</h2>
              <p className="text-gray-600 text-sm mb-4">{error}</p>

              <button
                onClick={() => window.location.reload()}
                className="bg-[#A42FC1] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#8a2ba3] transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-white">
      <div className="absolute inset-3 rounded-2xl bg-[#A42FC1] overflow-hidden">
        {/* Background circles - positioned within container */}
        <div className="absolute top-12 left-2 w-12 h-12 rounded-full bg-white/10"></div>
        <div className="absolute bottom-12 left-2 w-12 h-12 rounded-full bg-white/10"></div>
        <div className="absolute top-4 left-44 w-16 h-16 rounded-full bg-white/10"></div>
        <div className="absolute bottom-8 right-20 w-16 h-16 rounded-full bg-white/10"></div>
        <div className="absolute bottom-0 left-24 w-16 h-16 rounded-full bg-white/10"></div>
        <div className="absolute top-16 right-2 w-14 h-14 rounded-full bg-white/10"></div>
        <div className="absolute bottom-36 right-8 w-16 h-16 rounded-full bg-white/10"></div>
        <div className="absolute top-80 left-4 w-14 h-14 rounded-full bg-white/10"></div>
        <div className="absolute top-5 right-14 w-8 h-8 rounded-full bg-white/10"></div>
        <div className="absolute bottom-44 left-10 w-8 h-8 rounded-full bg-white/10"></div>

        {/* SETTINGS BUTTONS */}
        <div className="absolute top-5 right-5 flex flex-col gap-2 z-20">
          <button
            onClick={() => setSound(!sound)}
            className={`px-3 py-1 rounded-lg text-sm font-bold shadow-md transition-colors ${
              sound ? "bg-[#1F8435] text-white" : "bg-rose-500 text-white"
            }`}
          >
            🔊 {sound ? "ON" : "OFF"}
          </button>
          <button
            onClick={() => setSwap(swap === "eng-uzb" ? "uzb-eng" : "eng-uzb")}
            className="px-3 py-1 rounded-lg text-sm font-bold shadow-md bg-blue-500 text-white transition-colors"
          >
            🌐 {swap.toUpperCase()}
          </button>
        </div>

        {/* Practice Mode Banner */}
        {isPracticeMode && (
          <div className="absolute top-5 start-32 -translate-x-1/2 z-30">
            <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg text-center animate-pulse">
              <h3 className="font-bold text-sm">PRACTICE MODE</h3>
              <p className="text-xs">Coins earned won&apost be added</p>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col justify-center items-center h-full p-4">
          <div className="w-full text-center text-[#A42FC1] drop-shadow-[0_10px_20px_rgba(164,47,193,0.5)] bg-white shadow-2xl rounded-2xl p-5 opacity-0 animate-fade-in mb-8">
            <h1 className="text-xl font-semibold">Welcome</h1>
            <h1 className="text-4xl font-extrabold">
              {data?.full_name || user?.first_name || "User"}
            </h1>
            <div className="flex flex-col items-center mt-4 gap-2">
              {/* Battery blocks */}
              <div className="flex items-center gap-1">
                <div className="flex border-2 border-gray-700 rounded-sm p-1 gap-0.5">
                  {[...Array(5)].map((_, i) => {
                    const count = data?.try_count ?? 0;
                    const level = i < count;
                    return (
                      <div
                        key={i}
                        className={clsx(
                          "w-3 h-6 rounded-[2px] transition-colors",
                          level
                            ? count > 3
                              ? "bg-[#1F8435]"
                              : count > 1
                              ? "bg-yellow-400"
                              : "bg-red-500"
                            : "bg-gray-300"
                        )}
                      />
                    );
                  })}
                </div>
                {/* battery cap */}
                <div className="w-1 h-4 bg-gray-700 rounded-r-sm" />
              </div>

              {/* Charge status text */}
              <h1
                className={clsx(
                  "font-semibold text-sm mt-1",
                  (data?.try_count ?? 0) === 0 && "text-gray-400",
                  (data?.try_count ?? 0) === 1 && "text-red-500",
                  (data?.try_count ?? 0) > 1 &&
                    (data?.try_count ?? 0) <= 3 &&
                    "text-yellow-500",
                  (data?.try_count ?? 0) > 3 && "text-[#1F8435]"
                )}
              >
                {(data?.try_count ?? 0) === 0
                  ? isPracticeMode
                    ? "Practice Mode Available"
                    : "Battery empty"
                  : (data?.try_count ?? 0) === 1
                  ? "Low charge"
                  : (data?.try_count ?? 0) <= 3
                  ? "Medium charge"
                  : "Full charge"}
              </h1>
            </div>

            <div className="flex justify-around items-center mt-3 mb-3">
              <div className="flex items-center gap-2 mt-6 text-[#FA3939] font-semibold text-xl">
                <Image src={Charge} alt="Level" />
                <h1>{data?.level?.name || "Beginner"}</h1>
              </div>
              <div className="flex items-center gap-2 mt-6 text-[#1F8435] font-semibold text-xl">
                <Image src={Coins} alt="Coins" />
                <h1>{data?.coin || 0} Coins</h1>
              </div>
            </div>
          </div>

          {/* Play button with circles */}
          <div className="relative flex justify-center items-center mt-10">
            <div className="absolute flex items-center justify-center">
              <div
                className={`${
                  isPracticeMode ? "bg-orange-500/20" : "bg-white/10"
                } rounded-full h-44 w-44 flex items-center justify-center p-3 glow-ring2`}
              >
                <div
                  className={`${
                    isPracticeMode ? "bg-orange-500/20" : "bg-white/10"
                  } rounded-full h-36 w-36 flex items-center justify-center p-3 glow-ring1`}
                ></div>
              </div>
            </div>

            <button
              onClick={onStartTest}
              className={`relative z-20 flex justify-center items-center font-bold rounded-full h-28 w-28 shadow-lg 
              ${
                loading || limitReached
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isPracticeMode
                  ? "bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200 opacity-0 animate-fade-in-delay"
                  : "bg-white text-[#A42FC1] hover:scale-105 transition-transform duration-200 opacity-0 animate-fade-in-delay"
              }`}
              disabled={loading || limitReached}
            >
              <Image
                src={isPracticeMode ? WhitePlay : PlayBtn}
                height={40}
                width={40}
                alt="Start Game"
                className="ps-2 mx-auto my-auto"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
