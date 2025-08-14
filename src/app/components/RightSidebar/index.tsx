import { useQuery } from '@tanstack/react-query'
import { getAllComments } from '@/api/comments'
import CommentItem from './CommentItem'
import Link from 'next/link'

const RightSidebar = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['latest-comments'],
        queryFn: () => getAllComments(1, 5),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 1,
    })

    return (
        <aside className='hidden lg:block md:w-80 bg-white border-l border-gray-200 sticky top-14 h-[calc(100vh-4rem)] overflow-y-auto'>
            <section className='p-4'>
                <div className='flex items-center mb-4'>
                    <span className='text-lg font-bold text-slate-700'>최신 댓글 ({data?.comments?.length ?? 0})</span>
                </div>
                {isLoading && <div className='text-gray-400 text-sm'>로딩 중...</div>}
                {error && <div className='text-red-500 text-sm'>댓글을 불러오지 못했습니다.</div>}
                {data?.comments?.length === 0 && <div className='text-gray-400 text-sm'>댓글이 없습니다.</div>}
                {data?.comments?.map((comment, index) => (
                    <Link key={index} href={`/topics/${comment.post.topic.slug}/${comment.post.topicLocalId}`}>
                        <CommentItem comment={comment} />
                    </Link>
                ))}
            </section>
        </aside>
    )
}

export { RightSidebar }
