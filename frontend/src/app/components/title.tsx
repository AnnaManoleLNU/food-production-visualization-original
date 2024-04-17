type TitleProps = {
  children: string
}

export default function TitleComponent(props: TitleProps) {
  return (
    <>
    <h1 className="text-center mt-20 mb-2 text-7xl font-black text-blue-900">{props.children}</h1>
    <p className="mb-6 text-center"><em> Note that the data may be innacurate. </em>
    </p>
    </>
  )
}