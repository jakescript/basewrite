import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQSection = () => {
  const faqs = [
    {
      title: 'What is base write?',
      content: `
        BaseWrite is a community driven creative writing platform on-chain.
      `
    },
    {
      title: 'How do I join?',
      content: `
        Get a disk!
      `
    }
  ]
  return (
    <div className="flex gap-[10px] flex-col items-center justify-center">
      { faqs.map(( faq, i ) => (
        <Accordion collapsible='true' type="multiple" key={i} className="w-full max-w-xl">
          <AccordionItem value={`value-${i}`}>
            <AccordionTrigger className='text-sm'>{faq.title}</AccordionTrigger>
            <AccordionContent className='text-sm'>
              {faq.content}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  )
}

export default FAQSection
