import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Trash2, Plus } from "lucide-react";

interface TrainedGesture {
  id: string;
  name: string;
  samples: number;
}

interface GestureTrainingProps {
  onNext: (gestures: TrainedGesture[]) => void;
  onBack: () => void;
  initialGestures?: TrainedGesture[];
}

export function TrainingScreen({
  onNext,
  onBack,
  initialGestures = [],
}: GestureTrainingProps) {
  const [gestures, setGestures] = useState<TrainedGesture[]>(initialGestures);
  const [newGestureName, setNewGestureName] = useState("");
  const [activeGestureId, setActiveGestureId] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleAddGesture = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGestureName.trim()) {
      const newGesture: TrainedGesture = {
        id: Math.random().toString(),
        name: newGestureName,
        samples: 0,
      };
      setGestures([...gestures, newGesture]);
      setActiveGestureId(newGesture.id);
      setNewGestureName("");
    }
  };

  const handleCapture = (gestureId: string) => {
    setIsCapturing(true);
    setTimeout(() => {
      setGestures(
        gestures.map((g) => {
          if (g.id === gestureId && g.samples < 30) {
            return { ...g, samples: g.samples + 1 };
          }
          return g;
        }),
      );
      setIsCapturing(false);
    }, 1500);
  };

  const handleDeleteGesture = (gestureId: string) => {
    setGestures(gestures.filter((g) => g.id !== gestureId));
    if (activeGestureId === gestureId) {
      setActiveGestureId(gestures.length > 1 ? gestures[0].id : null);
    }
  };

  const handleClearGestureSamples = (gestureId: string) => {
    setGestures(
      gestures.map((g) => (g.id === gestureId ? { ...g, samples: 0 } : g)),
    );
  };

  const activeGesture = gestures.find((g) => g.id === activeGestureId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Title Bar */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Train Your Signs
          </h1>
          <p className="text-muted-foreground text-lg">
            Add custom signs and capture 30 samples for each. Click capture
            while showing the sign on camera.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Feed */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden h-[400px] md:h-[500px] bg-gradient-to-br from-slate-900 to-slate-800 border-0 flex items-center justify-center">
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
              <div className="absolute text-white/50 text-center">
                <div className="text-xl font-semibold">Camera feed</div>
                {activeGesture && (
                  <div className="text-lg mt-2">
                    Showing:{" "}
                    <span className="font-bold">{activeGesture.name}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Capture Controls */}
            {activeGesture && (
              <div className="mt-6 space-y-4">
                <Button
                  onClick={() => handleCapture(activeGesture.id)}
                  disabled={isCapturing || activeGesture.samples >= 30}
                  className={`w-full text-lg py-6 rounded-lg ${
                    isCapturing
                      ? "bg-red-500 hover:bg-red-600"
                      : activeGesture.samples >= 30
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {isCapturing
                    ? "Capturing..."
                    : activeGesture.samples >= 30
                      ? "Complete ✓"
                      : "Capture"}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Progress: {activeGesture.samples}/30
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all"
                      style={{
                        width: `${(activeGesture.samples / 30) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {activeGesture.samples > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleClearGestureSamples(activeGesture.id)}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Samples
                  </Button>
                )}
              </div>
            )}

            {!activeGesture && gestures.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-center text-muted-foreground">
                  Select a sign from the list to start capturing
                </p>
              </div>
            )}

            {gestures.length === 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-center text-muted-foreground">
                  Add your first sign using the form on the right
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Add Gesture & Gesture List */}
          <div className="space-y-6">
            {/* Add Gesture Form */}
            <Card className="p-6 bg-white">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                Add New Sign
              </h3>
              <form onSubmit={handleAddGesture} className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter sign name (e.g., hello, goodbye)"
                  value={newGestureName}
                  onChange={(e) => setNewGestureName(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  maxLength={30}
                />
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sign
                </Button>
              </form>
            </Card>

            {/* Trained Gestures List */}
            <Card className="p-6 bg-white">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                Signs ({gestures.length})
              </h3>

              {gestures.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No signs added yet
                </p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {gestures.map((gesture) => (
                    <div
                      key={gesture.id}
                      onClick={() => setActiveGestureId(gesture.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
                        activeGestureId === gesture.id
                          ? "border-primary bg-primary/5"
                          : "border-transparent hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-foreground">
                          {gesture.name}
                        </p>
                        {gesture.samples >= 30 && (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                      </div>

                      <div className="mb-2">
                        <p className="text-xs text-muted-foreground mb-1">
                          {gesture.samples}/30
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full transition-all"
                            style={{
                              width: `${(gesture.samples / 30) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGesture(gesture.id);
                        }}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="px-8 py-2 text-base"
          >
            Back to Menu
          </Button>

          <Button
            onClick={() => onNext(gestures)}
            disabled={gestures.length === 0}
            className="px-8 py-2 text-base bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            Next: Test Signs
          </Button>
        </div>
      </div>
    </div>
  );
}
