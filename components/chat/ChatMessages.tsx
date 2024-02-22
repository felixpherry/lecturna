'use client';

import ChatWelcome from './ChatWelcome';
import { useChatQuery } from '@/hooks/useChatQuery';
import { Loader2, ServerCrash } from 'lucide-react';
import { Fragment, useRef, ElementRef } from 'react';
import ChatItem from './ChatItem';
import { format } from 'date-fns';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useChatScroll } from '@/hooks/useChatScroll';
import { Account, Instructor, Message, Student } from '@prisma/client';

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

interface ChatMessagesProps {
  name: string;
  member: Student | Instructor;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  classId: string;
}

type MessageWithMemberWithAccount = Message & {
  instructor: {
    account: Account;
  } & Instructor;
  student: {
    account: Account;
  } & Student;
};

const ChatMessages = ({
  apiUrl,
  classId,
  member,
  name,
  socketQuery,
  socketUrl,
}: ChatMessagesProps) => {
  const queryKey = `chat:${classId}`;
  const addKey = `chat:${classId}:messages`;
  const updateKey = `chat:${classId}:messages:update`;

  const chatRef = useRef<ElementRef<'div'>>(null);
  const bottomRef = useRef<ElementRef<'div'>>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useChatQuery({
    queryKey,
    apiUrl,
    classId,
  });

  useChatSocket({
    addKey,
    updateKey,
    queryKey,
  });

  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (isLoading) {
    return (
      <div className='flex flex-1 flex-col justify-center items-center'>
        <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
        <p className='text-xs text-zinc-500'>Loading messages...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='flex flex-1 flex-col justify-center items-center'>
        <ServerCrash className='h-7 w-7 text-zinc-500 my-4' />
        <p className='text-xs text-zinc-500'>Something went wrong!</p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className='flex-1 flex flex-col py-4 overflow-y-auto'>
      {!hasNextPage && <div className='flex-1' />}
      {!hasNextPage && <ChatWelcome name={name} />}
      {hasNextPage && (
        <div className='flex justify-center'>
          {isFetchingNextPage ? (
            <Loader2 className='h-6 w-6 text-zinc-500 animate-spin my-4' />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className='text-zinc-500 hover:text-zinc-600 text-xs my-4 transition'
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className='flex flex-col-reverse mt-auto'>
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithAccount) => (
              <ChatItem
                currentMember={member}
                key={message.id}
                id={message.id}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.isDeleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
                member={
                  message.instructor ? message.instructor : message.student
                }
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
