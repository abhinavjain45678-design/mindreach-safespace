import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { MindMate } from "@/components/MindMate";
import { ReachIn } from "@/components/ReachIn";
import { SafeSpace } from "@/components/SafeSpace";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

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
