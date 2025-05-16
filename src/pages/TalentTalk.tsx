import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import TalentTalkChatbot from '@/components/chatbot/TalentTalk';

const TalentTalk = () => {
  return (
    <MainLayout>
      <Header 
        title="TalentTalk Assistant" 
        subtitle="Interact with your AI recruitment assistant via chat or voice commands"
      />
      
      <div className="flex flex-col flex-1 h-[calc(100vh-10rem)]">
        <div className="max-w-5xl mx-auto w-full h-full">
          <TalentTalkChatbot />
        </div>
      </div>
    </MainLayout>
  );
};

export default TalentTalk;
