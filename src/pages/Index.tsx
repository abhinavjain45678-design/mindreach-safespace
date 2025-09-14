import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { MindMate } from "@/components/MindMate";
import { ReachIn } from "@/components/ReachIn";
import { SafeSpace } from "@/components/SafeSpace";

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderActiveView = () => {
    switch (activeView) {
      case 'mindmate':
        return <MindMate />;
      case 'reachin':
        return <ReachIn />;
      case 'safespace':
        return <SafeSpace />;
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
