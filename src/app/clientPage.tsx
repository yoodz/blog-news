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
      <div className="flex justify-between text-2xl font-bold text-zinc-800">Blog News
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
      <div className="text-md text-gray-500 my-4">一个基于 RSS 的 Blog News 博客项目，每天自动抓取博客文章, 点击文章跳回原作者网站。</div>
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
