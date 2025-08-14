'use client'

import { useState } from 'react'
import { PostCarousel } from './PostCarousel'
import { CalendarArrowUp, ChartNoAxesCombined } from 'lucide-react'
import { SearchBar, SearchValues } from './Search'

type Tab = 'popular' | 'latest'

const MainPage = () => {
    const [tab, setTab] = useState<Tab>('popular')

    const handleSearch = (values: SearchValues) => {
        const { query, author, topic } = values
        const searchParams = new URLSearchParams()

        if (query) searchParams.set('query', query)
        if (author) searchParams.set('author', author)
        if (topic) searchParams.set('topic', topic)

        window.location.href = `/search?${searchParams.toString()}`
    }

    return (
        <section className='w-full flex flex-col items-center mt-10 mb-10 p-5'>
            <SearchBar onSearch={handleSearch} />

            <div className='relative w-full max-w-6xl mb-10'>
                <div className='flex items-center mb-10 ml-10 gap-3'>
                    {tab === 'popular' ? (
                        <ChartNoAxesCombined className='w-8 h-8 text-gray-500' />
                    ) : (
                        <CalendarArrowUp className='w-8 h-8 text-gray-500' />
                    )}

                    <select
                        value={tab}
                        onChange={(e) => setTab(e.target.value as Tab)}
                        className='bg-transparent font-bold text-2xl focus:outline-none cursor-pointer'
                    >
                        <option value='popular'>인기 게시글</option>
                        <option value='latest'>최신 게시글</option>
                    </select>
                </div>

                {tab === 'popular' ? (
                    <PostCarousel query={{ page: 1, limit: 10, sortBy: 'likeCount' }} />
                ) : (
                    <PostCarousel query={{ page: 1, limit: 10 }} />
                )}
            </div>
        </section>
    )
}

export { MainPage }
