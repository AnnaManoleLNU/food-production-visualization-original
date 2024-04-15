type GraphProps = {
  selectedCountry: string | null; 
}

export default function Graph({selectedCountry} : GraphProps) {
  return (
    <h1>The selected country is {selectedCountry || "none"}. Here will be a graph about it!</h1>
  )
}