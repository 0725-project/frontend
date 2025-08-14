import { client } from './client'
import { withAuthRetry } from './token'

export const addFavoriteTopic = async (topicSlug: string) => {
    return withAuthRetry(async (header) => {
        await client.post(`/favtopics/${topicSlug}`, {}, header)
    })
}

export const removeFavoriteTopic = async (topicSlug: string) => {
    return withAuthRetry(async (header) => {
        await client.delete(`/favtopics/${topicSlug}`, header)
    })
}
