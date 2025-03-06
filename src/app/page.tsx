"use client"
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState({
    results: [],
    page: 1
  })

  async function getData(page: number) {
    const data = await fetch(`https://blogapi.afunny.top/.netlify/functions/get-rss?page=${page}&page_size=10`)
    const res = await data.json()
    setPosts(res)
  }

  useEffect(() => {
    getData(1)
  }, [])
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-2 row-start-2 items-center sm:items-start">
        {posts?.results?.map(item => {
          const { title, link, hostname, pubDate } = item || {}
          return <div key={title} >

            <a className="mr-4" href={link} target="__blank" >
              <span className="mr-2 opacity-60 font-light text-sm">{pubDate}</span>
              {title}</a>
            <span className="text-sm opacity-60 font-light">{hostname}</span>

          </div>
        })}
        <div onClick={() => getData(+posts.page + 1)}>更多</div>
      </main>
    </div>
  );
}
