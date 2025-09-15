import Image from "next/image";
import { Home, Return } from "./image";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface ResultScreenProps {
  score: number;
  questions: Question[];
  home: () => void;
  onrestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  questions,
  home,
  onrestart,
}) => {
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
        <div className="w-full bg-white flex flex-col items-center gap-3 mt-56 p-5 rounded-3xl">
          <h1 className="text-4xl text-[#A42FC1] text-center font-bold tracking-wider">
            Score
          </h1>
          <h1 className="text-3xl text-green-600 font-semibold">30</h1>
          <h1 className="font-semibold">40 correct</h1>
          <div className="flex justify-around items-center gap-12">
            <button onClick={onrestart}>
              <Image src={Return} alt="" />
            </button>
            <button onClick={home}>
              <Image src={Home} alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
