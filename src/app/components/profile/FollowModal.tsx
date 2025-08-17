import React, { useState, useEffect } from 'react'
import Pagination from '../Pagination'

import { useQuery } from '@tanstack/react-query'
import { getFollowers, getFollowing, FollowersResponse, FollowingResponse } from '@/api/subscription'

interface FollowModalProps {
    visible: boolean
    onHide: () => void
    username: string
    followerCount: number
    followingCount: number
}

const LIMIT_OPTIONS = [5, 10, 15, 20]
const MAX_PAGE_BUTTONS = 5

const FollowModal: React.FC<FollowModalProps> = ({ visible, onHide, username, followerCount, followingCount }) => {
    const [tab, setTab] = useState<'followers' | 'following'>('followers')
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    useEffect(() => {
        setPage(1)
        setLimit(10)
    }, [tab, visible])

    const {
        data: followersData = undefined,
        isPending: followersLoading,
        isError: followersError,
    } = useQuery<FollowersResponse>({
        queryKey: ['followers', username, page, limit],
        queryFn: () => getFollowers(username, page, limit),
        enabled: visible && tab === 'followers',
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    })

    const {
        data: followingData = undefined,
        isPending: followingLoading,
        isError: followingError,
    } = useQuery<FollowingResponse>({
        queryKey: ['following', username, page, limit],
        queryFn: () => getFollowing(username, page, limit),
        enabled: visible && tab === 'following',
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    })

    if (!visible) return null

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs transition-colors duration-200'
            onClick={onHide}
        >
            <div
                className='bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative flex flex-col'
                style={{ maxHeight: '80vh' }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className='absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold'
                    onClick={onHide}
                    aria-label='Close'
                >
                    ×
                </button>
                <div className='flex gap-2 mb-6'>
                    <button
                        className={`px-4 py-2 rounded-lg font-bold transition-colors duration-150 ${tab === 'followers' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-700'}`}
                        onClick={() => setTab('followers')}
                    >
                        팔로워 ({followerCount})
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg font-bold transition-colors duration-150 ${tab === 'following' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-700'}`}
                        onClick={() => setTab('following')}
                    >
                        팔로잉 ({followingCount})
                    </button>
                </div>
                {tab === 'followers' ? (
                    <div className='flex-1 flex flex-col min-h-0'>
                        <div className='flex-1 overflow-y-auto' style={{ maxHeight: '45vh' }}>
                            {followersLoading ? (
                                <div className='text-gray-400'>로딩중...</div>
                            ) : followersError ? (
                                <div className='text-red-400'>팔로워를 불러오지 못했습니다.</div>
                            ) : followersData?.followers?.length === 0 ? (
                                <div className='text-gray-400'>팔로워가 없습니다.</div>
                            ) : (
                                <ul className='mb-4'>
                                    {followersData?.followers?.map((f) => (
                                        <li
                                            key={f.follower.username}
                                            className='py-3 border-b last:border-b-0 flex items-center gap-4'
                                        >
                                            <div className='w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-lg font-bold text-slate-500 shrink-0'>
                                                {f.follower.nickname?.charAt(0).toUpperCase() ||
                                                    f.follower.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className='flex flex-col flex-1 min-w-0'>
                                                <div className='font-semibold text-base text-slate-800 truncate'>
                                                    {f.follower.nickname || f.follower.username}
                                                </div>
                                                <div className='text-sm text-gray-500 truncate'>
                                                    @{f.follower.username}
                                                </div>
                                                <div className='text-xs text-gray-400 mt-1 truncate'>
                                                    {f.follower.description || '자기소개가 없습니다.'}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <Pagination
                                page={page}
                                limit={limit}
                                total={followersData?.total ?? 0}
                                limitOptions={LIMIT_OPTIONS}
                                onLimitChange={(newLimit) => {
                                    setLimit(newLimit)
                                    setPage(1)
                                }}
                                onPageChange={setPage}
                                isLoading={followersLoading}
                                maxPageButtons={MAX_PAGE_BUTTONS}
                            />
                        </div>
                    </div>
                ) : (
                    <div className='flex-1 flex flex-col min-h-0'>
                        <div className='flex-1 overflow-y-auto' style={{ maxHeight: '45vh' }}>
                            {followingLoading ? (
                                <div className='text-gray-400'>로딩중...</div>
                            ) : followingError ? (
                                <div className='text-red-400'>팔로잉을 불러오지 못했습니다.</div>
                            ) : followingData?.following?.length === 0 ? (
                                <div className='text-gray-400'>팔로잉이 없습니다.</div>
                            ) : (
                                <ul className='mb-4'>
                                    {followingData?.following?.map((f) => (
                                        <li
                                            key={f.following.username}
                                            className='py-3 border-b last:border-b-0 flex items-center gap-4'
                                        >
                                            <div className='w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-lg font-bold text-slate-500 shrink-0'>
                                                {f.following.nickname?.charAt(0).toUpperCase() ||
                                                    f.following.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className='flex flex-col flex-1 min-w-0'>
                                                <div className='font-semibold text-base text-slate-800 truncate'>
                                                    {f.following.nickname || f.following.username}
                                                </div>
                                                <div className='text-sm text-gray-500 truncate'>
                                                    @{f.following.username}
                                                </div>
                                                <div className='text-xs text-gray-400 mt-1 truncate'>
                                                    {f.following.description || '자기소개가 없습니다.'}
                                                </div>
                                                <div className='flex gap-2 mt-1 text-xs text-gray-600'>
                                                    <span>포인트: {f.following.points}</span>
                                                    <span>팔로워: {f.following.followersCount}</span>
                                                    <span>팔로잉: {f.following.followingCount}</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <Pagination
                                page={page}
                                limit={limit}
                                total={followingData?.total ?? 0}
                                limitOptions={LIMIT_OPTIONS}
                                onLimitChange={(newLimit) => {
                                    setLimit(newLimit)
                                    setPage(1)
                                }}
                                onPageChange={setPage}
                                isLoading={followingLoading}
                                maxPageButtons={MAX_PAGE_BUTTONS}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FollowModal
