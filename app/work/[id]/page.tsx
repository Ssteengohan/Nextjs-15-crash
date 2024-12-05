const page = ({params} : {params: {id: string}}) => {
    const { id } = params;
  return (
    <h1>Hello user {id}</h1>
  )
}

export default page