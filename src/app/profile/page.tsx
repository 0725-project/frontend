'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPosts, PostResponse, PostsResponse } from '@/api/posts'
import { useAuth } from '@/app/context/AuthContext'
import Pagination from '../components/Pagination'
import { PostCard } from '../components/AllPosts/PostCard'
import { formatDate } from '@/utils/dateFormatter'
import { useRouter } from 'next/navigation'
import { PageLayout } from '../components/PageLayout'
import UserCard from './UserCard'
import Link from 'next/link'

const LIMIT_OPTIONS = [5, 10, 15, 20]
const MAX_PAGE_BUTTONS = 5

const ProfilePage = () => {
    const { user } = useAuth()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const router = useRouter()

    const { data, isLoading, isError } = useQuery<PostsResponse, Error>({
        queryKey: ['userPosts', user?.username, page, limit],
        queryFn: () => getPosts({ page, limit, author: user?.username }),
        enabled: !!user,
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
        router.push(`/profile?page=1&limit=${newLimit}`)
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        router.push(`/profile?page=${newPage}&limit=${limit}`)
    }

    return (
        <PageLayout currentItem='profile'>
            <section className='w-full flex flex-col items-center p-5'>
                <UserCard />
                {user ? (
                    <div className='w-full max-w-5xl flex flex-col mt-10'>
                        <h2 className='text-2xl font-bold mb-6'>작성 글</h2>
                        <div className='space-y-2 md:space-y-4 min-h-[300px] w-full'>
                            {isLoading ? (
                                <div className='text-center py-8 text-gray-400'>로딩 중...</div>
                            ) : isError ? (
                                <div className='text-center py-8 text-red-400'>게시글을 불러오지 못했습니다.</div>
                            ) : posts.length === 0 ? (
                                <div className='text-center py-8 text-gray-400'>게시글이 없습니다.</div>
                            ) : (
                                posts.map((post, index) => (
                                    <Link
                                        key={index}
                                        href={`/topics/${post.topic.slug}/${post.topicLocalId}`}
                                        className='block'
                                    >
                                        <PostCard
                                            topic={post.topic?.name ?? 'No Topic'}
                                            username={post.author?.nickname ?? post.author?.username}
                                            createdAt={formatDate(post.createdAt)}
                                            title={post.title}
                                            likes={post.likeCount}
                                            comments={post.commentCount}
                                            views={post.viewCount}
                                        />
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
                    </div>
                ) : (
                    <></>
                )}
            </section>
        </PageLayout>
    )
}

export default ProfilePage
