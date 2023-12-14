import { ButtonHTMLAttributes, HTMLAttributes, PropsWithChildren } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren<{
    secondary?: boolean;
  }>;

export default function Button({ children, secondary, ...btnProps }: Props) {
  const { disabled } = btnProps;

  const color = secondary
    ? // secondary
      "text-gray-900 ring-gray-300 hover:text-gray-600"
    : // primary
      "shadow-sm ring-inset ring-1 bg-white text-gray-900 ring-gray-300 hover:bg-gray-50 hover:text-gray-600";

  return (
    <button
      type="button"
      className={`inline-flex justify-center px-3 py-2 mt-3 text-sm font-semibold rounded-md sm:mt-0 sm:w-auto
        ${color} 
        ${disabled ? " opacity-50 cursor-default" : ""}
        `}
      {...btnProps}
    >
      {children}
    </button>
  );
}
