import { Module } from '@nestjs/common'
import type { ConfigModuleOptions } from '@nestjs/config'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import configuration from './config/configuration'
import { AllExceptionsFilter } from './lib/filters'
import { PageviewInterceptor } from './lib/interceptors'
import { UsersModule } from './subdomains'

/**
 * @file Root Application Module
 * @module app/AppModule
 * @see https://docs.nestjs.com/modules
 */

const configModuleOptions: ConfigModuleOptions = {
  cache: configuration().PROD,
  ignoreEnvFile: true,
  isGlobal: true,
  load: [configuration]
}

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), UsersModule],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: PageviewInterceptor }
  ]
})
export default class AppModule {}
