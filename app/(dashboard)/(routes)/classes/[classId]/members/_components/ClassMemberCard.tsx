import Image from 'next/image';
import StudentReportModal from './StudentReportModal';
import { SessionInterface } from '@/types';

interface ClassMemberCard {
  type: 'STUDENT' | 'INSTRUCTOR';
  id?: string;
  classId?: string;
  image: string;
  name: string;
  email: string;
  studentId?: string;
  session?: SessionInterface;
}

const ClassMemberCard = ({
  classId,
  email,
  image,
  name,
  type,
  studentId,
  id,
  session,
}: ClassMemberCard) => {
  return (
    <div className='p-8 rounded-md bg-white shadow'>
      <div className='flex items-center justify-center'>
        <div className='flex flex-col gap-5'>
          <div className='flex flex-col gap-1 items-center'>
            <Image
              src={image}
              height={75}
              width={75}
              alt={name}
              className='h-24 w-fit rounded-full mb-4'
            />
            <h3 className='text-primary text-lg font-bold'>{name}</h3>
            {studentId && type === 'STUDENT' && (
              <p className='text-primary text-base font-medium'>{studentId}</p>
            )}
            <p className='text-muted-foreground text-base'>{email}</p>
          </div>
          {id &&
            type === 'STUDENT' &&
            classId &&
            session?.user.role === 'INSTRUCTOR' && (
              <StudentReportModal classId={classId} studentId={id} />
            )}
        </div>
      </div>
    </div>
  );
};

export default ClassMemberCard;
