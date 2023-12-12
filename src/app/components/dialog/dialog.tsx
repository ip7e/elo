import dynamic from "next/dynamic";
import { DialogWrapperProps } from "./dialog-wrapper";

const DialogWrapper = dynamic(() => import("./dialog-wrapper"), {
  ssr: false,
});

type Props = DialogWrapperProps;

export default function Dialog(props: Props) {
  return <DialogWrapper {...props} />;
}
