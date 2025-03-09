
import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { chatbotMessages } from '@/lib/data';

interface Message {
  sender: 'user' | 'bot';
  content: string;
}

const TalentTalk = () => {
  const [messages, setMessages] = useState<Message[]>(
    // Type assertion to ensure the imported data matches our interface
    chatbotMessages as Message[]
  );
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages([...messages, { sender: 'user', content: input }]);
    setInput('');
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: 'bot',
        content: getRandomResponse(input)
      }]);
    }, 1000);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const toggleListening = () => {
    if (!isListening) {
      // Check if browser supports speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        setIsListening(true);
        // This is just a simulation for the demo
        setTimeout(() => {
          setInput('Show me the top candidates for Software Engineer');
          setIsListening(false);
        }, 3000);
      } else {
        alert('Speech recognition is not supported in this browser.');
      }
    } else {
      setIsListening(false);
    }
  };
  
  // Simple responses for demo purposes
  const getRandomResponse = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    
    if (lowercaseQuery.includes('top candidates')) {
      return "I found 3 top-ranked candidates matching your criteria: Alex Johnson (91.7), James Wilson (90.7), and David Kim (90.7). Would you like to see their detailed profiles?";
    }
    
    if (lowercaseQuery.includes('average') || lowercaseQuery.includes('score')) {
      return "The average final score across all candidates is 86.3. This is a 5% improvement from the previous month. Technical scores are particularly strong at 89.2 on average.";
    }
    
    if (lowercaseQuery.includes('progress') || lowercaseQuery.includes('pipeline')) {
      return "Currently there are 24 candidates in the final ranking stage. The biggest bottleneck is in the soft skills evaluation with 16 candidates pending for over 5 days.";
    }
    
    return "I'm here to help with candidate information and insights. You can ask me about top candidates, scores, pipeline progress, or specific candidate details.";
  };
  
  return (
    <div className="glass-card h-[600px] flex flex-col">
      <div className="p-4 border-b border-border/50">
        <h3 className="text-lg font-medium">TalentTalk Assistant</h3>
        <p className="text-sm text-muted-foreground">
          Ask questions or use voice commands to get insights about candidates
        </p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "max-w-[80%] p-4 rounded-xl animate-fade-in",
                message.sender === 'user' 
                  ? "ml-auto bg-primary text-primary-foreground rounded-br-none" 
                  : "mr-auto glass rounded-bl-none"
              )}
            >
              {message.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center space-x-2">
          <Button
            variant={isListening ? "default" : "outline"}
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full",
              isListening && "animate-pulse bg-accent text-accent-foreground"
            )}
            onClick={toggleListening}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <Input
            placeholder="Type a message or press mic to speak..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          
          <Button
            variant="default"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TalentTalk;
