'use client'

import { incrementPostViewCount, PostResponse } from '@/api/posts'
import LikeButton from './LikeButton'
import { formatDate } from '@/utils/dateFormatter'
import { useEffect } from 'react'
import Comments from './Comments'
import Link from 'next/link'
import Markdown from '../Markdown'

interface PostProps {
    post: PostResponse
}

const PostPage = ({ post }: PostProps) => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        const incrementViewCount = async () => {
            try {
                await incrementPostViewCount(post.id)
            } catch (error) {
                console.error('Failed to increment view count:', error)
            }
        }
        incrementViewCount()
    }, [post.id])

    return (
        <section className='bg-white w-full flex justify-center px-2 md:px-0'>
            <article className='bg-white rounded-2xl max-w-5xl w-full p-3 md:p-10'>
                <header className='mb-6 border-b border-gray-100 pb-4 flex flex-col gap-2'>
                    <Link href={`/topics/${post.topic?.slug}`}>
                        <div className='flex items-center gap-2 text-sm text-gray-500'>
                            <span className='font-semibold'>
                                Topic/<span className='text-gray-800'>{post.topic?.name}</span>
                            </span>
                            <span className='hidden md:inline'>·</span>
                            <span>{post.topic?.description}</span>
                        </div>
                    </Link>
                    <h1 className='text-2xl md:text-3xl font-bold text-gray-900 leading-tight break-words mb-3'>
                        {post.title}
                    </h1>
                    <div className='flex items-center gap-3 text-sm text-gray-500'>
                        <div className='flex items-center gap-2'>
                            <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-base'>
                                {post.author.nickname?.[0]?.toUpperCase() || '?'}
                            </div>
                            <span className='font-medium text-gray-700'>{post.author.nickname}</span>
                        </div>
                        <span className='hidden md:inline'>·</span>
                        <span>
                            {formatDate(post.createdAt, {
                                todayFormat: false,
                                fullDateFormat: true,
                            })}
                        </span>
                        <span className='hidden md:inline'>·</span>
                        <span>조회수 {post.viewCount}</span>
                    </div>
                </header>
                <div className='prose max-w-none text-gray-900 min-h-[200px]'>
                    <Markdown content={post.content} />
                </div>
                <div className='w-full flex justify-center my-6'>
                    <LikeButton postId={post.id} likes={post.likeCount} />
                </div>
                <Comments post={post} />
            </article>
        </section>
    )
}

export { PostPage }
