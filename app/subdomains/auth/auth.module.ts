import { Module } from '@nestjs/common'
import UsersModule from '../users/users.module'
import { AuthService } from './providers'

/**
 * @file Subdomain Module - AuthModule
 * @module app/subdomains/auth/module
 */

@Module({ imports: [UsersModule], providers: [AuthService] })
export default class AuthModule {}
