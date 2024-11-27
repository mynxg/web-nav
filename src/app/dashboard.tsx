"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import * as Icons from 'lucide-react'
import { type LucideIcon } from 'lucide-react'
import { Menu } from 'lucide-react'
import { Sidebar } from "@/components/sidebar"
import { ActionCard } from "@/components/action-card"
import categoriesData from '@/data/categories.json'
import { cn } from '@/lib/utils'

type IconName = keyof typeof Icons;

interface Action {
  icon: IconName;
  title: string;
  link: string;
  desc: string;
  type: string[];
}

const { actions } = categoriesData as { actions: Action[] };

const categories = Array.from(
  new Set(
    actions.flatMap(action => action.type)
  )
);

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const categoryRefs = useRef<Map<string, React.RefObject<HTMLElement>>>(new Map());
  const contentRef = useRef<HTMLDivElement>(null);

  // 初始化 refs
  useEffect(() => {
    categories.forEach((category) => {
      categoryRefs.current.set(category, React.createRef<HTMLElement>());
    });
  }, []);

  // 处理滚动监听
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      // 使用 requestAnimationFrame 优化滚动性能
      requestAnimationFrame(() => {
        const scrollTop = contentRef.current?.scrollTop || 0;
        let currentCategory = categories[0];
        let minDistance = Infinity;

        categories.forEach((category) => {
          const element = categoryRefs.current.get(category)?.current;
          if (element) {
            const distance = Math.abs(element.offsetTop - scrollTop);
            if (distance < minDistance) {
              minDistance = distance;
              currentCategory = category;
            }
          }
        });

        if (currentCategory !== activeCategory) {
          setActiveCategory(currentCategory);
        }
      });
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      // 使用 passive 选项提高滚动性能
      contentElement.addEventListener('scroll', handleScroll, { passive: true });
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [activeCategory]);

  // 处理类别切换
  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
    setIsMobileMenuOpen(false); // 移动端选择后关闭菜单
    const ref = categoryRefs.current.get(category);
    ref?.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 获取当前类别下的动作
  const getFilteredActions = useCallback((category: string) => {
    return actions.filter(action => action.type.includes(category));
  }, []);

  // 渲染类别区块
  const renderCategorySection = useCallback((category: string) => {
    const ref = categoryRefs.current.get(category);
    const filteredActions = getFilteredActions(category);
    
    return (
      <section key={category} ref={ref} className="space-y-4">
        <h2 className="text-sm font-semibold text-[rgb(var(--text-200))]">{category}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {filteredActions.map(({ icon, title, link, desc }, index) => {
            const Icon = Icons[icon] as LucideIcon;
            return (
              <ActionCard 
                key={`${category}-${title}-${index}`}
                icon={Icon}
                title={title}
                link={link}
                desc={desc}
                index={index}
              />
            );
          })}
        </div>
      </section>
    );
  }, [getFilteredActions]);

  return (
    <div className="flex min-h-screen bg-[rgb(var(--bg-100))]">
      {/* 移动端菜单按钮 */}
      <button
        className={cn(
          "fixed top-4 left-4 z-50 rounded-md p-1.5 bg-white/80 backdrop-blur-sm md:hidden",
          "hover:bg-accent hover:text-accent-foreground",
          "transition-all duration-100 ease-in-out"
        )}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* 左侧导航栏 */}
      <div 
        className={cn(
          "fixed left-0 top-0 w-[150px] h-screen bg-white shadow-lg z-40 transition-transform duration-100",
          "md:translate-x-0",
          "pt-16 md:pt-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
        onMouseLeave={() => {
          if (window.innerWidth < 768) { // md breakpoint
            setIsMobileMenuOpen(false);
          }
        }}
      >
        <Sidebar 
          categories={categories}
          onCategoryChange={handleCategoryChange}
          activeCategory={activeCategory}
        />
      </div>

      {/* 遮罩层 - 点击时关闭导航栏 */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 右侧内容区域 */}
      <div 
        className="flex-1 md:ml-[150px] h-full flex justify-center pl-0 md:pl-0"
        onClick={() => {
          if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
          }
        }}
      >
        {/* 内容区 */}
        <div className="p-3 md:p-[30px] mx-2 md:mx-0 mt-16 md:mt-12 rounded-xl shadow-lg bg-white/80 backdrop-blur-sm h-[calc(100vh-96px)] overflow-hidden w-full md:w-[800px]">
          <div 
            ref={contentRef}
            className="space-y-4 h-full overflow-y-auto scrollbar-hide will-change-scroll"
            style={{
              WebkitOverflowScrolling: 'touch',
              transform: 'translateZ(0)'
            }}
          >
            {categories.map(category => renderCategorySection(category))}
          </div>
        </div>
      </div>
    </div>
  );
}
