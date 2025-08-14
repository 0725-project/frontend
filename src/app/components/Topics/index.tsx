'use client'

import { formatDate } from '@/utils/dateFormatter'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getTopics, TopicsResponse } from '@/api/topics'
import Pagination from '../Pagination'
import { getClosestAllowedValue } from '@/utils/getClosestAllowedValue'

const LIMIT_OPTIONS = [6, 12, 18, 24]
const MAX_PAGE_BUTTONS = 5

const TopicsList = () => {
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

    const { data, isLoading, isError } = useQuery<TopicsResponse, Error>({
        queryKey: ['topics', page, limit],
        queryFn: () => getTopics(page, limit),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 1,
    })

    const topics = data?.topics ?? []
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
        <section className='max-w-5xl mx-auto p-5'>
            <h2 className='text-2xl font-bold mb-4 text-slate-700'>토픽 목록</h2>
            <div className='grid grid-cols-1 2xl:grid-cols-2 gap-4 min-h-[300px]'>
                {isLoading ? (
                    <div className='text-center py-8 text-gray-400'>로딩 중...</div>
                ) : isError ? (
                    <div className='text-center py-8 text-red-400'>토픽을 불러오지 못했습니다.</div>
                ) : topics.length === 0 ? (
                    <div className='text-center py-8 text-gray-400'>토픽이 없습니다.</div>
                ) : (
                    topics.map((topic, index) => (
                        <Link key={index} href={`/topics/${topic.slug}`} className='no-underline'>
                            <div className='bg-white rounded-lg border border-gray-200 p-4 flex flex-col min-h-[160px] hover:bg-gray-50'>
                                <div className='flex items-center gap-2 mb-2'>
                                    <div className='w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold text-lg'>
                                        {topic.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className='text-lg font-semibold text-gray-900 truncate'>{topic.name}</span>
                                </div>
                                <p className='text-gray-700 text-sm mb-2 line-clamp-2'>
                                    {topic.description || '설명이 없습니다.'}
                                </p>
                                <div className='flex items-center justify-between text-xs text-gray-500 mt-auto'>
                                    <span>게시글 수: {topic.postCount}</span>
                                </div>
                                <div className='flex items-center text-xs text-gray-500 mt-auto'>
                                    <span>by {topic.creator?.nickname || topic.creator?.username || '알 수 없음'}</span>
                                    <span className='mx-1'>•</span>
                                    <span>{formatDate(topic.createdAt)}</span>
                                </div>
                            </div>
                        </Link>
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
        </section>
    )
}

export default TopicsList
