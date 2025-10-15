import "reflect-metadata";
import { TBuilder } from "./types";
import { validateOrThrow } from "./validation";
import { plainToInstance } from "class-transformer";

/**
 * Core service that implements the Builder design pattern for NestJS.
 *
 * `BuilderService` dynamically generates type-safe, chainable setter methods (`setX()`)
 * for any class or entity. It supports default values, validation, and serialization.
 *
 * @template T - The class or entity type that this builder constructs.
 *
 * @example
 * ```ts
 * const builder = new BuilderService(User);
 * const user = builder
 *   .setUsername('ali')
 *   .setEmail('ali@example.com')
 *   .setPassword('1234')
 *   .build();
 * ```
 */
export class BuilderService<T extends object> {
  /**
   * The underlying instance being constructed by the builder.
   */
  protected instance: T;

  /**
   * Creates a new `BuilderService` for a given class type.
   *
   * - Initializes the instance.
   * - Applies any `@DefaultValue()` metadata.
   * - Wraps the instance in a Proxy that dynamically handles `setX()` methods.
   *
   * @param ctor - The class constructor for the object being built.
   */
  constructor(protected readonly ctor?: new () => T) {
    // Initialize the target instance
    this.instance = ctor ? new ctor() : ({} as T);

    // Apply default metadata values (from @DefaultValue)
    if (ctor) {
      Object.keys(this.instance).forEach((key) => {
        const def = Reflect.getMetadata("default", this.instance, key);
        if (def !== undefined) {
          (this.instance as any)[key] = def;
        }
      });
    }

    // Create a Proxy to generate dynamic setX methods
    const self = this;
    const proxy = new Proxy(this as unknown as TBuilder<T>, {
      get(target, prop: string | symbol) {
        // Generate dynamic setters (e.g., setUsername, setEmail)
        if (typeof prop === "string" && prop.startsWith("set")) {
          const key = (prop.charAt(3).toLowerCase() + prop.slice(4)) as keyof T;

          return function (this: any, value: any) {
            (self.instance as any)[key] = value;
            return proxy; // Enables chaining
          };
        }

        // Fallback to normal property access
        return Reflect.get(target, prop);
      },
    });

    return proxy;
  }

  /**
   * Manually sets a property by key.
   *
   * Unlike `setX()` methods, this can be used dynamically.
   *
   * @param key - Property name to assign.
   * @param value - The new value to assign.
   * @returns The builder itself, allowing chaining.
   *
   * @example
   * ```ts
   * builder.set("email", "ali@example.com");
   * ```
   */
  set<K extends keyof T>(key: K, value: T[K]): this {
    (this.instance as any)[key] = value;
    return this;
  }

  /**
   * Validates and returns the final built object.
   *
   * This method runs `class-validator` checks (if available)
   * through `validateOrThrow()`. If validation fails, an exception
   * will be thrown with validation details.
   *
   * @returns The fully constructed and validated instance.
   *
   * @example
   * ```ts
   * const user = builder.build();
   * ```
   */
  build(): T {
    validateOrThrow(this.instance, this.ctor);
    return this.instance;
  }

  /**
   * Asynchronous version of {@link build}.
   *
   * Useful if asynchronous validation or transformations
   * are needed in the future.
   *
   * @returns A promise resolving to the constructed instance.
   */
  async buildAsync(): Promise<T> {
    return this.build();
  }

  /**
   * Resets the builder by reinitializing the instance.
   *
   * Clears all previous values and re-applies any `@DefaultValue()` metadata.
   *
   * @returns The builder instance for chaining.
   *
   * @example
   * ```ts
   * builder.reset().setEmail('reset@example.com');
   * ```
   */
  reset(): this {
    this.instance = this.ctor ? new this.ctor() : ({} as T);
    return this;
  }

  /**
   * Populates the builder with a partial object.
   *
   * @param obj - A partial object containing pre-filled fields.
   * @returns The builder instance for chaining.
   *
   * @example
   * ```ts
   * builder.from({ username: 'ali', email: 'ali@example.com' });
   * ```
   */
  from(obj: Partial<T>): this {
    Object.assign(this.instance, obj);
    return this;
  }

  /**
   * Converts the built instance to a plain JavaScript object.
   *
   * This method is typically used during serialization (e.g. returning API responses).
   *
   * @returns The plain object representation of the instance.
   */
  toJSON() {
    return this.instance;
  }
}
