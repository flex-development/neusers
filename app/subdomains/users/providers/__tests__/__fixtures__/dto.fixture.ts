import CreateUserDTO from '@/subdomains/users/dto/create-user.dto'
import PatchUserDTO from '@/subdomains/users/dto/patch-user.dto'
import faker from 'faker'

/**
 * @file Test Fixture - Users Subdomain DTOs
 * @module app/subdomains/users/tests/fixtures/dto.fixture
 */

const STRONG_PASSWORD = 'Strongpassword1234678'

export const CREATE_USER_DTO: CreateUserDTO = Object.freeze({
  email: faker.internet.exampleEmail(),
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  password: STRONG_PASSWORD
})

export const PATCH_USER_DTO_EMAIL: PatchUserDTO = Object.freeze({
  email: faker.internet.exampleEmail()
})

export const PATCH_USER_DTO_PASSWORD: PatchUserDTO = Object.freeze({
  password: `${STRONG_PASSWORD}!!!`
})

export const getCreateUserDTO = () => Object.assign({}, CREATE_USER_DTO)

export const getPatchUserDTO = (type: 'email' | 'password'): PatchUserDTO => {
  if (type === 'password') return Object.assign({}, PATCH_USER_DTO_PASSWORD)
  return Object.assign({}, PATCH_USER_DTO_EMAIL)
}
