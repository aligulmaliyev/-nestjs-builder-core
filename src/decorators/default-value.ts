import "reflect-metadata";

/**
 * A property decorator that defines a default value
 * for a class field using Reflect Metadata.
 *
 * When the class is later used with a `BuilderService`,
 * the builder will automatically apply this default value
 * if the property was not manually set.
 *
 * ---
 * **Usage Example**
 *
 * ```ts
 * import { DefaultValue } from '@nestjs-builder/core';
 *
 * class User {
 *   @DefaultValue('guest')
 *   role: string;
 *
 *   @DefaultValue(true)
 *   isActive: boolean;
 * }
 *
 * const user = User.builder().build();
 * console.log(user.role); // "guest"
 * console.log(user.isActive); // true
 * ```
 *
 * ---
 *
 * @template T The property type
 * @param value The default value to assign
 * @returns A property decorator function
 */
export function DefaultValue<T>(value: T) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata("default", value, target, propertyKey);
  };
}

/**
 * Utility function that retrieves the default value metadata
 * for a given class property.
 *
 * This is mainly used internally by the `BuilderService`
 * to apply default values when constructing an instance.
 *
 * ---
 * **Example**
 *
 * ```ts
 * import { getDefault } from '@nestjs-builder/core';
 *
 * class User {
 *   @DefaultValue('guest')
 *   role: string;
 * }
 *
 * console.log(getDefault(new User(), 'role')); // "guest"
 * ```
 *
 * @param target - The class instance or prototype
 * @param propertyKey - The property name
 * @returns The default value if defined, otherwise `undefined`
 */
export function getDefault(target: any, propertyKey: string) {
  return Reflect.getMetadata("default", target, propertyKey);
}
