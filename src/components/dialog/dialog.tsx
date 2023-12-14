"use client"

import { Dialog as HeadlessDialog, Transition } from "@headlessui/react"
import { Fragment, ReactNode } from "react"

type Props = {
  isOpen: boolean
  title: ReactNode
  content: ReactNode
  footer: ReactNode
  onClose: () => void
}

export default function Dialog({
  title,
  content,
  footer,
  isOpen,
  onClose,
}: Props) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <HeadlessDialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-bg/90" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <HeadlessDialog.Panel className="w-full max-w-lg overflow-hidden text-left align-middle transition-all transform border border-white shadow-xl bg-bg rounded-2xl bg-gradient-to-b from-gray-100/10 to-gray-100/50 ">
                <div className="flex flex-col min-h-[300px] justify-around h-full py-12">
                  <HeadlessDialog.Title
                    as="h3"
                    className="text-lg font-bold text-center text-gray-900"
                  >
                    {title}
                  </HeadlessDialog.Title>
                  <div className="mt-4">{content}</div>
                </div>

                <div className="flex justify-between w-full px-6 py-4 mt-2 border-t border-t-gray-200">
                  {footer}
                </div>
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  )
}
