import type { SVGProps } from "react"
const Sword = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 15 39" {...props}>
    <path
      className="fill-background"
      d="M13.88 12.019 12.185 1.387l-6.64 7.179-2.14 21.758 4.235 1.635 6.24-19.94Z"
    />
    <path
      className="stroke-stroke"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth=".452"
      d="M12.24 1.61c.829-2.013-1.255.717-1.86 1.43-1.53 1.81-2.96 4.038-4.686 5.584-.733 6.81-1.35 13.642-2.134 20.446m-.199 5.222c.251-1.027-.518 2.05-.736 3.086m2.784-2.268c-.54-.31-.79 2.81-.86 3.046M9.13 12.738c-.977 4.006-1.633 8.01-2.267 12.1m1.056 6.59c1.88-6.589 3.404-13.141 5.892-19.51-.143-3.174-.71-6.252-1.254-9.344M1.859 29.551c-.272.113-1.026 1.948-.932 2.093.095.145 6.869 3.747 7.08 3.723.21-.023.75-2.152.891-2.409.141-.257-6.766-3.52-7.039-3.407Z"
    />
  </svg>
)
export default Sword
