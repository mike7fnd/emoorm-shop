
'use client';

import { AccountPageLayout } from '@/components/layout/account-page-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"


const faqItems = [
    {
        question: "How do I place an order?",
        answer: "To place an order, browse our products, add items to your cart, and proceed to checkout. You will need to provide shipping and payment information to complete your purchase."
    },
    {
        question: "What are your shipping options?",
        answer: "We offer standard and express shipping options. Shipping fees and delivery times vary depending on your location. You can see the details at checkout."
    },
    {
        question: "How can I track my order?",
        answer: "Once your order is shipped, you will receive an email with a tracking number. You can use this number to track your order on the courier's website. You can also find tracking information in the 'My Orders' section of your account."
    },
    {
        question: "What is your return policy?",
        answer: "We accept returns within 7 days of delivery for defective or incorrect items. Please contact our support team to initiate a return process."
    }
]

export default function HelpPage() {
  return (
    <AccountPageLayout title="Help Center">
      <div className="pt-4 md:pt-0">
        <h1 className="text-xl font-bold mb-4 md:text-2xl md:mb-6">Frequently Asked Questions</h1>
        <Card>
            <CardContent className="p-4">
                 <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>{item.question}</AccordionTrigger>
                            <AccordionContent>
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
      </div>
    </AccountPageLayout>
  );
}
