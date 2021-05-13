# Neusers

NestJS Users System

[![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?&style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://badgen.net/badge/-/typescript?icon=typescript&label)](https://www.typescriptlang.org/)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

## Overview

[Getting Started](#getting-started)  
[Usage](#usage)  
[Built With](#built-with)  
[Contributing](docs/CONTRIBUTING.md)

## Getting Started

Neusers is a users system demo application built with [NestJS][1], a framework
for building server-side applications. NestJS is used to enforce [Domain Driven
Design][2] patterns.

### Project Task

Create a basic users system that allows for user registration and login. The
following concepts should be demonstrated:

- Establish users database
- Register new user
- Login existing users
- Authenticate users and retrieve user data
- Password hashing

Reference: [Node JS Project Ideas - Basic Users System][3]

## Usage

**Base URL**: [`https://neusers.flexdevlopment.vercel.app`][4]

- [Documentation][4] follows OpenAPI v3.0.0 standards.

### Authenticated Endpoints

Endpoints that require users to login using their email and password.

#### Users

- `DELETE /users/{user}`
- `GET /users/{user}` (to retrieve sensitive data)
- `PUT /users/{user}`

### Open Endpoints

Endpoints that don't require authentication.

#### Documentation

- `GET /`

#### Users

- `POST /users`
- `GET /users/{user}`
- `GET /users`

## Built With

- [NestJS][1] - Framework for building Node.js server-side applications
- [Vercel][5] - Hosting platform for serverless functions
- [bcryptjs][6] - JavaScript password hashing library
- [dreepo][7] - Repository Pattern implementation for Firebase Realtime Database
- [create-vercel-http-server-handler][8] - Deploy NestJS app as a single
  Serverless Function
- [ga-measurement-protocol][9] - Google Analytics Measurement Protocol
  TypeScript library

[1]: https://docs.nestjs.com/
[2]:
  https://khalilstemmler.com/articles/domain-driven-design-intro/#Protecting-the-Domain-Layer
[3]:
  https://www.blog.duomly.com/node-js-project-ideas-for-beginners/#2-basic-users-system
[4]: https://neusers.flexdevlopment.vercel.app
[5]: https://vercel.com/docs/serverless-functions/introduction
[6]: https://github.com/dcodeIO/bcrypt.js
[7]: https://github.com/flex-development/dreepo
[8]: https://github.com/jlarmstrongiv/create-vercel-http-server-handler
[9]: https://github.com/wusuopu/ts-ga-measurement-protocol
