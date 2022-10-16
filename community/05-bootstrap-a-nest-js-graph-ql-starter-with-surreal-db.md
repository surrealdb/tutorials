<br>
  <h1 align="center">Bootstrap a NestJs GraphQL Starter with SurrealDB</h1>
<br>

---

<p>
  Tutorial by <a href="https://github.com/koakh" target="_blank">Koakh</a>
</p>

---

## TOC

- [TOC](#toc)
- [Intro](#intro)
- [Links](#links)
  - [Main Repo](#main-repo)
  - [SurrealDb](#surrealdb)
  - [NestJs](#nestjs)
- [Install and Run SurrealDb](#install-and-run-surrealdb)
  - [Install SurrealDb](#install-surrealdb)
    - [Install on macOS](#install-on-macos)
    - [Install on Linux](#install-on-linux)
    - [Install on Windows](#install-on-windows)
  - [Start SurrealDb Instance](#start-surrealdb-instance)
- [NestJs/Node Prerequisites](#nestjsnode-prerequisites)
- [Setup](#setup)
- [Create a new NestJs Project](#create-a-new-nestjs-project)
- [Installing the required packages:](#installing-the-required-packages)
- [CleanUp non used Files](#cleanup-non-used-files)
- [Add .env File](#add-env-file)
- [Change AppModule](#change-appmodule)
- [Add AllExceptionsFilter](#add-allexceptionsfilter)
- [Add DateScalar](#add-datescalar)
- [Config Main](#config-main)
- [Add GraphQL code first Resolvers](#add-graphql-code-first-resolvers)
  - [RecipesModule](#recipesmodule)
    - [DataLoader](#dataloader)
    - [DTO's](#dtos)
    - [Entities](#entities)
    - [Recipes Modules Stuff](#recipes-modules-stuff)
  - [RestaurantsModule](#restaurantsmodule)
    - [DataLoader](#dataloader-1)
    - [DTO's](#dtos-1)
    - [Entities](#entities-1)
    - [Restaurants Modules Stuff](#restaurants-modules-stuff)
  - [Add new RecipesModule and RestaurantsModule to AppModule](#add-new-recipesmodule-and-restaurantsmodule-to-appmodule)
- [Build and Run Application](#build-and-run-application)
- [Play with GraphQL API](#play-with-graphql-api)

## Intro

A simple tutorial of a GraphQL Server with [NestJs 9](https://nestjs.com/) and [SurrealDB](https://surrealdb.com), 
using [@koakh/nestjs-surrealdb](https://github.com/koakh/NestJs9SurrealDbDynamicModule/tree/main/packages/app-lib) surrealdb nestjs 9 dynamic module wrapper on top of [surrealdb.js](https://surrealdb.com/surrealdb.js) driver, with DataLoaders, Subscriptions and BaseClasses to generate CRUD from simple DTOs and using Schemaless SurrealDb Scheme.....

## Links

### Main Repo

- [GitHub - koakh/NestJs9SurrealDbDynamicModule](https://github.com/koakh/NestJs9SurrealDbDynamicModule)
- [GitHub - koakh/NestJs9SurrealDbDynamicModule : tutorial-graphql](https://github.com/koakh/NestJs9SurrealDbDynamicModule/tree/main/packages/tutorial-graphql)

> full `tutorial-graphql` project on above link

### SurrealDb

- [SurrealDb](https://surrealdb.com)

### NestJs

- [Documentation | NestJS - A progressive Node.js framework](https://docs.nestjs.com/graphql/quick-start)
- [nest/sample/23-graphql-code-first at master · nestjs/nest](https://github.com/nestjs/nest/tree/master/sample/23-graphql-code-first)

## Install and Run SurrealDb

### Install SurrealDb

first install SurrealDb. full instruction at [SurrealDB | Install](https://surrealdb.com/install)

#### Install on macOS

```shell
$ brew install surrealdb/tap/surreal
```

#### Install on Linux

```shell
$ curl -sSf https://install.surrealdb.com | sh
```

#### Install on Windows

```shell
$ iwr https://windows.surrealdb.com -useb | iex
```

### Start SurrealDb Instance

- [SurrealDB | Documentation](https://surrealdb.com/docs/start/starting-surrealdb)

```shell
# start with in memory
$ surreal start --user root --pass root

# or start with rocksdb (persisted on disk)
$ surreal start --user root --pass root file:mydb

# outcome
 .d8888b.                                             888 8888888b.  888888b.
d88P  Y88b                                            888 888  'Y88b 888  '88b
Y88b.                                                 888 888    888 888  .88P
 'Y888b.   888  888 888d888 888d888  .d88b.   8888b.  888 888    888 8888888K.
    'Y88b. 888  888 888P'   888P'   d8P  Y8b     '88b 888 888    888 888  'Y88b
      '888 888  888 888     888     88888888 .d888888 888 888    888 888    888
Y88b  d88P Y88b 888 888     888     Y8b.     888  888 888 888  .d88P 888   d88P
 'Y8888P'   'Y88888 888     888      'Y8888  'Y888888 888 8888888P'  8888888P'


[2022-09-05 23:05:47] INFO  surrealdb::iam Root authentication is enabled
[2022-09-05 23:05:47] INFO  surrealdb::iam Root username is 'root'
[2022-09-05 23:05:47] INFO  surrealdb::dbs Database strict mode is disabled
[2022-09-05 23:05:47] INFO  surrealdb::kvs Starting kvs store at file:mydb
[2022-09-05 23:05:47] INFO  surrealdb::kvs Started kvs store at file:mydb
[2022-09-05 23:05:47] INFO  surrealdb::net Starting web server on 0.0.0.0:8000
[2022-09-05 23:05:47] INFO  surrealdb::net Started web server on 0.0.0.0:8000
```

## NestJs/Node Prerequisites

- Please make sure that NPM and Node.js (version >= 12, except for v13) is installed on your operating system.
## Setup

```shell
# yarn is optional
$ npm i -g @nestjs/cli yarn
```

## Create a new NestJs Project

Setting up a new project is quite simple with the **Nest CLI**. With npm installed, you can create a new Nest project with the following commands in your OS terminal:


```shell
$ nest new tutorial-graphql
? Which package manager would you ❤️  to use? 
  npm 
❯ yarn 
  pnpm
```

## Installing the required packages:

```shell
$ cd tutorial-graphql
$ yarn add @nestjs/graphql @nestjs/apollo @nestjs/config apollo-server-express graphql graphql-subscriptions graphql-query-complexity @koakh/nestjs-surrealdb
```

## CleanUp non used Files

```shell
# remove unused files
$ rm src/app.controller.spec.ts src/app.controller.ts src/app.service.ts
```

## Add .env File

`.env`

```bash
GRAPHQL_SERVER_PORT="3030"
GRAPHQL_AUTO_SCHEMA_FILE='./schema.gql'
SURREALDB_URL="http://127.0.0.1:8000/rpc"
SURREALDB_NAMESPACE="test"
SURREALDB_DATABASE="test"
SURREALDB_USER="root"
SURREALDB_PASS="root"
```

## Change AppModule

configure `ConfigModule`, `SurrealDbModule` and `GraphQLModule`

replace `src/app.module.ts` with

```ts
import { SurrealDbModule } from '@koakh/nestjs-surrealdb';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SurrealDbModule.forRootAsync(SurrealDbModule, {
      useFactory: async (configService: ConfigService) => ({
        url: configService.get('SURREALDB_URL'),
        namespace: configService.get('SURREALDB_NAMESPACE'),
        database: configService.get('SURREALDB_DATABASE'),
        user: configService.get('SURREALDB_USER'),
        pass: configService.get('SURREALDB_PASS'),
      }),
      imports: [AppModule],
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), configService.get<string>('GRAPHQL_AUTO_SCHEMA_FILE')),
        installSubscriptionHandlers: true,
        formatError: (err) => {
          if (err.extensions.code === 'INTERNAL_SERVER_ERROR') {
            return new Error(err.message);
          }
          return err;
        },
      }),
    }),
  ],
})
export class AppModule { }
```

before we run app, **we must implement at least on GraphQL root query**, else we get error `GraphQLError: Query root type must be provided.`

but first we need some extra stuff to configure our nestjs application, let's start

## Add AllExceptionsFilter

`src/common/filters/index.ts`

```ts
export * from './all-exceptions.filter';
```

`src/common/filters/all-exceptions.filter.ts`

```ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    Logger.error(exception, AllExceptionsFilter.name);
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    if ((ctx as any).contextType === 'graphql') {
      throw exception;
    }

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      message: `${(exception as any)?.name} : ${(exception as any)?.message}`,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
```

## Add DateScalar

this is required to use SurrealDb date format

`src/common/scalars/date.scalar.ts`

```ts
import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<string, Date> {
  description = 'Date custom scalar type';

  parseValue(value: number): Date {
    return new Date(value);
  }

  serialize(value: Date): string {
    return value.toString();
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  }
}
```

## Config Main

```ts
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters';

async function bootstrap() {
  const context = 'NestApplication';
  const app = await NestFactory.create(AppModule);
  // get app instances
  const AppHttpAdapter = app.get(HttpAdapterHost);
  const configService = app.get<ConfigService>(ConfigService);
  // config vars
  const graphqlServerPort = configService.get<string>('GRAPHQL_SERVER_PORT') || 3030;
  // middleware
  app.useGlobalFilters(new AllExceptionsFilter(AppHttpAdapter));
  app.useGlobalPipes(new ValidationPipe());
  // start server
  await app.listen(graphqlServerPort);
  Logger.log(`Application is running on: ${await app.getUrl()}`, context);
  Logger.log(`using surrealDb host: ${configService.get('SURREALDB_URL')}`, context);
}
bootstrap();
```

## Add GraphQL code first Resolvers 

here we will use some **base classes that will do the hard work for our CRUD from DTO's**, leaving us to do only some **custom resolvers** with some non CRUD logic in future, and we are done

we will create bellow file structure, with **dataloader's, dto's, entities, modules, resolvers and services** for new sample Modules `RecipesModule` and `RestaurantsModule`

```shell
├── src
│   ├── recipes
│   │   ├── dataloader
│   │   │   ├── index.ts
│   │   │   └── restaurant.dataloader.ts
│   │   ├── dto
│   │   │   ├── create-recipe.input.ts
│   │   │   ├── index.ts
│   │   │   └── update-recipe.input.ts
│   │   ├── entities
│   │   │   ├── index.ts
│   │   │   └── recipe.entity.ts
│   │   ├── recipes.module.ts
│   │   ├── recipes.resolver.ts
│   │   └── recipes.service.ts
│   └── restaurants
│       ├── dataloader
│       │   ├── index.ts
│       │   └── recipe.dataloader.ts
│       ├── dto
│       │   ├── create-restaurant.input.ts
│       │   ├── index.ts
│       │   └── update-restaurant.input.ts
│       ├── entities
│       │   ├── index.ts
│       │   └── restaurant.entity.ts
│       ├── restaurants.module.ts
│       ├── restaurants.resolver.spec.ts
│       ├── restaurants.resolver.ts
│       ├── restaurants.service.spec.ts
│       └── restaurants.service.ts
```

### RecipesModule

#### DataLoader

`src/recipes/dataloader/index.ts`

```ts
export * from './restaurant.dataloader';
```

`src/recipes/dataloader/restaurant.dataloader.ts`

```ts
import * as DataLoader from 'dataloader';
import { DataloaderProvider } from '@koakh/nestjs-dataloader';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { RestaurantsService } from '../../restaurants/restaurants.service';
import { Restaurant } from '../..//restaurants/entities';

@DataloaderProvider()
export class RestaurantDataLoader {
  constructor(private readonly restaurantsService: RestaurantsService) { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createDataloader(_ctx: GqlExecutionContext) {
    return new DataLoader<string, Type<Restaurant>>(async (ids: string[]) => {
      const query = `SELECT * FROM [${ids.join(',')}];`;
      return this.restaurantsService.rawQuery(query);
    });
  }
}
```

#### DTO's

`src/recipes/dto/index.ts`

```ts
export * from './create-recipe.input';
export * from './update-recipe.input';
```

`src/recipes/dto/create-recipe.input.ts`

```ts
import { BaseCreateEntityInput } from '@koakh/nestjs-surrealdb';
import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, IsOptional, IsUUID, MaxLength } from 'class-validator';

@InputType()
export class CreateRecipeInput extends BaseCreateEntityInput {
  @IsUUID()
  @Field({ description: 'Example field (placeholder)' })
  uuid: string;

  @IsDefined()
  @MaxLength(30)
  @Field()
  title: string;

  @IsOptional()
  @MaxLength(255)
  @Field({ nullable: true })
  description?: string;

  @Field(() => [String])
  ingredients: string[];

  @IsDefined()
  @Field(() => String)
  restaurant: string;
}
```

`src/recipes/dto/update-recipe.input.ts`

```ts
import { BaseUpdateEntityInput } from '@koakh/nestjs-surrealdb';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@InputType()
export class UpdateRecipeInput extends BaseUpdateEntityInput {
  @Field()
  @MaxLength(30)
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @Field(() => [String])
  ingredients: string[];
}
```

#### Entities

`src/recipes/entities/index.ts`

```ts
export * from './recipe.entity';
```

`src/recipes/entities/recipe.entity.ts`

```ts
import { BaseEntity } from '@koakh/nestjs-surrealdb';
import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { Restaurant } from '../../restaurants/entities';

@ObjectType({ description: 'recipe ' })
export class Recipe extends BaseEntity {
  @Field()
  @Directive('@upper')
  uuid: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String])
  ingredients: string[];

  @Field(() => Restaurant)
  restaurant: Restaurant;
}
```

#### Recipes Modules Stuff

`src/recipes/recipes.module.ts`

```ts
import { forwardRef, Module } from '@nestjs/common';
import { DateScalar } from '../common/scalars';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { RestaurantDataLoader } from './dataloader';
import { RecipesResolver } from './recipes.resolver';
import { RecipesService } from './recipes.service';

@Module({
  imports: [forwardRef(() => RestaurantsModule)],
  providers: [DateScalar, RestaurantDataLoader, RecipesResolver, RecipesService, RestaurantsService],
})
export class RecipesModule { }
```

`src/recipes/recipes.resolver.ts`

```ts
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Loader } from '@koakh/nestjs-dataloader';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { RestaurantDataLoader } from './dataloader';
import { CreateRecipeInput } from './dto/create-recipe.input';
import { UpdateRecipeInput } from './dto/update-recipe.input';
import { Recipe } from './entities/recipe.entity';
import { RecipesService } from './recipes.service';
import { BaseResolver } from '@koakh/nestjs-surrealdb';

@Resolver(() => Recipe)
export class RecipesResolver extends BaseResolver(Recipe, CreateRecipeInput, UpdateRecipeInput) {
  constructor(private readonly recipesService: RecipesService, private readonly restaurantsService: RestaurantsService) {
    super(recipesService);
  }

  @ResolveField()
  async restaurant(@Parent() recipe: Recipe, @Loader(RestaurantDataLoader) restaurantDataLoader) {
    const { restaurant } = recipe;
    // batch query using dataloader, optional cast to string
    return restaurantDataLoader.load(restaurant as unknown as string);
  }
}
```

`src/recipes/recipes.service.ts`

```ts
import { BaseFindAllArgs } from '@koakh/nestjs-surrealdb';
import { BaseService } from '@koakh/nestjs-surrealdb';
import { SurrealDbService } from '@koakh/nestjs-surrealdb';
import { Injectable, Type } from '@nestjs/common';
import { UpdateRecipeInput } from './dto';
import { CreateRecipeInput } from './dto/create-recipe.input';
import { Recipe } from './entities';

@Injectable()
export class RecipesService extends BaseService<Type<Recipe>, BaseFindAllArgs, CreateRecipeInput, UpdateRecipeInput> {
  constructor(protected readonly surrealDb: SurrealDbService) {
    super(surrealDb);
    this.entityName = Recipe;
  }
}
```

### RestaurantsModule


#### DataLoader

`src/restaurants/dataloader/index.ts`

```ts
export * from './recipe.dataloader';
```

`src/restaurants/dataloader/recipe.dataloader.ts`

```ts
import { Type } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DataloaderProvider } from '@koakh/nestjs-dataloader';
import * as DataLoader from 'dataloader';
import { Recipe } from '../../recipes/entities';
import { RecipesService } from '../../recipes/recipes.service';

@DataloaderProvider()
export class RecipeDataLoader {
  constructor(private readonly recipeService: RecipesService) { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createDataloader(_ctx: GqlExecutionContext) {
    return new DataLoader<string, Promise<Type<Recipe>[]>>(async (ids: string[]) => {
      const arrayOfPromises = ids.map((e: string) => {
        return this.recipeService.rawQuery(`SELECT * FROM recipe WHERE restaurant = ${e}`);
      });
      return arrayOfPromises;
    });
  }
}
```

#### DTO's

`src/restaurants/dto/index.ts`

```ts
export * from './create-restaurant.input';
export * from './update-restaurant.input';
```

`src/restaurants/dto/create-restaurant.input.ts`

```ts
import { BaseCreateEntityInput } from '@koakh/nestjs-surrealdb';
import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, IsEmail, IsOptional, IsUUID, MaxLength } from 'class-validator';

@InputType()
export class CreateRestaurantInput extends BaseCreateEntityInput {
  @IsUUID()
  @Field({ description: 'Example field (placeholder)' })
  uuid: string;

  @IsDefined()
  @MaxLength(30)
  @Field()
  name: string;

  @IsEmail()
  @Field({ nullable: true })
  email: string;

  @IsOptional()
  @MaxLength(255)
  @Field({ nullable: true })
  description?: string;
}
```

`src/restaurants/dto/update-restaurant.input.ts`

```ts
import { BaseUpdateEntityInput } from '@koakh/nestjs-surrealdb';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@InputType()
export class UpdateRestaurantInput extends BaseUpdateEntityInput {
  @Field()
  @MaxLength(30)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(255)
  description?: string;
}
```

#### Entities

`src/restaurants/entities/index.ts`

```ts
export * from './restaurant.entity';
```

`src/restaurants/entities/restaurant.entity.ts`

```ts
import { BaseEntity } from '@koakh/nestjs-surrealdb';
import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Recipe } from '../../recipes/entities';

@ObjectType()
export class Restaurant extends BaseEntity {
  @Field()
  @Directive('@upper')
  uuid: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  email: string;

  @Field(() => [Recipe], { nullable: true })
  recipes?: Recipe[];
}
```

#### Restaurants Modules Stuff


`src/restaurants/restaurants.module.ts`

```ts
import { forwardRef, Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsResolver } from './restaurants.resolver';
import { RecipesModule } from '../recipes/recipes.module';
import { RecipesService } from '../recipes/recipes.service';
import { RecipeDataLoader } from './dataloader';

@Module({
  imports: [forwardRef(() => RecipesModule)],
  providers: [RestaurantsResolver, RestaurantsService, RecipesService, RecipeDataLoader],
})
export class RestaurantsModule { }
```

`src/restaurants/restaurants.resolver.ts`

```ts
import { Loader } from '@koakh/nestjs-dataloader';
import { BaseResolver } from '@koakh/nestjs-surrealdb';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { RecipesService } from '../recipes/recipes.service';
import { RecipeDataLoader } from './dataloader';
import { CreateRestaurantInput, UpdateRestaurantInput } from './dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantsService } from './restaurants.service';

@Resolver(() => Restaurant)
export class RestaurantsResolver extends BaseResolver(Restaurant, CreateRestaurantInput, UpdateRestaurantInput) {
  constructor(private readonly restaurantsService: RestaurantsService, private readonly recipesService: RecipesService) {
    super(restaurantsService);
  }

  @ResolveField()
  async recipes(@Parent() restaurant: Restaurant, @Loader(RecipeDataLoader) recipeDataLoader) {
    const { id } = restaurant;
    // batch query using dataloader, optional cast to string
    return recipeDataLoader.load(id as unknown as string);
  }
}
```

`src/restaurants/restaurants.service.ts`

```ts
import { BaseFindAllArgs, BaseService, SurrealDbService } from '@koakh/nestjs-surrealdb';
import { Injectable, Type } from '@nestjs/common';
// import { BaseFindAllArgs } from '../common/dto/base-find-all.args';
// import { BaseService } from '../common/services';
import { CreateRestaurantInput, UpdateRestaurantInput } from './dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantsService extends BaseService<Type<Restaurant>, BaseFindAllArgs, CreateRestaurantInput, UpdateRestaurantInput> {
  constructor(protected readonly surrealDb: SurrealDbService) {
    super(surrealDb);
    this.entityName = Restaurant;
  }
}
```

done now we must add modules to AppModule

### Add new RecipesModule and RestaurantsModule to AppModule

add modules `DataloaderModule`, `RecipesModule`, `RestaurantsModule` to `AppModule`

`src/app.module.ts`

```ts
import { DataloaderModule } from '@koakh/nestjs-dataloader';
import { RecipesModule } from './recipes/recipes.module';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    // ...
    DataloaderModule,
    RecipesModule,
    RestaurantsModule,
  ],
})
export class AppModule { }
```

## Build and Run Application

check default `package.json` scripts

```json
{
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main"
  }
}    
```

for ex

```shell
# run in prod
$ yarn build && yarn start:prod
# run in dev
$ yarn start:dev
```

here we will use the debug version

```shell
# run in debug
$ yarn start:debug
# outcome
[Nest] 23912  - 10/11/2022, 10:04:14 PM     LOG [NestApplication] Nest application successfully started +2ms
[Nest] 23912  - 10/11/2022, 10:04:14 PM     LOG [NestApplication] Application is running on: http://[::1]:3030
[Nest] 23912  - 10/11/2022, 10:04:14 PM     LOG [NestApplication] using surrealDb host: http://127.0.0.1:8000/rpc
```

## Play with GraphQL API

[Open GraphQL PlayGround](http://localhost:3030/graphql) and play with API

> Don't forget to play with DataLoaders and Subscriptions :)