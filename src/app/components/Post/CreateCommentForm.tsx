import React, { useState } from 'react'
import { createComment } from '@/api/comments'
import { useAuth } from '../../context/AuthContext'

interface CreateCommentFormProps {
    postId: number
    onSuccess: () => void
}

const CreateCommentForm = ({ postId, onSuccess }: CreateCommentFormProps) => {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await createComment(postId, content)
            setContent('')
            onSuccess()
        } catch (err) {
            alert('댓글 작성에 실패했습니다.')
        } finally {
            setLoading(false)
        }
    }

    if (!user) return <div className='text-gray-500'>로그인 후 댓글을 작성할 수 있습니다.</div>

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-2 p-4 rounded-lg border border-gray-200 mt-4'>
            <textarea
                placeholder='댓글을 입력하세요'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className='border p-2 rounded h-24 resize-none text-gray-900 focus:outline-none'
            />
            <button
                type='submit'
                disabled={loading || !content.trim()}
                className='bg-slate-600 text-white p-2 rounded font-semibold hover:bg-slate-700 transition'
            >
                {loading ? '작성 중...' : '댓글 작성'}
            </button>
        </form>
    )
}

export default CreateCommentForm
