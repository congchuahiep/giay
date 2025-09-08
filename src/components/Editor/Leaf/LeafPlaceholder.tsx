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
        className="absolute text-stone-900 dark:text-stone-100 select-none opacity-25 pointer-events-none"
      >
        {placeholder}
      </span>
    )}
    {children}
  </>
);

export default LeafPlaceholder;
