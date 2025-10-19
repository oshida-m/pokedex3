"use client";

import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  ...props
}: PaginationProps & React.ComponentProps<"nav">) {
  // ページ番号の表示ロジック
  // 前後2ページ＋最初と最後＋省略表示
  const paginationRange = React.useMemo(() => {
    const delta = 2
    const range = []
    let l: number | null = null

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        if (l !== null && i - l > 1) {
          range.push("ellipsis")
        }
        range.push(i)
        l = i
      }
    }
    return range
  }, [currentPage, totalPages])

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center space-x-1", className)}
      {...props}
    >
      <PaginationPrevious
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeftIcon />
        <span className="hidden sm:inline">前へ</span>
      </PaginationPrevious>

      {paginationRange.map((item, idx) =>
        item === "ellipsis" ? (
          <PaginationEllipsis key={`ellipsis-${idx}`} />
        ) : (
          <PaginationLink
            key={item}
            isActive={item === currentPage}
            onClick={() => onPageChange(item as number)}
          >
            {item}
          </PaginationLink>
        )
      )}

      <PaginationNext
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        <span className="hidden sm:inline">次へ</span>
        <ChevronRightIcon />
      </PaginationNext>
    </nav>
  )
}

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: {
  isActive?: boolean
  size?: "icon" | "default"
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  disabled,
  ...props
}: {
  className?: string
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      disabled={disabled}
      {...props}
    />
  )
}

function PaginationNext({
  className,
  disabled,
  ...props
}: {
  className?: string
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      disabled={disabled}
      {...props}
    />
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
}
