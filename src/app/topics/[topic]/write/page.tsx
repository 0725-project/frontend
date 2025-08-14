'use client'

import { CreatePostForm } from '@/app/components/TopicsDetail/CreatePostForm'
import { useRouter, useParams } from 'next/navigation'
import { PageLayout } from '@/app/components/PageLayout'

const TopicWritePage = () => {
    const { topic: topicSlug } = useParams()
    const topic = topicSlug as string
    const router = useRouter()

    const handleSuccess = () => {
        router.push(`/topics/${topic}?page=1`)
        router.refresh()
    }

    return (
        <PageLayout>
            <div className='max-w-2xl mx-auto py-8 px-4'>
                <h2 className='text-xl font-bold mb-4'>글 작성</h2>
                <CreatePostForm topicSlug={topic} onSuccess={handleSuccess} />
            </div>
        </PageLayout>
    )
}

export default TopicWritePage
