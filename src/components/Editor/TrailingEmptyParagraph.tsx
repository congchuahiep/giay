import { Editor, Node } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";

/**
 * TrailingEmptyParagraph là component tạo một khoảng trống ở cuối editor.
 * Khi người dùng bấm vào khoảng trống này, component sẽ đảm bảo có một block paragraph rỗng ở cuối.
 * - Nếu block cuối cùng đã là một paragraph rỗng, chỉ cần focus vào cuối editor.
 * - Nếu không, sẽ chèn một block paragraph mới vào cuối và focus editor.
 *
 * Component này hữu ích để cung cấp vùng click ở cuối editor, giúp người dùng dễ dàng thêm nội dung mới.
 */
const TrailingEmptyParagraph = () => {
	const editor = useSlateStatic();

	const handleClick = () => {
		const lastBlock = editor.getLastBlock();
		if (
			lastBlock &&
			lastBlock.type === "paragraph" &&
			Node.string(lastBlock) === ""
		) {
			editor.select(Editor.end(editor, []));
			ReactEditor.focus(editor);
			return;
		}

		const newBlock = editor.buildBlock();
		editor.insertBlock(newBlock, { at: Editor.end(editor, []) });
		editor.select(Editor.end(editor, []));
		ReactEditor.focus(editor);
	};

	return (
		<div
			onClick={handleClick}
			className="min-h-[30dvh] flex-grow cursor-text"
		></div>
	);
};

export default TrailingEmptyParagraph;
