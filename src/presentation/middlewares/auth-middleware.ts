import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.headers?.['x-access-token']) {
      await this.loadAccountByToken.load(httpRequest.headers['x-access-token'])
    }
    return forbidden(new AccessDeniedError())
  }
}
