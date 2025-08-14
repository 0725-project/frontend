'use client'

import { useQuery } from '@tanstack/react-query'
import { getPosts, PostResponse, GetPostsRequest } from '@/api/posts'
import { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { PostCard } from './PostCard'

interface PostCarouselProps {
    query: GetPostsRequest
}

export const PostCarousel = ({ query }: PostCarouselProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })
    const autoplayInterval = useRef<NodeJS.Timeout | null>(null)
    const isHovering = useRef(false)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [autoplayEnabled, setAutoplayEnabled] = useState(false)

    const { data, isLoading, isError } = useQuery<{ posts: PostResponse[] }, Error>({
        queryKey: ['posts-carousel', query],
        queryFn: () => getPosts(query),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 1,
    })

    const posts = data?.posts ?? []
    const totalSlides = posts.length

    const updateSelectedIndex = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    const startAutoplay = useCallback(() => {
        if (!autoplayEnabled || autoplayInterval.current || !emblaApi) return
        autoplayInterval.current = setInterval(() => {
            if (!document.hidden && !isHovering.current) {
                if (emblaApi.canScrollNext()) {
                    emblaApi.scrollNext()
                } else {
                    emblaApi.scrollTo(0)
                }
            }
        }, 4000)
    }, [emblaApi, autoplayEnabled])

    const stopAutoplay = useCallback(() => {
        if (autoplayInterval.current) {
            clearInterval(autoplayInterval.current)
            autoplayInterval.current = null
        }
    }, [])

    useEffect(() => {
        if (!emblaApi) return

        emblaApi.on('select', updateSelectedIndex)
        updateSelectedIndex()

        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopAutoplay()
            } else if (!isHovering.current && autoplayEnabled) {
                startAutoplay()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        if (autoplayEnabled) startAutoplay()

        return () => {
            stopAutoplay()
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [emblaApi, updateSelectedIndex, startAutoplay, stopAutoplay, autoplayEnabled])

    const handleMouseEnter = () => {
        isHovering.current = true
        stopAutoplay()
    }

    const handleMouseLeave = () => {
        isHovering.current = false
        if (autoplayEnabled) startAutoplay()
    }

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

    const toggleAutoplay = () => {
        setAutoplayEnabled((prev) => {
            const next = !prev
            if (!next) stopAutoplay()
            else startAutoplay()
            return next
        })
    }

    if (isLoading) return <div className='text-gray-400 text-lg'>로딩 중...</div>
    if (isError) return <div className='text-red-400 text-lg'>게시글을 불러오지 못했습니다.</div>
    if (totalSlides === 0) return <div className='text-gray-400 text-lg'>게시글이 없습니다.</div>

    return (
        <div className='relative'>
            <div className='pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent z-10' />
            <div className='pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent z-10' />

            <button
                onClick={scrollPrev}
                className='absolute left-[-10px] top-1/2 transform -translate-y-1/2 z-10 p-1 bg-white border shadow rounded-full hover:bg-gray-100 transition-all duration-150'
            >
                <ChevronLeft className='w-6 h-6 text-gray-500 hover:text-gray-800' />
            </button>
            <button
                onClick={scrollNext}
                className='absolute right-[-10px] top-1/2 transform -translate-y-1/2 z-10 p-1 bg-white border shadow rounded-full hover:bg-gray-100 transition-all duration-150'
            >
                <ChevronRight className='w-6 h-6 text-gray-500 hover:text-gray-800' />
            </button>

            <div
                ref={emblaRef}
                className='overflow-hidden'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className='flex p-1'>
                    {posts.map((post, index) => (
                        <Link
                            key={index}
                            href={`/topics/${post.topic?.slug}/${post.topicLocalId}`}
                            className='min-w-[260px] max-w-[260px] h-[260px] flex flex-col px-2'
                            style={{ flex: '0 0 auto' }}
                        >
                            <PostCard post={post} />
                        </Link>
                    ))}
                </div>
            </div>

            <div className='flex flex-col items-center mt-10'>
                <span className='text-sm text-gray-700 mb-1'>
                    {selectedIndex + 1} / {totalSlides}
                </span>
                <div className='w-40 h-1 bg-gray-200 rounded'>
                    <div
                        className='h-1 bg-gray-500 rounded transition-all duration-300'
                        style={{ width: `${((selectedIndex + 1) / totalSlides) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    )
}
