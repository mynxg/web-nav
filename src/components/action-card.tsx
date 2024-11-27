import { type LucideIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface ActionCardProps {
  icon: LucideIcon
  title: string
  link: string
  desc: string
  index: number
}

const bgColors = [
  'rgba(143, 191, 159, 0.2)',  // --primary-100
  'rgba(104, 166, 125, 0.2)',  // --primary-200
  'rgba(241, 143, 1, 0.2)',    // --accent-100
  'rgba(131, 53, 0, 0.15)',    // --accent-200
  'rgba(245, 236, 215, 0.5)',  // --bg-100
  'rgba(235, 226, 205, 0.5)',  // --bg-200
];

export function ActionCard({ icon: Icon, title, link, desc, index }: ActionCardProps) {
  const backgroundColor = bgColors[index % bgColors.length];

  const iconBgColor = backgroundColor === 'rgba(241, 143, 1, 0.2)' 
    ? 'rgba(131, 53, 0, 0.15)' 
    : 'rgba(143, 191, 159, 0.2)';

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ backgroundColor }}
      className={cn(
        "w-full md:w-[170px] h-[101px] rounded-2xl p-4",
        "hover:scale-105 transition-all duration-300",
        "shadow-sm hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
        "flex flex-col items-start justify-between",
        "group relative text-[#353535]"  // --text-100
      )}
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      whileInView={{ 
        opacity: 1, 
        scale: 1,
        y: 0,
        transition: { 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: index * 0.1
        }
      }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div 
        style={{ backgroundColor: iconBgColor }}
        className="w-10 h-10 rounded-xl flex items-center justify-center"
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="text-sm font-medium text-[#353535]">
        {title}
      </div>
      <div className="absolute inset-0 bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl p-4 flex items-center justify-center text-center text-sm">
        {desc}
      </div>
    </motion.a>
  )
}
