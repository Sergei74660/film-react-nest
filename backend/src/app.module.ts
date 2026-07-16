import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';

import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = new URL(configService.get<string>('DATABASE_URL'));

        return {
          type: configService.get<'postgres'>('DATABASE_DRIVER'),
          host: dbUrl.hostname,
          port: parseInt(dbUrl.port || '5432', 10),
          database: dbUrl.pathname.slice(1),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          autoLoadEntities: true,
          synchronize: false,
        };
      },
    }),

    FilmsModule,
    OrderModule,

    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
