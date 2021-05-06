import { Module } from '@nestjs/common'
import UsersController from './controllers/users.controller'
import { AuthService, UsersRepository, UsersService } from './providers'

/**
 * @file Users Subdomain Module - UsersModule
 * @module app/subdomains/users/module
 */

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  providers: [AuthService, UsersRepository, UsersService]
})
export default class UsersModule {}
