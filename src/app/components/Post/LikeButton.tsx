import React, { useState } from 'react'
import { createLike } from '@/api/likes'
import { useAuth } from '@/app/context/AuthContext'
import { ArrowUp } from 'lucide-react'

interface LikeButtonProps {
    postId: number
    likes: number
}

const LikeButton = (props: LikeButtonProps) => {
    const { user, loading } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [likeCount, setLikeCount] = useState(props.likes)
    const isDisabled = !user || loading || Boolean(error)

    const handleLike = async () => {
        if (isDisabled) return
        try {
            await createLike(props.postId)
            setLikeCount((prev) => prev + 1)
        } catch (e: any) {
            if (e.status === 409) {
                setError('이미 추천한 게시물입니다.')
            } else {
                setError('추천에 실패했습니다.')
            }
        }
    }

    return (
        <div className='flex items-center gap-2 flex-col'>
            <button
                className='w-32 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-none'
                onClick={handleLike}
                disabled={isDisabled}
                aria-disabled={isDisabled}
            >
                <div className='flex items-center justify-center'>
                    <ArrowUp className='w-5 h-5 inline mr-1' />
                    <span className='ml-1'>{likeCount}</span>
                </div>
            </button>
            {error && <div className='text-gray-400'>{error}</div>}
        </div>
    )
}

export default LikeButton
