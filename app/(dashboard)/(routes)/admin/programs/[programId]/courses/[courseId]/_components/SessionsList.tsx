'use client';

import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

import { cn } from '@/lib/utils';
import { Grip, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Session } from '@prisma/client';

interface SessionsListProps {
  items: Session[];
  onReorder: (updateData: { id: string; sessionNumber: number }[]) => void;
  onEdit: (id: string) => void;
}

const SessionsList = ({ items, onReorder, onEdit }: SessionsListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [sessions, setSessions] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setSessions(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = [...sessions];

    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedSessions = items.slice(startIndex, endIndex + 1);
    setSessions(items);

    const bulkUpdateData = updatedSessions.map((session) => ({
      id: session.id,
      sessionNumber: items.findIndex((item) => item.id === session.id) + 1,
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='sessions'>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {sessions.map((session, idx) => (
              <Draggable key={session.id} draggableId={session.id} index={idx}>
                {(providedInner) => (
                  <div
                    className={cn(
                      'flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm',
                      session.isPublished &&
                        'bg-sky-100 border-sky-200 text-sky-700'
                    )}
                    ref={providedInner.innerRef}
                    {...providedInner.draggableProps}
                  >
                    <div
                      className={cn(
                        'px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition',
                        session.isPublished &&
                          'border-r-sky-200 hover:bg-sky-200'
                      )}
                      {...providedInner.dragHandleProps}
                    >
                      <Grip className='h-5 w-5' />
                    </div>
                    {session.main}
                    <div className='ml-auto pr-2 flex items-center gap-x-2'>
                      <Badge
                        className={cn(
                          'bg-slate-500',
                          session.isPublished && 'bg-sky-700'
                        )}
                      >
                        {session.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(session.id)}
                        className='w-4 h-4 cursor-pointer hover:opacity-75 transition'
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SessionsList;
