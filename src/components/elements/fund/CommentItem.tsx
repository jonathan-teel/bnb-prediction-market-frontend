"use client";

import React from "react";
import { CiHeart } from "react-icons/ci";

// Define types for props
interface CommentItemProps {
  username: string;
  timeAgo: string;
  comment: string;
  avatarUrl: string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  username,
  timeAgo,
  comment,
  avatarUrl,
}) => {
  return (
    <div className="self-stretch p-4 bg-[#1a1f26] rounded-2xl border border-[#1f242c] inline-flex justify-start items-start gap-4">
      {/* Avatar */}
      <img
        className="w-8 h-8 rounded-[10px] border border-white"
        src={avatarUrl}
        alt={`${username}'s avatar`}
      />

      {/* Comment Content */}
      <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
        <div className="inline-flex justify-start items-center gap-1">
          <div className="justify-start text-[#FCD535] text-lg font-medium font-satoshi leading-loose">
            {username}
          </div>
          <div className="justify-start text-[#9EA5B5] text-sm font-medium font-satoshi leading-normal">
            {timeAgo}
          </div>
          <div className="w-4 h-4 relative overflow-hidden">
            <CiHeart className="text-white cursor-pointer" />
          </div>
        </div>
        <div className="self-stretch justify-start text-white text-lg font-medium font-satoshi leading-relaxed">
          {comment}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;




