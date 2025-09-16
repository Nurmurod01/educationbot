import Image from "next/image";
import { Home, Return } from "./image";

interface ResultScreenProps {
  score: number;
  totalAnswered: number;
  home: () => void;
  onrestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  totalAnswered,
  home,
  onrestart,
}) => {
  const finalScore = score * 2; // Har bir to'g'ri javob uchun 2 ball

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute top-3 start-3 end-3 bottom-3 rounded-2xl p-4 bg-[#A42FC1]">
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

        <div className="w-full bg-white flex flex-col items-center gap-3 mt-44 p-5 rounded-3xl">
          <h1 className="text-4xl text-[#A42FC1] text-center font-bold tracking-wider">
            Score
          </h1>
          <h1 className="text-3xl text-green-600 font-semibold">
            {finalScore}
          </h1>
          <h1 className="font-semibold">
            {score} / {totalAnswered} correct
          </h1>

          {/* Performance message */}
          <div className="text-center mt-2">
            {score === totalAnswered && totalAnswered > 0 && (
              <p className="text-green-600 font-semibold">Perfect! 🎉</p>
            )}
            {score / totalAnswered >= 0.8 &&
              score !== totalAnswered &&
              totalAnswered > 0 && (
                <p className="text-blue-600 font-semibold">Excellent! 👏</p>
              )}
            {score / totalAnswered >= 0.6 && score / totalAnswered < 0.8 && (
              <p className="text-yellow-600 font-semibold">Good job! 👍</p>
            )}
            {score / totalAnswered < 0.6 && totalAnswered > 0 && (
              <p className="text-orange-600 font-semibold">
                Keep practicing! 💪
              </p>
            )}
            {totalAnswered === 0 && (
              <p className="text-gray-600 font-semibold">
                No questions answered
              </p>
            )}
          </div>

          <div className="flex justify-around items-center gap-12 mt-4">
            <button onClick={onrestart} className="flex flex-col items-center">
              <Image src={Return} alt="Restart" />
              <span className="text-sm mt-1">Restart</span>
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
