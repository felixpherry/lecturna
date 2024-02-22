'use server';

import { revalidatePath } from 'next/cache';
import { db } from '../db';
import { ServerActionsResponse } from '@/types';
import { Faq } from '@prisma/client';

export const fetchFaq = async () => {
  try {
    return await db.faq.findMany({
      orderBy: {
        question: 'asc',
      },
    });
  } catch (error: any) {
    console.log('fetchFaq', error);
    throw new Error('Internal Server Error');
  }
};

export const addNewFaq = async (
  question: string,
  answer: string,
  pathname: string
): Promise<ServerActionsResponse<Faq>> => {
  try {
    const faq = await db.faq.create({
      data: {
        question,
        answer,
      },
    });

    revalidatePath(pathname);

    return {
      data: faq,
      error: null,
      message: 'Successfully added new faq',
    };
  } catch (error: any) {
    console.log('addNewFaq', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Failed to add new faq',
    };
  }
};

export const updateFaq = async (
  id: string,
  question: string,
  answer: string,
  pathname: string
): Promise<ServerActionsResponse<Faq>> => {
  try {
    const faq = await db.faq.update({
      where: { id },
      data: {
        question,
        answer,
      },
    });

    revalidatePath(pathname);

    return {
      data: faq,
      error: null,
      message: 'Successfully updated faq',
    };
  } catch (error: any) {
    console.log('updateFaq', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Failed to add new faq',
    };
  }
};

export const deleteFaq = async (
  id: string,
  pathname: string
): Promise<ServerActionsResponse<Faq>> => {
  try {
    const faq = await db.faq.delete({
      where: { id },
    });

    revalidatePath(pathname);

    return {
      data: faq,
      error: null,
      message: 'Successfully deleted faq',
    };
  } catch (error: any) {
    console.log('deleteFaq', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Failed to add new faq',
    };
  }
};
