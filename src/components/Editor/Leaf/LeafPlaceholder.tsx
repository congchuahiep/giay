// Đây chỉ là helper
const LeafPlaceholder = ({
  isEmpty,
  placeholder,
  children,
}: {
  isEmpty: boolean;
  placeholder: string;
  children?: React.ReactNode;
}) => (
  <>
    {isEmpty && (
      <span
        contentEditable={false}
        className="text-stone-900"
        style={{
          position: "absolute",
          pointerEvents: "none",
          opacity: 0.25,
          userSelect: "none",
        }}
      >
        {placeholder}
      </span>
    )}
    {children}
  </>
);

export default LeafPlaceholder;
