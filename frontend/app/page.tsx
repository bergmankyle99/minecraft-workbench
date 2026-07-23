export default async function Home(){

const response = await fetch(
 "http:/backend:8000/"
)

const data = await response.json()


return (
 <main>
  <h1>
   {data.message}
  </h1>
 </main>
)

}