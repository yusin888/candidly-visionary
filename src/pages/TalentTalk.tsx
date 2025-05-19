import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import TalentTalkChatbot from '@/components/chatbot/TalentTalk';

const TalentTalk = () => {
  return (
    <MainLayout>
      <Header 
        title="TalentTalk HR Assistant" 
        subtitle="Your AI-powered recruitment assistant that helps streamline your HR processes"
      />
      
      <div className="flex flex-col flex-1 h-[calc(100vh-10rem)] p-4">
        <div className="max-w-4xl mx-auto w-full h-full bg-gray-50 rounded-xl overflow-hidden shadow-lg">
          <TalentTalkChatbot />
        </div>
      </div>
    </MainLayout>
  );
};

export default TalentTalk;
