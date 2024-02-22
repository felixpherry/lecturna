'use client';

import { ConfirmModal } from '@/components/modals/ConfirmModal';
import ActionTooltip from '@/components/shared/ActionTooltip';
import { Button } from '@/components/ui/button';
import { deleteCourseEvaluation } from '@/lib/actions/course.actions';
import { cn } from '@/lib/utils';
import { CourseEvaluation } from '@prisma/client';
import { CalendarCheck, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useReducer } from 'react';
import EvaluationForm from './EvaluationForm';
import { toast } from 'sonner';

interface EvaluationListProps {
  evaluations: CourseEvaluation[];
}

type EvaluationFormState = {
  formType: 'ADD' | 'EDIT' | null;
  evaluationId: string | null;
  showForm: Boolean;
};

type EvaluationFormAction =
  | {
      type: 'CLOSE_FORM' | 'OPEN_ADD_FORM';
    }
  | {
      type: 'OPEN_EDIT_FORM';
      payload: { evaluationId: string };
    };

const evaluationFormReducer = (
  state: EvaluationFormState,
  action: EvaluationFormAction
): EvaluationFormState => {
  const { type } = action;
  switch (type) {
    case 'OPEN_ADD_FORM':
      return {
        ...state,
        showForm: true,
        evaluationId: null,
        formType: 'ADD',
      };
    case 'CLOSE_FORM':
      return {
        ...state,
        showForm: false,
        evaluationId: null,
        formType: null,
      };
    case 'OPEN_EDIT_FORM':
      return {
        ...state,
        showForm: true,
        evaluationId: action.payload.evaluationId,
        formType: 'EDIT',
      };
    default:
      return {
        ...state,
      };
  }
};

const EvaluationsList = ({ evaluations }: EvaluationListProps) => {
  const pathname = usePathname()!;
  const router = useRouter();

  const [state, dispatch] = useReducer(evaluationFormReducer, {
    formType: null,
    evaluationId: null,
    showForm: false,
  });

  const { evaluationId, formType, showForm } = state;
  const initialFormData = evaluations.find(({ id }) => id === evaluationId);

  const hasSessionReportEvaluation: boolean = !!evaluations.find(
    ({ id, isSessionReport }) => id !== evaluationId && isSessionReport === true
  );

  const handleDeleteEvaluation = async (id: string) => {
    try {
      const { error, message } = await deleteCourseEvaluation({
        courseEvaluationId: id,
        pathname,
      });
      if (error !== null) throw new Error(message);
      toast.success(message);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className='relative mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Evaluations
        <Button
          onClick={() =>
            dispatch(
              showForm
                ? {
                    type: 'CLOSE_FORM',
                  }
                : {
                    type: 'OPEN_ADD_FORM',
                  }
            )
          }
          variant='ghost'
        >
          {showForm ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add a new evaluation
            </>
          )}
        </Button>
      </div>

      {!showForm && (
        <div
          className={cn(
            'text-sm mt-2',
            !evaluations.length && 'text-slate-500 italic'
          )}
        >
          {!evaluations.length && 'No evaluations'}

          <div className='flex flex-col gap-5'>
            {evaluations.map(
              ({ id, isSessionReport, name, weight, description }) => (
                <div
                  key={id}
                  className='flex flex-col gap-y-1 bg-sky-100 border-sky-200 rounded-md p-5'
                >
                  <div className='flex justify-between items-center'>
                    <p className='font-semibold flex items-center gap-3'>
                      {`${name} (${weight}%)`}
                      {isSessionReport && (
                        <ActionTooltip label='Session Report'>
                          <CalendarCheck className='h-5 w-5 text-emerald-600' />
                        </ActionTooltip>
                      )}
                    </p>

                    <div className='flex items-center gap-3'>
                      <Pencil
                        onClick={() =>
                          dispatch({
                            type: 'OPEN_EDIT_FORM',
                            payload: {
                              evaluationId: id,
                            },
                          })
                        }
                        className='text-primary-blue h-5 w-5 cursor-pointer'
                      />
                      <ConfirmModal
                        title='Are you sure'
                        description='Do you want to remove this course evaluation?'
                        onConfirm={() => handleDeleteEvaluation(id)}
                      >
                        <Trash2 className='text-rose-500 h-5 w-5 cursor-pointer' />
                      </ConfirmModal>
                    </div>
                  </div>
                  <p className='text-muted-foreground'>{description}</p>
                </div>
              )
            )}
          </div>
        </div>
      )}
      {showForm && formType !== null && (
        <EvaluationForm
          type={formType}
          closeForm={() =>
            dispatch({
              type: 'CLOSE_FORM',
            })
          }
          initialData={initialFormData}
          hasSessionReportEvaluation={hasSessionReportEvaluation}
        />
      )}
    </div>
  );
};

export default EvaluationsList;
