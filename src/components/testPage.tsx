import { ApiQuestion } from "@/app/page";
import { ChevronLeft, Check, X } from "lucide-react";
import { useEffect, useState } from "react";

interface TestScreenProps {
  question: ApiQuestion;
  timeLeft: number;
  totalAnswered: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  onSelectAnswer: (index: number) => void;
  onGoBack: () => void;
  isPracticeMode?: boolean;
}

const TestScreen: React.FC<TestScreenProps> = ({
  question,
  timeLeft,
  setTimeLeft,
  onSelectAnswer,
  onGoBack,
  isPracticeMode = false,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState<"+2" | "-3" | null>(null);
  const [animatedProgress, setAnimatedProgress] = useState(timeLeft);

  // Sound function
  const playSound = (soundType: "correct" | "wrong") => {
    try {
      // Check if sound is enabled in localStorage
      const soundEnabled = localStorage.getItem("sound");
      if (soundEnabled === null || JSON.parse(soundEnabled) === false) {
        return; // Sound is disabled, don't play
      }

      const audio = new Audio(`/sound/${soundType}.mp3`);
      audio.volume = 0.5; // Set volume to 50%
      audio.play().catch((error) => {
        console.error(`Error playing ${soundType} sound:`, error);
      });
    } catch (error) {
      console.error(`Error with sound system:`, error);
    }
  };

  useEffect(() => {
    let frame: number;
    const duration = 400;
    const start = performance.now();
    const from = animatedProgress;
    const to = timeLeft;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = from + (to - from) * progress;
      setAnimatedProgress(value);

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [timeLeft, animatedProgress]);

  const handleAnswerSelect = (selectedIndex: number) => {
    if (showFeedback) return;

    setSelectedAnswer(selectedIndex);
    setShowFeedback(true);

    // Find correct answer using the new API structure
    const isCorrect = question.options[selectedIndex].is_correct;

    if (isCorrect) {
      setFeedbackText("+2");
      setTimeLeft((prev) => prev + 2);
      playSound("correct"); // Play correct sound
    } else {
      setFeedbackText("-3");
      setTimeLeft((prev) => Math.max(prev - 3, 0));
      playSound("wrong"); // Play wrong sound
    }

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      setFeedbackText(null);
      onSelectAnswer(selectedIndex);
    }, 800);
  };

  const getIconStyle = (index: number) => {
    if (!showFeedback)
      return {
        icon: null,
        containerClass: `absolute top-[18px] end-3 w-5 h-5 border-2 ${
          isPracticeMode ? "border-orange-500" : "border-[#A42FC1]"
        } rounded-full flex items-center justify-center`,
      };

    const isCorrect = question.options[index].is_correct;
    const isSelected = index === selectedAnswer;

    if (isCorrect) {
      return {
        icon: <Check className="w-4 h-4 text-white" />,
        containerClass: `absolute top-[18px] end-3 w-5 h-5 ${
          isPracticeMode ? "bg-orange-500" : "bg-[#A42FC1]"
        } border-green-500 rounded-full flex items-center justify-center`,
      };
    } else if (isSelected) {
      return {
        icon: <X className="w-4 h-4 text-white" />,
        containerClass:
          "absolute top-[18px] end-3 w-5 h-5 bg-red-500 border-2 border-red-500 rounded-full flex items-center justify-center",
      };
    }

    return {
      icon: null,
      containerClass:
        "absolute top-[18px] end-3 w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center",
    };
  };

  return (
    <div className="relative min-h-screen overflow-hidden to-white p-3">
      <div className="max-w-md mx-auto">
        <div
          className={`absolute top-0 start-0 end-0 ${
            isPracticeMode ? "bg-orange-500" : "bg-[#A42FC1]"
          } h-52 rounded-4xl m-2 -z-10`}
        ></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-white space-x-2">
            <button onClick={onGoBack} className="p-1">
              <ChevronLeft />
            </button>
          </div>

          {/* Practice Mode Indicator */}
          {isPracticeMode && (
            <div className="bg-white/20 text-white px-3 py-1 rounded-lg text-sm font-bold">
              PRACTICE
            </div>
          )}
        </div>

        {/* Decorative circles */}
        <div className="absolute top-12 start-0.5 w-15 h-15 rounded-full bg-white/10 "></div>
        <div className="absolute top-1 start-44 w-20 h-20 rounded-full bg-white/10 "></div>
        <div className="absolute top-15 -end-5 w-17 h-17 rounded-full bg-white/10 "></div>
        <div className="absolute top-5 end-56 w-10 h-10 rounded-full bg-white/10 "></div>

        {/* Question Card with Timer */}
        <div className="relative bg-white rounded-xl shadow-lg mx-5 mt-28 mb-6 p-5 pt-6 border border-gray-100">
          <div className="absolute -top-11 left-1/2 w-[68px] h-[68px] bg-white rounded-full transform -translate-x-1/2"></div>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
            <div className="relative w-15 h-15 rounded-full flex items-center justify-center">
              {/* Progress ring */}
              <div
                className="absolute inset-0 rounded-full transition-all"
                style={{
                  background: `conic-gradient(${
                    isPracticeMode ? "#f97316" : "#A42FC1"
                  } ${(animatedProgress / 10) * 360}deg, #e5e7eb 0deg)`,
                }}
              ></div>

              {/* Feedback animation */}
              {showFeedback && feedbackText && (
                <div
                  className={`absolute -top-8 text-xl font-bold ${
                    feedbackText === "+2" ? "text-green-500" : "text-red-500"
                  } animate-bounce`}
                >
                  {feedbackText}
                </div>
              )}

              {/* White center */}
              <div className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <span
                  className={`text-2xl font-bold ${
                    isPracticeMode ? "text-orange-500" : "text-[#A42FC1]"
                  }`}
                >
                  {timeLeft}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 leading-relaxed">
              {question.word}
            </h2>
          </div>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mx-5">
          {question.options.map((option, index) => {
            const iconStyle = getIconStyle(index);
            return (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(index)}
                className={`relative w-full bg-white border-2 ${
                  isPracticeMode ? "border-orange-500" : "border-[#A42FC1]"
                } rounded-2xl p-4 text-left active:bg-blue-50 active:border-blue-400 transition-colors duration-200`}
                disabled={showFeedback}
              >
                <div className="flex items-center">
                  <p className="text-base font-medium text-gray-800">
                    {option.option}
                  </p>
                </div>
                <div className={iconStyle.containerClass}>
                  {iconStyle.icon || (
                    <div className="w-5 h-5 bg-transparent rounded-full"></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestScreen;
