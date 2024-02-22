import { MessageCircle } from 'lucide-react';

interface ChatWelcomeProps {
  name: string;
}

const ChatWelcome = ({ name }: ChatWelcomeProps) => {
  return (
    <div className='space-y-2 px-4 mb-4'>
      <div className='h-[75px] w-[75px] rounded-full bg-zinc-500 flex items-center justify-center'>
        <MessageCircle className='h-12 w-12 text-white' />
      </div>

      <p className='text-xl md:text-3xl font-bold'>Welcome to {name}</p>
      <p className='text-zinc-600 text-sm'>
        This is the start of the {name} group chat
      </p>
    </div>
  );
};

export default ChatWelcome;
