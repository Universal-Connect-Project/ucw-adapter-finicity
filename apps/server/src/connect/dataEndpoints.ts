/* eslint-disable @typescript-eslint/naming-convention */
import type { Response } from 'express'
import { getProviderAdapter } from '../adapters'
import getVC from '../services/vcProviders'

export interface AccountsDataQueryParameters {
  connection_id: string
  provider: string
  user_id: string
}

export interface AccountsRequest {
  query: AccountsDataQueryParameters
}

export interface IdentityRequest {
  query: IdentityDataQueryParameters
}

export interface TransactionsRequest {
  query: TransactionsDataQueryParameters
}

export const accountsDataHandler = async (
  req: AccountsRequest,
  res: Response
) => {
  const { provider, connection_id, user_id } = req.query

  const providerAdapter = getProviderAdapter(provider)
  const providerUserId = await providerAdapter.ResolveUserId(user_id)

  try {
    const vc = await getVC(provider, connection_id, 'accounts', providerUserId)
    res.send({
      jwt: vc
    })
  } catch (error) {
    res.status(400)
    res.send('Something went wrong')
  }
}

export interface IdentityDataQueryParameters {
  connection_id: string
  provider: string
  user_id: string
}

export const identityDataHandler = async (
  req: IdentityRequest,
  res: Response
) => {
  const { provider, connection_id, user_id } =
    req.query as unknown as IdentityDataQueryParameters

  const providerAdapter = getProviderAdapter(provider)
  const providerUserId = await providerAdapter.ResolveUserId(user_id)

  try {
    const vc = await getVC(provider, connection_id, 'identity', providerUserId)
    res.send({
      jwt: vc
    })
  } catch (error) {
    res.status(400)
    res.send('Something went wrong')
  }
}

export interface TransactionsDataQueryParameters {
  account_id: string
  end_time: string
  provider: string
  start_time: string
  user_id: string
}

export const transactionsDataHandler = async (
  req: TransactionsRequest,
  res: Response
) => {
  const { provider, user_id, account_id, start_time, end_time } =
    req.query as unknown as TransactionsDataQueryParameters

  const providerAdapter = getProviderAdapter(provider)
  const providerUserId = await providerAdapter.ResolveUserId(user_id)

  try {
    const vc = await getVC(
      provider,
      undefined,
      'transactions',
      providerUserId,
      account_id,
      start_time,
      end_time
    )
    res.send({
      jwt: vc
    })
  } catch (error) {
    res.status(400)
    res.send('Something went wrong')
  }
}