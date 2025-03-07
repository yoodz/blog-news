"use client"
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Toaster } from '@/components/ui/sonner'
import { toast } from "sonner"; // 如果你在使用 React 版本

interface IHome {
  initialData: {
    total: number
    page: number
    results: {
      title: string
      link: string
      hostname: string
      pubDate: string
    }[]
  }
}

const PAGE_SIZE = 20
export default function Home({ initialData }: IHome) {
  const form = useForm()
  const [posts, setPosts] = useState(initialData)
  const [wait, setWait] = useState(0)
  const { totalPage, currentPage } = useMemo(() => {
    return {
      totalPage: Math.ceil(posts.total / PAGE_SIZE),
      currentPage: +posts.page
    }
  }, [posts])

  async function getData(page: number) {
    try {
      const data = await fetch(`https://blogapi.afunny.top/.netlify/functions/get-rss?page=${page}&page_size=${PAGE_SIZE}`)
      const res = await data.json()
      setPosts(res)
    } catch (error) {
      console.log(error, 'clientPage-64')
    } finally {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }

  const handleClick = (link: string) => {
    window.open(link)
  }

  const handlePagination = (type: string | number) => {
    if (type === 'pre') {
      if (currentPage > 1) {
        getData(currentPage - 1)
      }
      return
    }

    if (type === 'next') {
      if (currentPage < totalPage) {
        getData(currentPage + 1)
      }
      return
    }

    getData(type as number)
  }

  function onSubmit() {
    toast.success("暂未开放。");
  }

  const initAwaitCount = async () => {
    const res = await fetch(
      `https://blogapi.afunny.top/.netlify/functions/track-visit?slug=blog_news_rss_click`
    );
    const resJson = await res.json()
    setWait(resJson.count)
  }

  const hurryUp = async () => {
    toast.success("加急成功！");
    initAwaitCount()
  }

  useEffect(() => {
    // 服务端请求失败客户端重试
    if (!posts?.page) {
      getData(1)
    }
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-4 py-8">
      <Toaster />
      <div className="flex justify-between items-center text-2xl font-bold text-zinc-800">
        <div className="flex items-center">
          <div className="mr-5">Blog News</div>
          <svg onClick={() => window.open('https://github.com/yoodz/blog-news')} fill="currentColor" height="1em" stroke="currentColor" stroke-width="0" viewBox="0 0 512 512" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 32C132.3 32 32 134.9 32 261.7c0 101.5 64.2 187.5 153.2 217.9a17.56 17.56 0 003.8.4c8.3 0 11.5-6.1 11.5-11.4 0-5.5-.2-19.9-.3-39.1a102.4 102.4 0 01-22.6 2.7c-43.1 0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1 1.4-14.1h.1c22.5 2 34.3 23.8 34.3 23.8 11.2 19.6 26.2 25.1 39.6 25.1a63 63 0 0025.6-6c2-14.8 7.8-24.9 14.2-30.7-49.7-5.8-102-25.5-102-113.5 0-25.1 8.7-45.6 23-61.6-2.3-5.8-10-29.2 2.2-60.8a18.64 18.64 0 015-.5c8.1 0 26.4 3.1 56.6 24.1a208.21 208.21 0 01112.2 0c30.2-21 48.5-24.1 56.6-24.1a18.64 18.64 0 015 .5c12.2 31.6 4.5 55 2.2 60.8 14.3 16.1 23 36.6 23 61.6 0 88.2-52.4 107.6-102.3 113.3 8 7.1 15.2 21.1 15.2 42.5 0 30.7-.3 55.5-.3 63 0 5.4 3.1 11.5 11.4 11.5a19.35 19.35 0 004-.4C415.9 449.2 480 363.1 480 261.7 480 134.9 379.7 32 256 32z"></path></svg>
        </div>
        <Dialog>
          <DialogTrigger asChild><Button className="cursor-pointer" variant="outline" onClick={initAwaitCount}>提交RSS</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-5">提交RSS</DialogTitle>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>网站名称</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入网站名称" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rss"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RSS地址</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入RSS地址" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>邮箱</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入邮箱" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex">
                    <Button type="submit" className="active:opacity-80 mr-2 cursor-pointer" variant="secondary">提交（暂未开放）</Button>
                    <Button type="reset" onClick={hurryUp} className="flex-1 active:opacity-80 cursor-pointer">加急作者({wait})</Button>
                  </div>
                </form>
              </Form>
            </DialogHeader>
          </DialogContent>
        </Dialog>

      </div>
      <div className="text-md text-gray-500 my-4">一个基于RSS的Blog News博客聚合项目，每天自动抓取博客文章, 每篇文章都保留了原始链接，点击标题即可直接访问原作者网站。</div>
      <main className="flex flex-col gap-2 row-start-2 items-center sm:items-start">
        {posts?.results?.map(item => {
          const { title, link, hostname, pubDate } = item || {}
          return <div className="w-full cursor-pointer hover:bg-blue-50 p-2 rounded-lg" key={title} onClick={() => handleClick(link)}>
            <div>
              <a className="mr-4" > {title}</a>
              <span className="text-sm opacity-60 font-light">({hostname})</span>
            </div>
            <div>
              <span className="mr-2 opacity-60 font-light text-sm">发布于：{pubDate}</span>
            </div>
          </div>
        })}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePagination('pre')} />
            </PaginationItem>
            {Array.from({ length: totalPage }).map((item, i) => {
              return <PaginationItem key={i}>
                <PaginationLink onClick={() => handlePagination(i + 1)} isActive={i + 1 === currentPage}>{i + 1}</PaginationLink>
              </PaginationItem>
            })}
            <PaginationItem>
              <PaginationNext onClick={() => handlePagination('next')} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>


      </main>
    </div >
  );
}
