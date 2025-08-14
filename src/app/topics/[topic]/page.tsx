import { PageLayout } from '@/app/components/PageLayout'
import TopicDetail from '@/app/components/TopicsDetail'

interface Params {
    topic: string
}

const TopicPage = async ({ params }: { params: Promise<Params> }) => {
    const { topic: topicSlug } = await params

    return (
        <PageLayout currentItem='topics'>
            <TopicDetail topicSlug={topicSlug} />
        </PageLayout>
    )
}

export default TopicPage
