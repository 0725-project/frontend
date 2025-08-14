'use client'

import TopicsList from '../components/Topics'
import { PageLayout } from '../components/PageLayout'
import { Suspense } from 'react'

const TopicsPage = () => (
    <PageLayout currentItem='topics'>
        <Suspense fallback={<div className='flex justify-center items-center h-full'>로딩 중...</div>}>
            <TopicsList />
        </Suspense>
    </PageLayout>
)

export default TopicsPage
