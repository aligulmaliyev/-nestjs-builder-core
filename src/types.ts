import type { BuilderService } from "./builder.service";

/**
 * A mapped type that dynamically generates `setX()` methods
 * for every property in the given object type `T`.
 *
 * Each generated setter:
 * - Uses the property name (capitalized) as part of the method name
 * - Accepts the corresponding property type as its argument
 * - Returns the same `Builder<T>` instance to allow method chaining
 *
 * @example
 * ```ts
 * interface User {
 *   username: string;
 *   email: string;
 *   password: string;
 * }
 *
 * // Generates:
 * // setUsername(value: string): Builder<User>
 * // setEmail(value: string): Builder<User>
 * // setPassword(value: string): Builder<User>
 * ```
 *
 * @template T - The object/class type for which setters should be generated.
 */
export type SetterMethods<T extends object> = {
  [K in keyof T & string as `set${Capitalize<K>}`]: (value: T[K]) => Builder<T>;
};

/**
 * Combines the core `BuilderService<T>` class methods
 * with all dynamically generated `setX()` methods.
 *
 * This creates a complete, type-safe Builder type for a given model.
 *
 * @template T - The class/entity type being built.
 *
 * @example
 * ```ts
 * const builder: Builder<User> = createBuilder(User);
 * builder.setUsername("Ali").setEmail("ali@example.com").build();
 * ```
 */
export type Builder<T extends object> = BuilderService<T> & SetterMethods<T>;

/**
 * Alias for {@link Builder} used for better readability
 * and IntelliSense support in decorated classes.
 *
 * Typically used with static `.builder()` factory methods:
 *
 * @example
 * ```ts
 * const builder = AdminUser.builder() as TBuilder<AdminUser>;
 * builder.setUsername("admin").setPassword("1234").build();
 * ```
 *
 * @template T - The class/entity type being built.
 */
export type TBuilder<T extends object> = Builder<T>;
