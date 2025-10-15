import { BuilderService } from './builder.service';
import { Builder } from './types';

/**
 * Factory function that creates a new type-safe {@link BuilderService}
 * instance for the given class or entity.
 *
 * This function wraps a {@link BuilderService} and returns it as a
 * `Builder<T>` type — which automatically includes dynamically generated
 * `setX()` methods for every property in the class.
 *
 * @template T - The class or entity type that will be constructed by the builder.
 *
 * @param model - The class constructor (e.g. `User`, `AdminUser`) for which
 *                a new builder should be created.
 *
 * @returns A {@link Builder} instance that supports:
 * - `setX()` dynamic setter methods
 * - `.build()` / `.buildAsync()` for validation and construction
 * - `.from()` for partial object initialization
 * - `.reset()` for resetting the internal instance
 *
 * @example
 * ```ts
 * import { createBuilder } from '@nestjs-builder/core';
 * import { User } from './user.entity';
 *
 * const userBuilder = createBuilder(User);
 * const user = userBuilder
 *   .setUsername('ali')
 *   .setEmail('ali@example.com')
 *   .setPassword('12345')
 *   .build();
 * ```
 */
export function createBuilder<T extends object>(
  model: new () => T,
): Builder<T> {
  const service = new BuilderService(model);
  return service as Builder<T>;
}
