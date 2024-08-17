import { BaseError } from '../errors/base_error'

export class MissingParameters extends BaseError {
  constructor(message: string) {
    super(`Field ${message} is missing`)
  }
}

export class WrongTypeParameters extends BaseError {
  constructor(message: string) {
    super(`Field ${message} is of the wrong type`)
  }

}