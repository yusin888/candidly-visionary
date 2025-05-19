import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Declare the custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        'agent-id': string;
      }, HTMLElement>;
    }
  }
}

interface Message {
  sender: 'user' | 'bot' | 'error' | 'feedback';
  content: string;
}

const TalentTalk = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', content: "Hello! I'm TalentTalk, your HR assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showConvai, setShowConvai] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_URL = 'https://8630-34-82-31-126.ngrok-free.app/simple_chat';
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    // Focus the input when component mounts
    const input = document.querySelector('input');
    if (input) input.focus();
  }, []);
  
  // Initialize ElevenLabs Convai widget when component mounts
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.type = 'text/javascript';
    
    // Append script to document
    document.body.appendChild(script);
    
    // Clean up on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage = { sender: 'user' as const, content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    
    // Set loading state
    setIsLoading(true);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: input
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response received:', data);
      
      // Show bot response
      if (data.reply) {
        setMessages(prev => [...prev, {
          sender: 'bot' as const,
          content: data.reply
        }]);
      }
      
      // Show error if present
      if (data.ollama_error) {
        console.error('API error:', data.ollama_error);
        setMessages(prev => [...prev, {
          sender: 'error' as const,
          content: `Error: ${data.ollama_error}`
        }]);
      }
      
      // Show function call feedback if present
      if (data.function_call_feedback) {
        setMessages(prev => [...prev, {
          sender: 'feedback' as const,
          content: `Action Result: ${data.function_call_feedback}`
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        sender: 'error' as const,
        content: `Failed to get response: ${error instanceof Error ? error.message : 'Unknown error'}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const toggleListening = () => {
    setIsListening(!isListening);
    setShowConvai(!showConvai);
    
    // If turning off, remove the widget from display
    if (isListening) {
      const widgetElement = document.querySelector('elevenlabs-convai');
      if (widgetElement) {
        (widgetElement as HTMLElement).style.display = 'none';
      }
    }
  };
  
  return (
    <div className="w-full h-full flex flex-col rounded-lg overflow-hidden shadow-lg bg-white">
      <div className="bg-[#2c3e50] text-white p-4 text-center text-lg font-medium">
        TalentTalk HR Assistant
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "p-3 rounded-[18px] max-w-[80%] break-words",
              message.sender === 'user' 
                ? "self-end bg-[#3498db] text-white rounded-br-[5px]" 
                : message.sender === 'bot'
                  ? "self-start bg-[#e9e9eb] text-[#333] rounded-bl-[5px]"
                  : message.sender === 'error'
                    ? "self-start bg-[#e74c3c] text-white rounded-bl-[5px]"
                    : "self-start bg-[#2ecc71] text-white rounded-bl-[5px]"
            )}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="self-start bg-[#e9e9eb] p-2 rounded-[18px] rounded-bl-[5px]">
            <div className="flex space-x-1">
              <span className="inline-block w-2 h-2 bg-[#666] rounded-full animate-bounce"></span>
              <span className="inline-block w-2 h-2 bg-[#666] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="inline-block w-2 h-2 bg-[#666] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex p-3 border-t border-[#e9e9eb]">
        <Button
          className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center",
            isListening 
              ? "bg-[#e74c3c] text-white hover:bg-[#c0392b]" 
              : "bg-[#ecf0f1] text-[#7f8c8d] hover:bg-[#bdc3c7]"
          )}
          onClick={toggleListening}
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        
        <Input
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-4 py-2 mx-2 border border-[#ddd] rounded-full focus:outline-none focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
          disabled={isLoading}
        />
        
        <Button
          className={cn(
            "bg-[#2c3e50] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#1a252f]",
            (isLoading || !input.trim()) && "bg-[#95a5a6] cursor-not-allowed hover:bg-[#95a5a6]"
          )}
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
        >
          <SendHorizonal className="h-5 w-5" />
        </Button>
      </div>
      
      {showConvai && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center">
          <div className="p-4 bg-white rounded-lg shadow-lg">
            <elevenlabs-convai agent-id="huqI2oX34TEk8vBTQvKh"></elevenlabs-convai>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentTalk;
