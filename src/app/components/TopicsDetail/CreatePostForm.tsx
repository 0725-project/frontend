'use client'

import React, { useState } from 'react'
import { createPost } from '@/api/posts'
import { useAuth } from '../../context/AuthContext'

interface CreatePostFormProps {
    onSuccess: () => void
    topicSlug: string
}

const CreatePostForm = (props: CreatePostFormProps) => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await createPost(title, content, props.topicSlug)

            setTitle('')
            setContent('')

            props.onSuccess()
        } catch (err) {
            alert('게시글 작성에 실패했습니다.')
        } finally {
            setLoading(false)
        }
    }

    if (!user) return <div>로그인 후 게시글을 작성할 수 있습니다.</div>

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
            <input
                type='text'
                value={`Topic/${props.topicSlug}`}
                disabled
                className='border p-2 rounded text-gray-500'
            />
            <input
                type='text'
                placeholder='제목'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className='border p-2 rounded'
            />
            <textarea
                placeholder='내용'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className='border p-2 rounded h-64'
            />
            <button type='submit' disabled={loading} className='bg-slate-600 text-white p-2 rounded'>
                {loading ? '작성 중...' : '게시글 작성'}
            </button>
        </form>
    )
}

export { CreatePostForm }
