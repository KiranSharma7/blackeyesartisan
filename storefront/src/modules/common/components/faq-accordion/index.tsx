'use client'

import { useState } from 'react'
import { cn } from '@lib/util/cn'

interface Question {
  id: number
  Title: string
  Text: string
}

interface FAQAccordionProps {
  questions: Question[]
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

export default function FAQAccordion({ questions }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  if (!questions || questions.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {questions.map((question, index) => (
        <div
          key={question.id}
          className="border-2 border-ink rounded-lg overflow-hidden bg-paper"
        >
          <button
            onClick={() => toggleQuestion(index)}
            className={cn(
              'w-full px-6 py-4 text-left flex items-center justify-between gap-4',
              'hover:bg-stone/30 transition-colors',
              openIndex === index && 'bg-stone/30'
            )}
            aria-expanded={openIndex === index}
          >
            <span className="font-medium text-ink">{question.Title}</span>
            <ChevronDownIcon
              className={cn(
                'w-5 h-5 text-ink transition-transform duration-200 flex-shrink-0',
                openIndex === index && 'rotate-180'
              )}
            />
          </button>
          <div
            className={cn(
              'overflow-hidden transition-all duration-200',
              openIndex === index ? 'max-h-[500px]' : 'max-h-0'
            )}
          >
            <div
              className="px-6 py-4 text-ink/70 border-t border-ink/20 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: question.Text }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
