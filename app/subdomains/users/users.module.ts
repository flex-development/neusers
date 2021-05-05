import { Module } from '@nestjs/common'
import UsersController from './controllers/users.controller'
import { UsersRepository, UsersService } from './providers'

/**
 * @file Subdomain Module - UsersModule
 * @module app/subdomains/users/module
 */

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  providers: [UsersRepository, UsersService]
})
export default class UsersModule {}
