import ClientPage from './clientPage'

async function getData(page: number) {
  try {
    const data = await fetch(`https://blogapi.afunny.top/.netlify/functions/get-rss?page=${page}&page_size=20`, { cache: 'no-store' })
    return await data.json()
  } catch (e) {
    console.log(e, 'page-8')
  } 
}

export default async function Home() {
  // 首屏服务端请求
  const initialData = await getData(1)
  return <ClientPage initialData={initialData} />

}