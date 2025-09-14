import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { MindMate } from "@/components/MindMate";

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderActiveView = () => {
    switch (activeView) {
      case 'mindmate':
        return <MindMate />;
      case 'reachin':
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/30 dark:to-violet-950/20 p-4 lg:pl-64 pt-20 lg:pt-8 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-4">ReachIn Voice Assistant</h1>
              <p className="text-purple-600 dark:text-purple-400">Coming soon - Private offline AI voice companion</p>
            </div>
          </div>
        );
      case 'safespace':
        return (
          <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/30 dark:to-amber-950/20 p-4 lg:pl-64 pt-20 lg:pt-8 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-orange-700 dark:text-orange-300 mb-4">SafeSpace Community</h1>
              <p className="text-orange-600 dark:text-orange-400">Coming soon - Anonymous peer support network</p>
            </div>
          </div>
        );
      default:
        return <Dashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      {renderActiveView()}
    </div>
  );
};

export default Index;
