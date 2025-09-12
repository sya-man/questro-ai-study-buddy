import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import PdfMcqGenerator from '@/components/mcq/PdfMcqGenerator';
import ImageSolver from '@/components/solver/ImageSolver';
import ChatHistory from '@/components/history/ChatHistory';
import ApiKeyManager from '@/components/settings/ApiKeyManager';
import UserSettings from '@/components/settings/UserSettings';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('chat');

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'pdf-mcq':
        return <PdfMcqGenerator />;
      case 'image-solver':
        return <ImageSolver />;
      case 'history':
        return <ChatHistory />;
      case 'api-keys':
        return <ApiKeyManager />;
      case 'settings':
        return <UserSettings />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="h-screen flex bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;