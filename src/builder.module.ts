import { Module, DynamicModule, Provider } from "@nestjs/common";
import { BuilderService } from "./builder.service";
import { createBuilder } from "./factory";

/**
 * Core NestJS module that provides builder functionality
 * for specific model classes using the `forFeature()` method.
 *
 * This module dynamically generates builder providers for
 * any entity or class passed into it.
 *
 * @example
 * ```ts
 * // app.module.ts
 * import { Module } from '@nestjs/common';
 * import { BuilderModule } from '@nestjs-builder/core';
 * import { User } from './entities/user.entity';
 *
 * @Module({
 *   imports: [BuilderModule.forFeature(User)],
 * })
 * export class AppModule {}
 * ```
 *
 * @example
 * ```ts
 * // user.service.ts
 * import { Inject, Injectable } from '@nestjs/common';
 * import { User } from './entities/user.entity';
 *
 * @Injectable()
 * export class UserService {
 *   constructor(
 *     @Inject('UserBuilder')
 *     private readonly userBuilder: Builder<User>,
 *   ) {}
 *
 *   createUser() {
 *     return this.userBuilder
 *       .setUsername('ali')
 *       .setEmail('ali@example.com')
 *       .setPassword('12345')
 *       .build();
 *   }
 * }
 * ```
 */
@Module({})
export class BuilderModule {
  /**
   * Registers a dynamic builder provider for a specific class or model.
   *
   * - Creates a unique provider token (e.g. `"UserBuilder"`, `"AdminUserBuilder"`)
   * - Uses `createBuilder()` to generate a type-safe builder instance
   * - Exports both the core {@link BuilderService} and the generated provider
   *
   * @template T - The class type for which the builder should be created.
   * @param ctor - The model or entity constructor (e.g. `User`, `AdminUser`).
   *
   * @returns A dynamic NestJS module containing:
   * - A `BuilderService` provider
   * - A `<ModelName>Builder` factory provider
   *
   * @example
   * ```ts
   * BuilderModule.forFeature(User)
   * ```
   */
  static forFeature<T extends object>(ctor: new () => T): DynamicModule {
    const builderProvider: Provider = {
      provide: `${ctor.name}Builder`,
      useFactory: () => createBuilder(ctor),
    };

    return {
      module: BuilderModule,
      providers: [BuilderService, builderProvider],
      exports: [BuilderService, builderProvider],
    };
  }
}
