type TitleProps = {
  children: string
}

export default function TitleComponent(props: TitleProps) {
  return (
    <h1 className="text-center mt-20 mb-12 text-6xl font-black text-blue-900">{props.children}</h1>
  )
}