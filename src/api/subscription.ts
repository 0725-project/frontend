import { client } from './client'
import { withAuthRetry } from './token'
import { PaginationResponse } from './types'
import { UserBriefResponse } from './users'

export interface FollowersResponse extends PaginationResponse {
    followers: {
        follower: UserBriefResponse
    }[]
}

export interface FollowingResponse extends PaginationResponse {
    following: {
        following: UserBriefResponse
    }[]
}

export interface FollowResponse {}
export interface UnfollowResponse {}

const SUBSCRIPTION_API_PREFIX = 'subscription'

export const followUser = async (username: string) => {
    return withAuthRetry(async (header) => {
        const response = await client.post<FollowResponse>(`/${SUBSCRIPTION_API_PREFIX}/follow/${username}`, {}, header)
        return response.data
    })
}

export const unfollowUser = async (username: string) => {
    return withAuthRetry(async (header) => {
        const response = await client.post<UnfollowResponse>(
            `/${SUBSCRIPTION_API_PREFIX}/unfollow/${username}`,
            {},
            header,
        )
        return response.data
    })
}

export const getFollowers = async (username: string, page?: number, limit = 10) => {
    const response = await client.get<FollowersResponse>(`/${SUBSCRIPTION_API_PREFIX}/followers/${username}`, {
        params: { page, limit },
    })
    return response.data
}

export const getFollowing = async (username: string, page?: number, limit = 10) => {
    const response = await client.get<FollowingResponse>(`/${SUBSCRIPTION_API_PREFIX}/following/${username}`, {
        params: { page, limit },
    })
    return response.data
}
