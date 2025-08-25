import SlateEditor from "./components/Editor/Editor";
import EditorSidebar from "./components/Editor/Sidebar/EditorSidebar";

function App() {
	return (
		<div className="flex h-screen bg-background">
			<EditorSidebar />
			<div className="flex-1 overflow-auto">
				<div className="p-13 m-auto w-full md:w-3xl">
					<SlateEditor />
				</div>
			</div>
		</div>
	);
}

// md:w-3xl
// lg:w-5xl

export default App;