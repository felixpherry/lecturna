'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

interface ErrorNotificationProps {
  error: string;
}

const ErrorNotification = ({ error }: ErrorNotificationProps) => {
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        toast.error(error);
      }, 0);
    }
  }, [error]);

  return null;
};

export default ErrorNotification;
