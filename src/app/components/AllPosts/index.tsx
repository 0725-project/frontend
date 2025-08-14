'use client'

import { ChevronDown } from 'lucide-react'
import Pagination from '../Pagination'
import { PostCard } from './PostCard'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPosts, PostResponse, PostsResponse } from '@/api/posts'
import { formatDate } from '@/utils/dateFormatter'
import { useRouter, useSearchParams } from 'next/navigation'
import { getClosestAllowedValue } from '@/utils/getClosestAllowedValue'
import Link from 'next/link'

const MAX_PAGE_BUTTONS = 5
const LIMIT_OPTIONS = [5, 10, 15, 20]

const AllPosts = () => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const pageParam = searchParams.get('page')
        const limitParam = searchParams.get('limit')

        const pageNum = pageParam ? parseInt(pageParam, 10) : 1
        const limitNum = limitParam ? parseInt(limitParam, 10) : 10

        setPage(pageNum)
        setLimit(getClosestAllowedValue(limitNum, LIMIT_OPTIONS))
    }, [searchParams])

    const { data, isLoading, isError } = useQuery<PostsResponse, Error>({
        queryKey: ['posts', page, limit],
        queryFn: () => getPosts({ page, limit }),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 1,
    })

    const posts: PostResponse[] = data?.posts ?? []
    const total = data?.total ?? 0
    const totalPages = Math.ceil(total / limit)

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit)
        setPage(1)
        router.push(`?page=1&limit=${newLimit}`)
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        router.push(`?page=${newPage}&limit=${limit}`)
    }

    return (
        <main className='flex-1 transition-all duration-300 min-h-[calc(100vh-4rem)] overflow-y-auto'>
            <div className='max-w-full md:max-w-5xl mx-auto px-2 md:px-4 py-2 md:py-4'>
                <div className='flex items-center justify-between mb-2 md:mb-4'>
                    <button className='text-slate-700 flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-100 text-sm md:text-base'>
                        Best
                        <ChevronDown className='w-4 h-4 ml-1' />
                    </button>
                </div>

                <div className='space-y-2 md:space-y-4 min-h-[300px]'>
                    {isLoading ? (
                        <div className='text-center py-8 text-gray-400'>로딩 중...</div>
                    ) : isError ? (
                        <div className='text-center py-8 text-red-400'>게시글을 불러오지 못했습니다.</div>
                    ) : posts.length === 0 ? (
                        <div className='text-center py-8 text-gray-400'>게시글이 없습니다.</div>
                    ) : (
                        posts.map((post: PostResponse, index) => (
                            <div key={index}>
                                <Link href={`/topics/${post.topic?.slug}/${post.topicLocalId}`} className='block'>
                                    <PostCard
                                        topic={post.topic?.name ?? 'No Topic'}
                                        username={post.author?.username ?? 'Unknown'}
                                        createdAt={formatDate(post.createdAt)}
                                        title={post.title}
                                        likes={post.likeCount}
                                        comments={post.commentCount}
                                        views={post.viewCount}
                                    />
                                </Link>
                            </div>
                        ))
                    )}
                </div>
                {totalPages > 1 && (
                    <Pagination
                        page={page}
                        limit={limit}
                        total={total}
                        limitOptions={LIMIT_OPTIONS}
                        onLimitChange={handleLimitChange}
                        onPageChange={handlePageChange}
                        isLoading={isLoading}
                        maxPageButtons={MAX_PAGE_BUTTONS}
                    />
                )}
            </div>
        </main>
    )
}

export { AllPosts }
