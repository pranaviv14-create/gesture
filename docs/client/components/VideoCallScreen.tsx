import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PhoneOff, Mic, Video } from "lucide-react";

interface VideoCallScreenProps {
  onEndCall: () => void;
}

export function VideoCallScreen({ onEndCall }: VideoCallScreenProps) {
  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8 flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Local Video */}
        <Card className="overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-0 flex items-center justify-center h-[300px] md:h-[400px]">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
          <div className="absolute text-white/50 text-center">
            <div className="text-lg font-semibold">Your Video</div>
          </div>
        </Card>

        {/* Remote Video */}
        <Card className="overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-0 flex items-center justify-center h-[300px] md:h-[400px]">
          <iframe
            src="https://tokbox.com/embed/embed/ot-embed.js?embedId=f37957b6-0f91-4fc5-90ce-f818cc85b5bf&room=DEFAULT_ROOM&iframe=true"
            width="100%"
            height="100%"
            allow="microphone; camera"
            className="border-0"
          />
        </Card>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-slate-800 rounded-lg p-4">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-14 h-14 p-0 flex items-center justify-center hover:bg-slate-700"
        >
          <Mic className="w-6 h-6" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-14 h-14 p-0 flex items-center justify-center hover:bg-slate-700"
        >
          <Video className="w-6 h-6" />
        </Button>

        <Button
          onClick={onEndCall}
          size="lg"
          className="rounded-full w-14 h-14 p-0 flex items-center justify-center bg-red-500 hover:bg-red-600"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </Button>
      </div>
    </div>
  );
}
