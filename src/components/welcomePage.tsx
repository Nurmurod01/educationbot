"use client";
import Image from "next/image";
import { Charge, Coins, PlayBtn } from "./image";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

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
}

export interface UserInfo {
  user_id: number;
  username: string;
  full_name: string;
  level: {
    name: string;
  };
  coin: number;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartTest, user }) => {
  const [data, setData] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !user.id) {
      setLoading(false);
      setError("Siz telegramdan kirmadingiz!");
      return;
    }
    const userID = user?.id;
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = `https://api.pravaol.uz/api/user-info/${userID}`;

        const res = await axios.get<UserInfo>(apiUrl);

        setData(res.data);
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

  console.log("🎯 Current state:", { loading, error, data, user });

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

      <div className="absolute top-3 start-3 end-3 bottom-3 rounded-2xl bg-[#A42FC1]">
        <div className="flex flex-col gap-16 justify-center items-center mt-32 p-3">
          <div className="w-full text-center text-[#A42FC1] drop-shadow-[0_10px_20px_rgba(164,47,193,0.5)] bg-white shadow-2xl rounded-2xl p-5 opacity-0 animate-fade-in">
            <h1 className="text-xl font-semibold">Welcome</h1>
            <h1 className="text-4xl font-extrabold">
              {data?.full_name || user?.first_name || "User"}
            </h1>
            <div className="flex justify-around items-center mt-4 mb-3">
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
        </div>

        <div className="relative flex justify-center items-center mt-20">
          <div className="absolute flex items-center justify-center">
            <div className="bg-white/10 rounded-full h-44 w-44 flex items-center justify-center p-3 glow-ring2">
              <div className="bg-white/10 rounded-full h-36 w-36 flex items-center justify-center p-3 glow-ring1"></div>
            </div>
          </div>

          <button
            onClick={onStartTest}
            className="relative z-20 flex justify-center items-center bg-white text-[#A42FC1] font-bold rounded-full h-28 w-28 shadow-lg hover:scale-105 transition-transform duration-200 opacity-0 animate-fade-in-delay"
            disabled={loading}
          >
            <Image
              src={PlayBtn}
              height={40}
              width={40}
              alt="Start Game"
              className="ps-2 mx-auto my-auto"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
