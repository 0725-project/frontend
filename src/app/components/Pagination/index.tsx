import React from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface PaginationProps {
    page: number
    limit: number
    total: number
    limitOptions: number[]
    onLimitChange: (newLimit: number) => void
    onPageChange: (newPage: number) => void
    isLoading: boolean
    maxPageButtons: number
}

const Pagination = (props: PaginationProps) => {
    const totalPages = Math.ceil(props.total / props.limit)
    const startPage = Math.max(1, props.page - Math.floor(props.maxPageButtons / 2))
    const endPage = Math.min(totalPages, startPage + props.maxPageButtons - 1)
    const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(e.target.value, 10)
        props.onLimitChange(newLimit)
    }

    return (
        <div className='flex justify-center items-center mt-15 space-x-2 mb-20'>
            <button
                onClick={() => props.onPageChange?.(1)}
                disabled={props.page === 1 || props.isLoading}
                className='px-3 py-1 rounded-md text-sm font-medium bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
                <ChevronsLeft className='w-4 h-4 inline' />
            </button>
            <button
                onClick={() => props.onPageChange(props.page - 1)}
                disabled={props.page === 1 || props.isLoading}
                className='px-3 py-1 rounded-md text-sm font-medium bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
                <ChevronLeft className='w-4 h-4 inline' />
            </button>
            {visiblePages.map((p) => (
                <button
                    key={p}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-150 ${
                        p === props.page ? 'bg-slate-700 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => props.onPageChange(p)}
                    disabled={props.isLoading}
                >
                    {p}
                </button>
            ))}
            <button
                onClick={() => props.onPageChange(props.page + 1)}
                disabled={props.page === totalPages || props.isLoading}
                className='px-3 py-1 rounded-md text-sm font-medium bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
                <ChevronRight className='w-4 h-4 inline' />
            </button>
            <button
                onClick={() => props.onPageChange(totalPages)}
                disabled={props.page === totalPages || props.isLoading}
                className='px-3 py-1 rounded-md text-sm font-medium bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
                <ChevronsRight className='w-4 h-4 inline' />
            </button>
            <div className='ml-4 text-sm'>
                <select
                    id='limit'
                    value={props.limit}
                    onChange={handleLimitChange}
                    className='border rounded px-2 py-1 text-sm'
                >
                    {props.limitOptions.map((num) => (
                        <option key={num} value={num}>
                            {num}개
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default Pagination
