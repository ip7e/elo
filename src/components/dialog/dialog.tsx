"use client"

import { Description, DialogPanel, DialogTitle, Dialog as HeadlessDialog } from "@headlessui/react"
import { ReactNode } from "react"

type Props = {
  title: ReactNode
  subtitle?: ReactNode
  content: ReactNode
  footer: ReactNode
  onClose: () => void
}

export default function Dialog({ title, subtitle, content, footer, onClose }: Props) {
  return (
    <HeadlessDialog as="div" className="relative z-10" onClose={onClose} open={true}>
      <div className="bg-background/90 fixed inset-0 dark:bg-black/90" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center text-center">
          <DialogPanel className="bg-background w-full max-w-lg transform overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-b text-left align-middle shadow-xl transition-all dark:border-gray-700 dark:bg-black dark:shadow-gray-800/20">
            <div className="flex h-full flex-col justify-center gap-10 py-14">
              <DialogTitle
                as="h3"
                className="text-center text-xl font-bold text-gray-900 dark:text-gray-100"
              >
                {title}
              </DialogTitle>

              {subtitle && (
                <Description as="div" className="text-center text-gray-500 dark:text-gray-600">
                  {subtitle}
                </Description>
              )}

              <div>{content}</div>
            </div>

            <div className="mt-2 flex w-full justify-between border-t border-t-gray-200 px-6 py-4 dark:border-t-gray-700">
              {footer}
            </div>
          </DialogPanel>
        </div>
      </div>
    </HeadlessDialog>
  )
}
