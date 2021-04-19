import { Module } from '@nestjs/common'
import type { ConfigModuleOptions } from '@nestjs/config'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'

/**
 * @file Root Application Module
 * @module app/AppModule
 * @see https://docs.nestjs.com/modules
 */

const configModuleOptions: ConfigModuleOptions = {
  cache: true,
  ignoreEnvFile: true,
  isGlobal: true,
  load: [configuration]
}

@Module({ imports: [ConfigModule.forRoot(configModuleOptions)] })
export default class AppModule {
  //
}
