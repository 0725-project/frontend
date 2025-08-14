'use client'

import { Home, Compass, Info, ChevronsRight, ChevronsDown, ListTree, User, Star } from 'lucide-react'
import { SidebarItem } from './LeftSidebarItems'
import { SidebarSection } from './SidebarSection'
import { useAuth } from '../../context/AuthContext'

interface LeftSidebarProps {
    isCollapsed: boolean
    onToggle: () => void
    isMobile?: boolean
    isSidebarOpen?: boolean
    closeSidebar?: () => void
    currentItem?: string
}

const LeftSidebar = (props: LeftSidebarProps) => {
    const { user } = useAuth()
    return (
        <div className='relative'>
            <nav
                className={
                    props.isMobile
                        ? `fixed top-0 left-0 z-[60] h-full w-64 bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 ease-in-out ${props.isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
                        : `sticky top-14 z-30 bg-white border-r border-gray-200 transition-all duration-300 w-[${props.isCollapsed ? '56px' : '256px'}] h-[calc(100vh-4rem)]`
                }
                style={
                    props.isMobile
                        ? { height: '100vh', width: '16rem' }
                        : { width: props.isCollapsed ? '56px' : '256px', height: 'calc(100vh - 4rem)' }
                }
                aria-label='Sidebar'
            >
                {props.isMobile && (
                    <div className='flex justify-end p-2'>
                        <button
                            className='p-2 rounded-full hover:bg-gray-100 text-gray-700'
                            aria-label='Close menu'
                            onClick={props.closeSidebar}
                        >
                            <svg
                                width='24'
                                height='24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                viewBox='0 0 24 24'
                            >
                                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </button>
                    </div>
                )}
                <div className={`flex flex-col h-full ${props.isCollapsed ? 'p-2' : 'p-4'}`}>
                    <div className='flex-1 overflow-y-auto space-y-4'>
                        <div className='space-y-1'>
                            <SidebarItem
                                icon={Home}
                                label='홈'
                                url='/'
                                isActive={props.currentItem === 'home'}
                                isCollapsed={props.isCollapsed}
                            />
                            <SidebarItem
                                icon={User}
                                label='내 정보'
                                url='/profile'
                                isActive={props.currentItem === 'profile'}
                                isCollapsed={props.isCollapsed}
                            />
                            <SidebarItem
                                icon={ListTree}
                                label='전체 게시글'
                                url='/posts'
                                isActive={props.currentItem === 'posts'}
                                isCollapsed={props.isCollapsed}
                            />
                            <SidebarItem
                                icon={Compass}
                                label='토픽 탐색'
                                url='/topics'
                                isActive={props.currentItem === 'topics'}
                                isCollapsed={props.isCollapsed}
                            />
                        </div>

                        {!props.isCollapsed && user && user.favoriteTopics && (
                            <SidebarSection title={`토픽 즐겨찾기 (${user.favoriteTopics.length})`}>
                                {user.favoriteTopics.length > 0 ? (
                                    user.favoriteTopics.map((topic) => (
                                        <SidebarItem
                                            key={topic.id}
                                            icon={Star}
                                            label={topic.name}
                                            url={`/topics/${topic.slug}`}
                                            isCollapsed={props.isCollapsed}
                                        />
                                    ))
                                ) : (
                                    <div className='text-gray-400 px-2 py-1 text-sm'>즐겨찾기 없음</div>
                                )}
                            </SidebarSection>
                        )}

                        {!props.isCollapsed && (
                            <SidebarSection title='정보'>
                                <SidebarItem
                                    icon={Info}
                                    label='정보'
                                    isActive={props.currentItem === 'info'}
                                    isCollapsed={props.isCollapsed}
                                />
                            </SidebarSection>
                        )}
                    </div>
                </div>
                {!props.isMobile && (
                    <button
                        onClick={props.onToggle}
                        className='absolute top-1/2 right-[-12px] z-40 -translate-y-14 bg-white border border-gray-300 p-1 rounded-4xl shadow hover:bg-gray-100'
                        aria-label={props.isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    >
                        {props.isCollapsed ? (
                            <ChevronsRight className='w-4 h-6 text-gray-600' />
                        ) : (
                            <ChevronsDown className='w-4 h-6 rotate-90 text-gray-600' />
                        )}
                    </button>
                )}
            </nav>
        </div>
    )
}

export { LeftSidebar }
