import Link from "next/link"
import { cn } from "@/lib/utils"
import 'tailwind-scrollbar-hide';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  onCategoryChange: (category: string) => void;
  activeCategory: string;
  categories: string[];
}

export function Sidebar({ className, onCategoryChange, activeCategory, categories }: SidebarProps) {
  return (
    <div className={cn(
      "fixed left-0 top-0 w-[140px] h-screen bg-muted/20 overflow-y-auto transition-all duration-300 ease-in-out",
      "scrollbar-hide",
      "overflow-x-hidden",
      "[&::-webkit-scrollbar]:hidden",
      "[-ms-overflow-style:'none']",
      "[scrollbar-width:none]",
      className
    )}>
      {/* 分类列表 */}
      <div className="p-[10px] space-y-4">
        <nav className="grid gap-1">
          {categories.map((item) => (
            <Link
              key={item}
              href="#"
              onClick={() => onCategoryChange(item)}
              className={cn(
                "text-xs font-medium hover:bg-accent hover:text-accent-foreground",
                "flex items-center rounded-md border border-transparent px-2 py-1.5",
                "w-full text-left whitespace-nowrap",
                "transition-all duration-100 ease-in-out",
                item === activeCategory 
                  ? "bg-accent text-accent-foreground translate-x-1" 
                  : "hover:translate-x-0.5"
              )}
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
