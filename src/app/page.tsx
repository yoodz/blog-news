import ClientPage from './clientPage'

async function getData(page: number) {
  try {
    const data = await fetch(`https://blogapi.afunny.top/.netlify/functions/get-rss?page=${page}&page_size=20`)
    return await data.json()
  } catch (e) {
    console.log(e, 'page-8')
  } 
}

export default async function Home() {
  // 首屏服务端请求， 更新：首屏接口服务端请求太慢了，改为客户端渲染
  // const initialData = await getData(1)
  return <ClientPage />

}
export const dynamic = 'force-dynamic'
