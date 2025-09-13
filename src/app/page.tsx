import ClientPage from './clientPage'
import { get } from '@/lib/httpUtil'

async function getData(page: number) {
  try {
    const data = await get(`/blogNewsApi/article?page=${page}&page_size=20`)
    return data
  } catch (e) {
    console.log(e, 'page-8')
  } 
}

export default async function Home() {
  // 首屏服务端请求， 更新：首屏接口服务端请求太慢了，改为客户端渲染
  const initialData = await getData(1)
  return <ClientPage initialData={initialData} />

}
// export const dynamic = 'force-dynamic'
