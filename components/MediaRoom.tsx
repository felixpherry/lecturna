'use client';

import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SessionInterface } from '@/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface MediaRoomProps {
  session: SessionInterface;
  classId: string;
  video: boolean;
  audio: boolean;
}

const MediaRoom = ({ session, audio, classId, video }: MediaRoomProps) => {
  const [token, setToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!session) return;

    const name = session.user.name;
    (async () => {
      try {
        const response = await fetch(
          `/api/livekit?room=${classId}&username=${name}`
        );
        const data = await response.json();
        setToken(data.token);
      } catch (error: any) {
        toast.error(error.message);
      }
    })();
  }, [session, classId]);

  if (token === '') {
    return (
      <div className='flex flex-1 flex-col justify-center items-center'>
        <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
        <p className='text-xs text-zinc-500'>Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme='default'
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
      onDisconnected={() => router.push(`/classes/${classId}/sessions`)}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default MediaRoom;
