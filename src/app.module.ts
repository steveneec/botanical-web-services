import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [ConfigModule.forRoot(),TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      entities: ['dist/database/entities/*.entity.js'],
      synchronize: process.env.MODE === 'production' ? false : true,
      migrations: ['dist/src/database/migrations/*.js'],
    }),
    dataSourceFactory: async (options) => {
      const dataSource = await new DataSource(options).initialize();
      return dataSource;
    }
  }),
  MailerModule.forRoot({
    transport: {
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      }
    },
  })
  ,AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
