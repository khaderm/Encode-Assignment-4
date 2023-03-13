import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        async () => {
          return configuration;
        },
      ],
      cache: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
