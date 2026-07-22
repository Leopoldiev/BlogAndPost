import { FieldError } from '../types/field-error';

export const CreateErrorMessage = (
  errors: FieldError[],
): { errorsMessages: FieldError[] | null } => {
  return { errorsMessages: errors };
};
