type TitleProps = {
  children: string
}

export default function TitleComponent(props: TitleProps) {
  return (
    <>
    <h1 className="text-center mt-20 mb-12 text-6xl font-black text-blue-900">{props.children}</h1>
    <p className="mb-6 text-sm text-center">Click on "Other" to display more information. Click on any food to go back to the start.<br /><strong> Note that the data may be innacurate. </strong>
    </p>
    </>
  )
}