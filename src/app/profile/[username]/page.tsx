'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserByUsername, UserResponse } from '@/api/users'
import { PageLayout } from '@/app/components/PageLayout'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { followUser, unfollowUser } from '@/api/subscription'
import UserCard from '@/app/profile/UserCard'
import { useState } from 'react'
import { getPosts, PostResponse, PostsResponse } from '@/api/posts'
import Link from 'next/link'
import { PostCard } from '@/app/components/AllPosts/PostCard'
import { formatDate } from '@/utils/dateFormatter'
import Pagination from '@/app/components/Pagination'

const LIMIT_OPTIONS = [5, 10, 15, 20]
const MAX_PAGE_BUTTONS = 5

const UserProfilePage = () => {
    const params = useParams()
    const username = params?.username as string
    const { user: currentUser } = useAuth()

    const queryClient = useQueryClient()

    const {
        data: user,
        isLoading,
        isError,
    } = useQuery<UserResponse>({
        queryKey: ['userProfile', username],
        queryFn: () => getUserByUsername(username),
        enabled: !!username,
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 1,
    })

    const followMutation = useMutation({
        mutationFn: () => followUser(username),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile', username] })
        },
    })

    const unfollowMutation = useMutation({
        mutationFn: () => unfollowUser(username),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile', username] })
        },
    })

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const router = useRouter()

    const {
        data: userPosts,
        isLoading: isPostsLoading,
        isError: isPostsError,
    } = useQuery<PostsResponse, Error>({
        queryKey: ['userPosts', user?.username, page, limit],
        queryFn: () => getPosts({ page, limit, author: user?.username }),
        enabled: !!user,
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 1,
    })

    const posts: PostResponse[] = userPosts?.posts ?? []
    const total = userPosts?.total ?? 0
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
                <UserCard
                    user={user}
                    mode={currentUser?.username === username ? 'self' : 'other'}
                    loading={isLoading}
                    onFollow={() => followMutation.mutate()}
                    onUnfollow={() => unfollowMutation.mutate()}
                />
                {user ? (
                    <div className='w-full max-w-5xl flex flex-col mt-10'>
                        <h2 className='text-2xl font-bold mb-6'>작성 글</h2>
                        <div className='space-y-2 md:space-y-4 min-h-[300px] w-full'>
                            {isPostsLoading ? (
                                <div className='text-center py-8 text-gray-400'>로딩 중...</div>
                            ) : isPostsError ? (
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

export default UserProfilePage
