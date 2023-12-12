import { ButtonHTMLAttributes, HTMLAttributes, PropsWithChildren } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & PropsWithChildren<{}>;
export default function Button({ children, ...btnProps }: Props) {
  return (
    <button
      type="button"
      className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
      {...btnProps}
    >
      {children}
    </button>
  );
}
