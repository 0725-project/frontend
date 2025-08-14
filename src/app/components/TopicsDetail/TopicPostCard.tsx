import { PostResponse } from '@/api/posts'
import { ArrowUp, ArrowDown, MessageSquare, MoreHorizontal } from 'lucide-react'

interface TopicPostCardProps {
    post: Omit<PostResponse, 'topic'>
}

const TopicPostCard = ({ post }: TopicPostCardProps) => {
    return (
        <div className='bg-white rounded-lg border border-gray-200 overflow-hidden mb-4 hover:bg-gray-50 transition-colors duration-200'>
            <div className='flex items-center justify-between p-2 md:p-3 pb-2'>
                <div className='flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2'>
                    <div className='flex items-center gap-2 text-xs md:text-sm'>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-slate-600`}>
                            <span className='text-white text-xs font-bold'>
                                {post.author.nickname.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <span className='font-medium'>{post.author.nickname}</span>
                        <span className='text-gray-500'>•</span>
                        <span className='text-gray-500'>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span className='text-gray-500'>•</span>
                        <span className='text-gray-500'>조회수 {post.viewCount}</span>
                    </div>
                </div>
                <div className='flex items-center space-x-1 md:space-x-2'>
                    <button className='p-2 rounded-full hover:bg-gray-100'>
                        <MoreHorizontal className='w-4 h-4' />
                    </button>
                </div>
            </div>

            <div className='px-2 md:px-3 pb-2'>
                <h3 className='text-base md:text-lg font-medium text-gray-900'>{post.title}</h3>
            </div>

            <div className='flex items-center space-x-2 md:space-x-4 px-2 md:px-3 py-2 border-t border-gray-100'>
                <div className='flex items-center space-x-1'>
                    <button className='p-1 rounded-full hover:bg-gray-100'>
                        <ArrowUp className='w-4 h-4' />
                    </button>
                    <span className='text-xs md:text-sm font-medium'>{post.likeCount}</span>
                    <button className='p-1 rounded-full hover:bg-gray-100'>
                        <ArrowDown className='w-4 h-4' />
                    </button>
                </div>

                <button className='flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-100 text-xs md:text-sm'>
                    <MessageSquare className='w-4 h-4' />
                    <span>{post.commentCount}</span>
                </button>

                <div className='flex items-center space-x-1 ml-auto'>
                    <span className='text-gray-500 text-xs md:text-sm truncate'>@{post.author.username}</span>
                </div>
            </div>
        </div>
    )
}

export default TopicPostCard
