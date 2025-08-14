import { ArrowUp, ArrowDown, MessageSquare, Share, MoreHorizontal } from 'lucide-react'

interface PostCardProps {
    title: string
    username: string
    topic: string
    createdAt: string
    thumbnailUrl?: string
    views: number
    likes: number
    comments: number
    color?: string
}

const PostCard = (props: PostCardProps) => {
    return (
        <div className='bg-white overflow-hidden hover:bg-gray-50 rounded-lg transition-all duration-200 border border-gray-200   '>
            <div className='flex items-center justify-between p-2 md:p-3 pb-2'>
                <div className='flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2'>
                    <div className='flex items-center gap-2 text-xs md:text-sm'>
                        <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${props.color ?? 'bg-slate-600'}`}
                        >
                            <span className='text-white text-xs font-bold'>{props.topic.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className='font-medium'>Topic/{props.topic}</span>
                        <span className='text-gray-500'>•</span>
                        <span className='text-gray-500'>{props.createdAt}</span>
                        <span className='text-gray-500'>•</span>
                        <span className='text-gray-500'>조회수 {props.views}</span>
                    </div>
                </div>
                <div className='flex items-center space-x-1 md:space-x-2'>
                    <button className='p-2 rounded-full hover:bg-gray-100'>
                        <MoreHorizontal className='w-4 h-4' />
                    </button>
                </div>
            </div>

            <div className='px-2 md:px-3 pb-2'>
                <h2 className='text-base md:text-lg font-medium text-gray-900'>{props.title}</h2>
            </div>

            {props.thumbnailUrl && (
                <div className='px-2 md:px-3 pb-3'>
                    <img src={props.thumbnailUrl} alt='Post content' className='w-full rounded-lg' />
                </div>
            )}

            <div className='flex items-center space-x-2 md:space-x-4 px-2 md:px-3 py-2 border-t border-gray-200'>
                <div className='flex items-center space-x-1'>
                    <button className='p-1 rounded-full hover:bg-gray-100'>
                        <ArrowUp className='w-4 h-4' />
                    </button>
                    <span className='text-xs md:text-sm font-medium'>{props.likes}</span>
                    <button className='p-1 rounded-full hover:bg-gray-100'>
                        <ArrowDown className='w-4 h-4' />
                    </button>
                </div>

                <button className='flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-100 text-xs md:text-sm'>
                    <MessageSquare className='w-4 h-4' />
                    <span>{props.comments}</span>
                </button>

                <div className='flex items-center space-x-1 ml-auto'>
                    <span className='text-gray-500 text-xs md:text-sm truncate'>@{props.username}</span>
                </div>
            </div>
        </div>
    )
}

export { PostCard }
