# nestjs-builder

**A fully type-safe Builder Pattern implementation for NestJS and TypeScript.**  
Inspired by Java’s Lombok `@Builder`, this package brings clean, chainable, and strongly-typed object creation to NestJS — with built-in validation, default values, and module-based integration.

---

## Key Features

Type-safe, chainable `setX()` methods for every property  
Automatic validation via `class-validator`  
`@DefaultValue()` decorator for property defaults  
Works with NestJS `Module` system (DI compatible)  
Optional `BuilderGeneratorModule` for multiple entities  
Converts plain objects to class instances with `class-transformer`  
Supports both sync and async `build()` methods  
Lightweight — no runtime dependencies beyond NestJS

---

## Installation

```bash
npm install nestjs-builder
# or
yarn add nestjs-builder
```

---

## Usage Examples

### Register Builder for a single model
Use the `BuilderModule.forFeature()` pattern inside your module:

```ts
import { Module } from '@nestjs/common';
import { BuilderModule } from 'nestjs-builder';
import { AdminUser } from './entities/admin-user.entity';
import { AdminUserService } from './admin-user.service';

@Module({
  imports: [BuilderModule.forFeature(AdminUser)],
  providers: [AdminUserService],
  exports: [AdminUserService],
})
export class AdminUserModule {}
```

Then inject the builder:

```ts
import { Injectable, Inject } from '@nestjs/common';
import { TBuilder } from 'nestjs-builder';
import { AdminUser } from './entities/admin-user.entity';

@Injectable()
export class AdminUserService {
  constructor(
    @Inject('AdminUserBuilder')
    private readonly userBuilder: TBuilder<AdminUser>
  ) {}

  async createAdmin() {
    const user = this.userBuilder
      .setUsername('admin')
      .setEmail('admin@example.com')
      .setPassword('123456')
      .build();

    return user;
  }
}
```

---

### Register multiple models

If you want to register many entities at once, use `BuilderGeneratorModule`:

```ts
import { Module } from '@nestjs/common';
import { BuilderGeneratorModule } from 'nestjs-builder';
import { AdminUser, Customer, Product } from './entities';

@Module({
  imports: [
    BuilderGeneratorModule.registerModels([AdminUser, Customer, Product]),
  ],
})
export class AppModule {}
```

You’ll now have providers available as:
- `'AdminUserBuilder'`
- `'CustomerBuilder'`
- `'ProductBuilder'`

---

### 3️⃣ Use `@DefaultValue()` decorator

Set default values for your entity fields:

```ts
import { DefaultValue } from 'nestjs-builder';

export class AdminUser {
  @DefaultValue('guest')
  role: string;

  @DefaultValue(true)
  isActive: boolean;
}
```

When building a new instance:
```ts
const user = this.userBuilder.build();
console.log(user.role); // 'guest'
```

---

### 4️⃣ Use builder manually (without DI)

You can also use the builder standalone with `createBuilder()`:

```ts
import { createBuilder } from 'nestjs-builder';
import { AdminUser } from './entities/admin-user.entity';

const builder = createBuilder(AdminUser);

const user = builder
  .setUsername('john')
  .setEmail('john@example.com')
  .setPassword('1234')
  .build();
```

---

## Core Classes & Decorators

### `BuilderService<T>`

Implements all core builder logic.  
It dynamically generates chainable `setX()` methods for every property at runtime.

| Method | Description |
|--------|--------------|
| `set<K extends keyof T>(key, value)` | Manually set a field |
| `from(obj: Partial<T>)` | Merge multiple fields at once |
| `build()` | Validate & return final object |
| `buildAsync()` | Async version of `build()` |
| `reset()` | Reset the instance |
| `toJSON()` | Returns instance for serialization |

---

### `BuilderModule`

Registers one model (entity/class) as a builder provider.

```ts
BuilderModule.forFeature(User)
```

This makes the following available:
```ts
@Inject('UserBuilder') userBuilder: TBuilder<User>;
```

---

### `BuilderGeneratorModule`

Registers multiple builders at once:

```ts
BuilderGeneratorModule.registerModels([User, Post, Product])
```

This creates:
- `UserBuilder`
- `PostBuilder`
- `ProductBuilder`

All injectable through NestJS DI.

---

### `DefaultValue(value: any)`

Adds metadata for default field values.

```ts
@DefaultValue('active')
status: string;
```

When a builder is created for this class, the default is automatically applied.

---

## Validation Support

Builders automatically validate using `class-validator` when `.build()` is called.

```ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AdminUser {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;
}
```

If invalid, it throws an exception with the validation details.

---

## Factory: `createBuilder()`

```ts
const builder = createBuilder(AdminUser);
```

Creates a fully dynamic builder for the given class, applying:
- Default values  
- Validation rules  
- Type-safe property setters

---

## Typical Flow

```ts
const user = this.userBuilder
  .from({ username: 'john', email: 'john@example.com' })
  .setPassword('secure')
  .build();
```

Result:
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "secure"
}
```

---

## Future Features

- CLI codegen for generating real `*.builder.ts` classes  
- Extended validation hooks (pre/post build)

---

## Author

**Ali Gulmaliyev**  
Clean, extensible, and powerful Builder Pattern for NestJS.  
GitHub: [aligulmaliyev](https://github.com/aligulmaliyev)
