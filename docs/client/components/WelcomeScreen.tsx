import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface WelcomeScreenProps {
  onProceed: () => void;
}

export function WelcomeScreen({ onProceed }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8 inline-block p-4 bg-primary rounded-2xl">
          <Zap className="w-16 h-16 text-white" />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
          Sign Language
          <br />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Translator
          </span>
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={onProceed}
            size="lg"
            className="text-lg px-8 py-6 rounded-lg bg-primary hover:bg-primary/90"
          >
            Get Started
          </Button>
        </div>

        <div className="text-sm text-muted-foreground mt-16">
          <p>Made by Praneeth Pranavi Siddarth</p>
        </div>
      </div>
    </div>
  );
}
