import { PostResponse } from '@/api/posts'
import { ArrowDown, ArrowUp, MessageSquare, MoreHorizontal } from 'lucide-react'
import { formatDate } from '@/utils/dateFormatter'

interface PostCardProps {
    post: PostResponse
}

const PostCard = ({ post }: PostCardProps) => (
    <div className='bg-white overflow-hidden hover:bg-gray-50 rounded-lg transition-all duration-200 border border-gray-200 h-full flex flex-col'>
        <div className='flex items-center justify-between p-2 pb-2'>
            <div className='flex flex-col space-y-1'>
                <div className='flex items-center gap-2 text-xs'>
                    <div className='w-6 h-6 rounded-full flex items-center justify-center bg-slate-600'>
                        <span className='text-white text-xs font-bold'>
                            {post.topic?.name?.charAt(0).toUpperCase() ?? '?'}
                        </span>
                    </div>
                    <span className='font-medium'>Topic/{post.topic?.name ?? 'No Topic'}</span>
                </div>
            </div>
            <div className='flex items-center space-x-1'>
                <button className='p-2 rounded-full hover:bg-gray-100'>
                    <MoreHorizontal className='w-4 h-4' />
                </button>
            </div>
        </div>

        <div className='mx-4'>
            <h2 className='text-base font-medium text-gray-900 line-clamp-2'>{post.title}</h2>
        </div>

        <div className='mx-4 mb-3 mt-auto'>
            <div className='flex items-center space-x-2 text-gray-500 text-xs'>
                <span>{formatDate(post.createdAt)}</span>
                <span>•</span>
                <span>조회수 {post.viewCount}</span>
            </div>
        </div>

        <div className='flex items-center space-x-2 px-2 py-2 border-t border-gray-200'>
            <div className='flex items-center space-x-1'>
                <button className='p-1 rounded-full hover:bg-gray-100'>
                    <ArrowUp className='w-4 h-4' />
                </button>
                <span className='text-xs font-medium'>{post.likeCount}</span>
                <button className='p-1 rounded-full hover:bg-gray-100'>
                    <ArrowDown className='w-4 h-4' />
                </button>
            </div>
            <button className='flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-100 text-xs'>
                <MessageSquare className='w-4 h-4' />
                <span>{post.commentCount}</span>
            </button>
            <span className='ml-auto text-gray-500 text-xs truncate'>@{post.author?.username ?? 'Unknown'}</span>
        </div>
    </div>
)

export { PostCard }
