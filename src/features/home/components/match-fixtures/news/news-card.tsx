import Link from "next/link"
import { Heart, MessageCircle } from "lucide-react"

import type { NewsItem } from "@/features/home/home.api"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Img } from "@/components/ui/image"
import { Typography } from "@/components/ui/typography"

export interface NewsCardProps {
  item: NewsItem
  categoryLabel: string
  href: string
}

export function NewsCard({ item, href }: NewsCardProps) {
  return (
    <Link
      href={href}
      className="group hover:bg-blue/[0.05] -mx-2 flex cursor-pointer flex-col gap-2 rounded-lg px-2 py-1 transition-colors lg:flex-row lg:gap-3"
    >
      <Img
        src={item.coverUrl}
        alt={item.title}
        fill
        objectFit="cover"
        rounded="8"
        sizes="(max-width: 1024px) 100vw, 160px"
        wrapperClassName="aspect-[16/9] w-full shrink-0 lg:aspect-auto lg:h-[110px] lg:w-[160px]"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Typography
          variant="body"
          className="text-foreground/70 line-clamp-2 transition-colors group-hover:text-white"
        >
          {item.title}
        </Typography>
        <div className="mt-auto flex items-center gap-3">
          {item.userName && (
            <div className="flex min-w-0 items-center gap-1.5">
              {item.userAvatar && (
                <Avatar size={24}>
                  <AvatarImage src={item.userAvatar} alt={item.userName} />
                </Avatar>
              )}
              <Typography variant="caption" className="truncate">
                {item.userName}
              </Typography>
            </div>
          )}
          <div className="flex items-center gap-2">
            {item.likeCount != null && (
              <span className="flex items-center gap-0.5">
                <Heart className="text-foreground/30 size-4" />
                <Typography variant="caption" color="foreground/40">
                  {item.likeCount}
                </Typography>
              </span>
            )}
            {item.commentCount != null && (
              <span className="flex items-center gap-0.5">
                <MessageCircle className="text-foreground/30 size-4" />
                <Typography variant="caption" color="foreground/40">
                  {item.commentCount}
                </Typography>
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
