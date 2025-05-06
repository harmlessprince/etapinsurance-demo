import { UnprocessableEntityException, ValidationError } from '@nestjs/common';

export function validationExceptionFactory(errors: ValidationError[]) {
  const formattedErrors = errors.map((err) => {
    const firstConstraintKey = Object.keys(err.constraints || {})[0];
    const firstMessage = err.constraints
      ? err.constraints[firstConstraintKey]
      : '';
    console.log(err);
    return {
      field: err.property,
      message: firstMessage, // Primary message
      // constraints: err.constraints, // All constraints
    };
  });

  return new UnprocessableEntityException({
    status: false,
    statusCode: 422,
    message: 'Validation failed',
    errors: formattedErrors,
  });
}
