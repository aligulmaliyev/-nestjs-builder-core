import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export function validateOrThrow<T extends object>(obj: T, ctor?: new () => T): void {
  const instance = ctor ? plainToInstance(ctor, obj) : obj;

  const errors = validateSync(instance as any, {
    whitelist: true,
    forbidUnknownValues: false, 
  });

  if (errors.length > 0) {
    throw new Error(JSON.stringify(errors, null, 2));
  }
}
