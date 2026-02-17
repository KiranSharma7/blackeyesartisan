'use client'

import { Accordion } from '@/components/retroui/Accordion'

interface Question {
  id: number
  Title: string
  Text: string
}

interface FAQAccordionProps {
  questions: Question[]
}

export default function FAQAccordion({ questions }: FAQAccordionProps) {
  if (!questions || questions.length === 0) {
    return null
  }

  return (
    <Accordion type="single" collapsible className="space-y-3">
      {questions.map((question) => (
        <Accordion.Item key={question.id} value={String(question.id)}>
          <Accordion.Trigger>
            <span className="font-medium text-ink">{question.Title}</span>
          </Accordion.Trigger>
          <Accordion.Content>
            <div
              className="text-ink/70 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: question.Text }}
            />
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}
