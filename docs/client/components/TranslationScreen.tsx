import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

interface TrainedGesture {
  id: string;
  name: string;
  samples: number;
}

interface TranslationScreenProps {
  gestures: TrainedGesture[];
  onBackToTraining: () => void;
}

export function TranslationScreen({
  gestures,
  onBackToTraining,
}: TranslationScreenProps) {
  const [recognizedText, setRecognizedText] = useState("Start Signing!");
  const [isDetecting, setIsDetecting] = useState(true);

  // Continuous gesture detection
  useEffect(() => {
    if (!isDetecting) return;

    const detectionInterval = setInterval(() => {
      if (gestures.length > 0) {
        // Randomly select from trained gestures
        const randomGesture =
          gestures[Math.floor(Math.random() * gestures.length)];
        setRecognizedText(randomGesture.name);
      }
    }, 2000);

    return () => clearInterval(detectionInterval);
  }, [isDetecting, gestures]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Title Bar */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Test Your Signs
          </h1>
          <p className="text-muted-foreground text-lg">
            Show gestures on camera to test recognition
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Feed */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden h-[400px] md:h-[500px] bg-gradient-to-br from-slate-900 to-slate-800 border-0 flex items-center justify-center mb-6 relative">
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                <div className="text-white text-center">
                  <div className="text-xl font-semibold">Camera Feed</div>
                  {isDetecting && (
                    <div className="text-sm mt-2 flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      Detecting...
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Pause/Resume Detection */}
            <Button
              onClick={() => setIsDetecting(!isDetecting)}
              className={`w-full text-lg py-6 rounded-lg ${
                isDetecting
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isDetecting ? "Pause Detection" : "Resume Detection"}
            </Button>
          </div>

          {/* Recognition Result & Controls Sidebar */}
          <div className="space-y-6">
            {/* Recognition Result */}
            <Card className="p-6 bg-white">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                Recognized Sign
              </h3>
              <div className="h-[140px] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6 flex items-center justify-center">
                <p className="text-3xl md:text-4xl font-bold text-foreground text-center">
                  {recognizedText}
                </p>
              </div>
            </Card>

            {/* Action Buttons */}
            <Card className="p-6 bg-white space-y-3">
              <Button
                onClick={onBackToTraining}
                variant="outline"
                className="w-full flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Train More Signs
              </Button>
            </Card>

            {/* Trained Gestures */}
            <Card className="p-6 bg-white">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                Trained Signs ({gestures.length})
              </h3>
              {gestures.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No signs trained yet
                </p>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {gestures.map((gesture) => (
                    <div
                      key={gesture.id}
                      className="p-2 bg-gray-50 rounded-lg border border-border"
                    >
                      <p className="font-medium text-sm text-foreground">
                        {gesture.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {gesture.samples} samples
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
