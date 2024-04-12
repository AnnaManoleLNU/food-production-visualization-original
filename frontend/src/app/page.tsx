import Title from "./components/Title"
import DataVisualizer from "./components/data-visualizer"
import Dropdown from "./components/Dropdown"

export default function Home() {
  return (
    <main>
      <Title>Global Food Production in 2018</Title>
      <Dropdown />
      <DataVisualizer />
    </main>
  )
}
