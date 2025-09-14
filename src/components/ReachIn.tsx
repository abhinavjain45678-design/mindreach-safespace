import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Wind, 
  Heart, 
  Shield, 
  Volume2,
  Headphones,
  Moon,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BreathingSession {
  phase: 'inhale' | 'hold' | 'exhale' | 'pause';
  count: number;
  cycle: number;
  totalCycles: number;
}

export function ReachIn() {
  const [isListening, setIsListening] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingSession, setBreathingSession] = useState<BreathingSession>({
    phase: 'inhale',
    count: 0,
    cycle: 1,
    totalCycles: 5
  });
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [isOffline] = useState(true); // Simulated offline mode
  
  const intervalRef = useRef<NodeJS.Timeout>();

  const exercises = [
    {
      id: 'box-breathing',
      title: '4-4-4-4 Box Breathing',
      description: 'Inhale 4, hold 4, exhale 4, pause 4',
      icon: Wind,
      duration: '5 minutes',
      difficulty: 'Beginner'
    },
    {
      id: 'calming-breath',
      title: '4-7-8 Calming Breath',
      description: 'Inhale 4, hold 7, exhale 8',
      icon: Moon,
      duration: '3 minutes', 
      difficulty: 'Intermediate'
    },
    {
      id: 'grounding',
      title: '5-4-3-2-1 Grounding',
      description: 'Mindfulness technique using your senses',
      icon: Sparkles,
      duration: '5 minutes',
      difficulty: 'Beginner'
    }
  ];

  const affirmations = [
    "You are safe in this moment",
    "Your feelings are valid and temporary", 
    "You have the strength to get through this",
    "It's okay to take things one breath at a time",
    "You are worthy of love and care",
    "This feeling will pass",
    "You are doing your best, and that's enough"
  ];

  const voiceCommands = [
    "Start breathing exercise",
    "Play affirmations",
    "Begin grounding technique", 
    "Help me feel calm",
    "I need support"
  ];

  const startBreathingExercise = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setIsBreathing(true);
    setBreathingSession({
      phase: 'inhale',
      count: 0,
      cycle: 1,
      totalCycles: 5
    });

    // Simulate breathing rhythm
    intervalRef.current = setInterval(() => {
      setBreathingSession(prev => {
        const timings = exerciseId === 'box-breathing' 
          ? { inhale: 4, hold: 4, exhale: 4, pause: 4 }
          : { inhale: 4, hold: 7, exhale: 8, pause: 2 };

        let newCount = prev.count + 1;
        let newPhase = prev.phase;
        let newCycle = prev.cycle;

        // Phase transitions based on count
        if (prev.phase === 'inhale' && newCount > timings.inhale) {
          newPhase = 'hold';
          newCount = 1;
        } else if (prev.phase === 'hold' && newCount > timings.hold) {
          newPhase = 'exhale';
          newCount = 1;
        } else if (prev.phase === 'exhale' && newCount > timings.exhale) {
          newPhase = 'pause';
          newCount = 1;
        } else if (prev.phase === 'pause' && newCount > timings.pause) {
          newPhase = 'inhale';
          newCount = 1;
          newCycle = prev.cycle + 1;
        }

        if (newCycle > prev.totalCycles) {
          clearInterval(intervalRef.current);
          setIsBreathing(false);
          return prev;
        }

        return {
          ...prev,
          phase: newPhase,
          count: newCount,
          cycle: newCycle
        };
      });
    }, 1000);
  };

  const stopBreathingExercise = () => {
    setIsBreathing(false);
    setSelectedExercise(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real app, this would start/stop speech recognition
  };

  const getBreathingInstruction = () => {
    const { phase, count } = breathingSession;
    const instructions = {
      inhale: `Breathe in slowly... ${count}`,
      hold: `Hold your breath... ${count}`, 
      exhale: `Breathe out gently... ${count}`,
      pause: `Rest... ${count}`
    };
    return instructions[phase];
  };

  const getPhaseProgress = () => {
    const { phase, count } = breathingSession;
    const maxCounts = selectedExercise === 'box-breathing' 
      ? { inhale: 4, hold: 4, exhale: 4, pause: 4 }
      : { inhale: 4, hold: 7, exhale: 8, pause: 2 };
    
    return (count / maxCounts[phase]) * 100;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/30 dark:to-violet-950/20 p-4 lg:pl-64 pt-20 lg:pt-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-wellness">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-purple-700 dark:text-purple-300">ReachIn</h1>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">Offline AI Assistant</Badge>
                {isOffline && (
                  <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    Offline Ready
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <p className="text-purple-600 dark:text-purple-400 max-w-2xl mx-auto">
            Your private voice companion for breathing exercises, grounding techniques, and gentle support. 
            Everything works offline to protect your privacy.
          </p>
        </div>

        {/* Voice Control */}
        <Card className="bg-white/70 dark:bg-black/20 backdrop-blur-sm border-0 shadow-wellness">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-purple-600" />
              Voice Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <Button
                onClick={toggleListening}
                variant={isListening ? "destructive" : "default"}
                size="lg"
                className={cn(
                  "w-24 h-24 rounded-full shadow-wellness",
                  isListening 
                    ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                    : "bg-purple-600 hover:bg-purple-700"
                )}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </Button>
            </div>
            
            <div className="text-center">
              <p className="font-medium mb-2">
                {isListening ? "I'm listening... Speak naturally" : "Tap to start voice control"}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Try saying: "{voiceCommands[Math.floor(Math.random() * voiceCommands.length)]}"
              </p>
            </div>

            {isListening && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Voice Commands Available:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {voiceCommands.map((command, index) => (
                    <div key={index} className="text-xs bg-white/50 dark:bg-black/10 p-2 rounded">
                      "{command}"
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Breathing Exercises */}
        <Card className="bg-white/70 dark:bg-black/20 backdrop-blur-sm border-0 shadow-wellness">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-purple-600" />
              Breathing Exercises
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Exercise Selection */}
            {!isBreathing && (
              <div className="grid gap-4">
                {exercises.map((exercise) => {
                  const IconComponent = exercise.icon;
                  return (
                    <Button
                      key={exercise.id}
                      variant="outline"
                      className="p-6 h-auto justify-between bg-white/50 dark:bg-black/10 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                      onClick={() => startBreathingExercise(exercise.id)}
                    >
                      <div className="flex items-center gap-4">
                        <IconComponent className="w-6 h-6 text-purple-600" />
                        <div className="text-left">
                          <div className="font-medium">{exercise.title}</div>
                          <div className="text-sm text-muted-foreground">{exercise.description}</div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-purple-600">{exercise.duration}</div>
                        <div className="text-muted-foreground">{exercise.difficulty}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            )}

            {/* Active Breathing Session */}
            {isBreathing && selectedExercise && (
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <Badge variant="secondary">
                    Cycle {breathingSession.cycle} of {breathingSession.totalCycles}
                  </Badge>
                  <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {getBreathingInstruction()}
                  </h3>
                </div>

                {/* Breathing Visualization */}
                <div className="relative w-32 h-32 mx-auto">
                  <div className={cn(
                    "absolute inset-0 rounded-full border-4 border-purple-300 transition-all duration-1000",
                    breathingSession.phase === 'inhale' && "scale-125 border-purple-500",
                    breathingSession.phase === 'hold' && "scale-125 border-blue-500", 
                    breathingSession.phase === 'exhale' && "scale-75 border-green-500",
                    breathingSession.phase === 'pause' && "scale-75 border-purple-300"
                  )}>
                    <div className={cn(
                      "absolute inset-4 rounded-full transition-all duration-1000",
                      breathingSession.phase === 'inhale' && "bg-purple-200 dark:bg-purple-800",
                      breathingSession.phase === 'hold' && "bg-blue-200 dark:bg-blue-800",
                      breathingSession.phase === 'exhale' && "bg-green-200 dark:bg-green-800", 
                      breathingSession.phase === 'pause' && "bg-purple-100 dark:bg-purple-900"
                    )}></div>
                  </div>
                </div>

                <Progress value={getPhaseProgress()} className="w-64 mx-auto" />

                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={stopBreathingExercise}>
                    <Pause className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                  <Button variant="outline" onClick={() => startBreathingExercise(selectedExercise)}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restart
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Affirmations */}
        <Card className="bg-white/70 dark:bg-black/20 backdrop-blur-sm border-0 shadow-wellness">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-purple-600 fill-current" />
              Gentle Affirmations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {affirmations.map((affirmation, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                  <p className="text-center font-medium text-purple-700 dark:text-purple-300">
                    "{affirmation}"
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 border border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
                  Complete Privacy Protection
                </h3>
                <p className="text-sm text-purple-600 dark:text-purple-400 leading-relaxed">
                  ReachIn works entirely on your device. No voice data, breathing patterns, or usage information 
                  is ever transmitted or stored. Perfect for confidential self-care in any environment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}