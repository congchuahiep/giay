import SlateEditor from "./components/Editor/Editor";

function App() {
	return (
		<div className="px-12 m-auto w-full md:w-3xl">
      <Button onClick={() => console.log(getExtensions())}>Log Shortcuts</Button>
      <CollaborativeEditor />
		</div>
	);
}

// md:w-3xl
// lg:w-5xl

export default App;
