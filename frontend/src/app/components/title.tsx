type TitleProps = {
  children: string
}

export default function Title(props: TitleProps) {
  return (
    <h1 className="text-center mt-8 mb-12 text-4xl text-teal-800">{props.children}</h1>
  )
}