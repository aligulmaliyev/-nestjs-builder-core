import { DynamicModule, Module, Provider } from '@nestjs/common';
import { BuilderService } from './builder.service';
import { createBuilder } from './factory';
import { BuilderModule } from './builder.module';

/**
 * `BuilderGeneratorModule` — a dynamic NestJS module that automatically
 * registers builder providers for multiple models or entities at once.
 *
 * This module is ideal when you want to generate multiple `<ModelName>Builder`
 * providers automatically instead of registering them individually.
 *
 * ---
 *
 * @example
 * ```ts
 * import { Module } from '@nestjs/common';
 * import { BuilderGeneratorModule } from '@nestjs-builder/core';
 * import { User } from './entities/user.entity';
 * import { AdminUser } from './entities/admin-user.entity';
 *
 * @Module({
 *   imports: [
 *     BuilderGeneratorModule.registerModels([User, AdminUser])
 *   ],
 * })
 * export class AppModule {}
 * ```
 *
 * Then, inject and use them anywhere:
 * ```ts
 * @Injectable()
 * export class UserService {
 *   constructor(
 *     @Inject('UserBuilder')
 *     private readonly userBuilder: Builder<User>,
 *
 *     @Inject('AdminUserBuilder')
 *     private readonly adminUserBuilder: Builder<AdminUser>,
 *   ) {}
 *
 *   createAdmin() {
 *     return this.adminUserBuilder
 *       .setUsername('root')
 *       .setEmail('root@example.com')
 *       .build();
 *   }
 * }
 * ```
 */
@Module({})
export class BuilderGeneratorModule {
  /**
   * Registers multiple builder providers for the given list of models.
   *
   * Each model receives a dynamically created provider named `<ModelName>Builder`.
   * These providers are generated using the `createBuilder()` factory function
   * and automatically exported for use in other modules.
   *
   * @param models - A list of model or entity classes to register as builders.
   * @returns A dynamic NestJS module that exports:
   * - A `BuilderService` provider
   * - A builder provider for each registered model (e.g. `UserBuilder`, `AdminUserBuilder`)
   *
   * @example
   * ```ts
   * BuilderGeneratorModule.registerModels([User, AdminUser]);
   * ```
   */
  static registerModels(models: (new () => any)[]): DynamicModule {
    // Create dynamic providers for each model
    const providers = models.map((model) => ({
      provide: `${model.name}Builder`,
      useFactory: () => createBuilder(model),
    }));

    // Return a dynamic NestJS module
    return {
      module: BuilderModule,
      providers: [BuilderService, ...providers],
      exports: [BuilderService, ...providers],
    };
  }
}
