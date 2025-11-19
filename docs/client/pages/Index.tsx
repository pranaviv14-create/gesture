import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { TrainingScreen } from "@/components/TrainingScreen";
import { TranslationScreen } from "@/components/TranslationScreen";

type Screen = "welcome" | "training" | "translation";

interface TrainedGesture {
  id: string;
  name: string;
  samples: number;
}

export default function SignLanguageTranslator() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [gestures, setGestures] = useState<TrainedGesture[]>([]);

  const handleWelcomeProceed = () => {
    setCurrentScreen("training");
  };

  const handleTrainingNext = (trainedGestures: TrainedGesture[]) => {
    setGestures(trainedGestures);
    setCurrentScreen("translation");
  };

  const handleTrainingBack = () => {
    setCurrentScreen("welcome");
  };

  const handleBackToTraining = () => {
    setCurrentScreen("training");
  };

  return (
    <div className="min-h-screen bg-background">
      {currentScreen === "welcome" && (
        <WelcomeScreen onProceed={handleWelcomeProceed} />
      )}

      {currentScreen === "training" && (
        <TrainingScreen
          onNext={handleTrainingNext}
          onBack={handleTrainingBack}
          initialGestures={gestures}
        />
      )}

      {currentScreen === "translation" && (
        <TranslationScreen
          gestures={gestures}
          onBackToTraining={handleBackToTraining}
        />
      )}
    </div>
  );
}
