import { client } from './client'
import { PostBriefResponse } from './posts'
import { withAuthRetry } from './token'
import { PaginationResponse } from './types'
import { UserBriefResponse } from './users'

export interface CommentResponse {
    id: number
    content: string
    createdAt: string
    user: UserBriefResponse
}

export interface PostCommentsResponse extends PaginationResponse {
    comments: CommentResponse[]
}

export interface UpdateCommentResponse {
    id: number
    content: string
    createdAt: string
    user: UserBriefResponse
}

export interface DeleteCommentResponse {}

export interface CommentWithDetailsResponse extends CommentResponse {
    post: PostBriefResponse
}

export interface AllCommentsResponse extends PaginationResponse {
    comments: CommentWithDetailsResponse[]
}

export const createComment = async (postId: number, content: string) => {
    return withAuthRetry(async (header) => {
        await client.post(
            `/posts/${postId}/comments`,
            {
                content,
            },
            header,
        )
    })
}

export interface GetPostCommentsDto {
    page?: number
    limit?: number
    order?: 'asc' | 'desc'
}

export const getPostComments = async (postId: number, dto: GetPostCommentsDto) => {
    const response = await client.get<PostCommentsResponse>(`/posts/${postId}/comments`, {
        params: { ...dto },
    })
    return response.data
}

export const updateComment = async (commentId: number, content: string) => {
    return withAuthRetry(async (header) => {
        const response = await client.put<UpdateCommentResponse>(
            `/comments/${commentId}`,
            {
                content,
            },
            header,
        )
        return response.data
    })
}

export const deleteComment = async (commentId: number) => {
    return withAuthRetry(async (header) => {
        const response = await client.delete(`/comments/${commentId}`, header)
        return response.data
    })
}

export const getAllComments = async (page?: number, limit: number = 10) => {
    const response = await client.get<AllCommentsResponse>('/comments', {
        params: { page, limit },
    })
    return response.data
}
