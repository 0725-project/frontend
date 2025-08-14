import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPostComments, PostCommentsResponse } from '@/api/comments'
import { PostResponse } from '@/api/posts'
import { formatDate } from '@/utils/dateFormatter'
import { MessageCircleMore } from 'lucide-react'
import Pagination from '../Pagination'
import CreateCommentForm from './CreateCommentForm'

const MAX_PAGE_BUTTONS = 5
const LIMIT_OPTIONS = [5, 10, 15, 20]

interface CommentsProps {
    post: PostResponse
}

const Comments = ({ post }: CommentsProps) => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(5)
    const [showForm, setShowForm] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    const { data, isLoading, isError } = useQuery<PostCommentsResponse, Error>({
        queryKey: ['postComments', post.id, page, limit, refreshKey],
        queryFn: () => getPostComments(post.id, { page, limit, order: 'asc' }),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 1,
    })

    const comments = data?.comments ?? []
    const total = data?.total ?? post.commentCount ?? 0
    const totalPages = Math.ceil(total / limit)

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit)
        setPage(1)
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        window.location.hash = 'comments'
    }

    const handleCommentSuccess = () => {
        setShowForm(false)
        setPage(totalPages > 0 ? totalPages : 1)
        setRefreshKey((prev) => prev + 1)
        window.location.hash = 'comments'
    }

    useEffect(() => {
        if (!isLoading && window.location.hash === '#comments') {
            const el = document.getElementById('comments')
            if (el) {
                el.scrollIntoView({ block: 'start' })
            }
        }
    }, [isLoading, page, limit])

    return (
        <div>
            <div id='comments'>
                <h2 className='text-xl font-bold mb-6 text-gray-800 border-b pb-3 flex items-center gap-2'>
                    <MessageCircleMore className='w-5 h-5 text-gray-500' />
                    <span className='text-gray-700'>댓글 ({total})</span>
                </h2>
                <ul className='space-y-5 min-h-[120px]'>
                    {isLoading ? (
                        <div className='text-center py-8 text-gray-400'>로딩 중...</div>
                    ) : isError ? (
                        <div className='text-center py-8 text-red-400'>댓글을 불러오지 못했습니다.</div>
                    ) : comments.length === 0 ? (
                        <div className='text-center py-8 text-gray-400'>댓글이 없습니다.</div>
                    ) : (
                        comments.map((comment, index) => (
                            <li key={index} className='px-5 py-4'>
                                {index > 0 && <hr className='border-gray-200 mb-4' />}
                                <div className='flex items-center gap-3 mb-2'>
                                    <div className='w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-base'>
                                        {comment.user.nickname.charAt(0)}
                                    </div>
                                    <span className='font-semibold text-gray-800 mr-2'>{comment.user.nickname}</span>
                                    <span className='text-xs text-gray-400'>
                                        {formatDate(comment.createdAt, { fullDateFormat: true })}
                                    </span>
                                </div>
                                <div className='text-gray-900 leading-relaxed whitespace-pre-line break-words'>
                                    {comment.content}
                                </div>
                            </li>
                        ))
                    )}
                    <div className='mb-4 flex justify-end'>
                        <button
                            className='bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-700 transition'
                            onClick={() => {
                                setShowForm((prev) => !prev)
                                if (!showForm) {
                                    window.location.hash = 'comments'
                                }
                            }}
                        >
                            {showForm ? '댓글 작성 취소' : '댓글 작성'}
                        </button>
                    </div>
                    {showForm && (
                        <React.Suspense fallback={<div>폼 로딩 중...</div>}>
                            <CreateCommentForm postId={post.id} onSuccess={handleCommentSuccess} />
                        </React.Suspense>
                    )}
                </ul>
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
        </div>
    )
}

export default Comments
