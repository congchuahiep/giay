// import type { NumberedListType } from "@/features/editor/types/block";
// import { useMemo } from "react";
// import { Editor, Element, Node, Path } from "slate";
// import type { RenderElementProps } from "slate-react";
// import { useElement, useSlateStatic, ReactEditor, useSlate } from "slate-react";

// export default function NumberedListBlock(props: RenderElementProps) {
//   const editor = useSlate();
//   const element = useElement() as NumberedListType;

//   const calculateIndex = () => {
//     try {
//       // Nếu element có startIndex, đây là numbered list cha
//       if (element.startIndex !== undefined) {
//         return element.startIndex;
//       }

//       // Tìm path của element hiện tại
//       const currentPath = ReactEditor.findPath(editor, element);
//       const previousPath = Path.previous(currentPath);

//       try {
//         const previousNode = Node.get(editor, previousPath);

//         if (
//           Element.isElement(previousNode) &&
//           previousNode.type === "numberedList"
//         ) {
//           const previousElement = previousNode as NumberedListType;

//           if (previousElement.startIndex !== undefined) {
//             return previousElement.startIndex + 1;
//           }

//           return calculateIndexRecursively(editor, previousPath) + 1;
//         } else {
//           return 1;
//         }
//       } catch (error) {
//         return 1;
//       }
//     } catch (error) {
//       return 1;
//     }
//   };

//   const index = calculateIndex();

//   return (
//     <div
//       className="flex items-center py-1 numbered-list-item"
//       {...props.attributes}
//     >
//       <div
//         className="text-sm text-center font-medium text-gray-600 min-w-8 select-none"
//         contentEditable={false}
//       >
//         {index}.
//       </div>
//       <div className="flex-1 min-w-0">{props.children}</div>
//     </div>
//   );
// }

// function calculateIndexRecursively(editor: Editor, elementPath: Path): number {
//   try {
//     const element = Node.get(editor, elementPath) as NumberedListType;

//     // Nếu element có startedIndex, trả về giá trị đó
//     if (element.startIndex !== undefined) {
//       return element.startIndex;
//     }

//     // Tìm block trước đó
//     const previousPath = Path.previous(elementPath);
//     const previousNode = Node.get(editor, previousPath);

//     // Nếu block trước là NumberedList, tiếp tục đệ quy
//     if (
//       Element.isElement(previousNode) &&
//       previousNode.type === "numberedList"
//     ) {
//       return calculateIndexRecursively(editor, previousPath) + 1;
//     } else {
//       // Nếu block trước không phải NumberedList, bắt đầu từ 1
//       return 1;
//     }
//   } catch (error) {
//     // Nếu không tìm thấy block trước, bắt đầu từ 1
//     return 1;
//   }
// }
