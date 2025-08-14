import { client } from './client'
import { PostResponse } from './posts'
import { withAuthRetry } from './token'
import { PaginationResponse } from './types'
import { UserBriefResponse } from './users'

export interface TopicResponse {
    id: number
    slug: string
    name: string
    description: string
    createdAt: string
    postCount: number
    creator: UserBriefResponse
}

export interface TopicBriefResponse {
    id: number
    slug: string
    name: string
    description: string
}

export interface TopicsResponse extends PaginationResponse {
    topics: TopicResponse[]
}

export type CreateTopicResponse = Omit<TopicResponse, 'creator'>

export interface TopicPostsResponse extends PaginationResponse {
    posts: Omit<PostResponse, 'topic'>[]
}

const TOPICS_API_PREFIX = 'topics'

export const createTopic = async (topicSlug: string, description: string) => {
    return withAuthRetry(async (header) => {
        const response = await client.post<CreateTopicResponse>(
            `/${TOPICS_API_PREFIX}`,
            {
                topicSlug,
                description,
            },
            header,
        )
        return response.data
    })
}

export const getTopics = async (page?: number, limit = 10) => {
    const response = await client.get<TopicsResponse>(`/${TOPICS_API_PREFIX}`, {
        params: { page, limit },
    })
    return response.data
}

export const getTopic = async (topicSlug: string) => {
    const response = await client.get<TopicResponse>(`/${TOPICS_API_PREFIX}/${topicSlug}`)
    return response.data
}

export const getTopicPosts = async (topicSlug: string, page?: number, limit = 10) => {
    const response = await client.get<TopicPostsResponse>(`/topic/${topicSlug}`, {
        params: { page, limit },
    })
    return response.data
}

export const getTopicPostByLocalId = async (topicSlug: string, topicLocalId: number) => {
    const response = await client.get<PostResponse>(`/topic/${topicSlug}/${topicLocalId}`)
    return response.data
}
