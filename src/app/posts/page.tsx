'use client'

import { Suspense } from 'react'
import { AllPosts } from '../components/AllPosts'
import { PageLayout } from '../components/PageLayout'

const PostsPage = () => (
    <PageLayout currentItem='posts'>
        <Suspense fallback={<div className='flex justify-center items-center h-full'>로딩 중...</div>}>
            <AllPosts />
        </Suspense>
    </PageLayout>
)

export default PostsPage
