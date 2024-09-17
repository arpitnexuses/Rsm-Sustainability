'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RefreshCw, User, Mail, FileText, Cpu, ChevronDown, Send } from 'lucide-react'

export function AiAssistant() {
  const [inputValue, setInputValue] = useState('')
  const [chatHistory, setChatHistory] = useState([
    { role: 'system', content: 'You are a helpful AI assistant.' },
    { role: 'assistant', content: 'Hi Dear, Reader! What would you like to know?' },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [prompts, setPrompts] = useState([
    { icon: <User className="w-6 h-6" />, text: "Download Newsletter" },
    { icon: <Mail className="w-6 h-6" />, text: "Book an Appointment with RSM Team" },
    { icon: <FileText className="w-6 h-6" />, text: "Summary of Newsletter" },
    { icon: <Cpu className="w-6 h-6" />, text: "About Tax Retention" },
  ])

  const handleSubmit = async () => {
    if (inputValue.trim() === '') return;

    const newMessage = { role: 'user' as const, content: inputValue };
setChatHistory(prev => [...prev, newMessage]);
setInputValue('');
setIsLoading(true);

try {
  const lowerInput = inputValue.toLowerCase();

  // Check for predefined phrases
  if (lowerInput.includes('tax retention')) {
    const taxRetentionResponse = {
      role: 'assistant',
      content: "Tax retention refers to the practice of withholding a portion of income or payment to ensure taxes are properly collected. It is typically done by employers or businesses, who retain a portion of salaries, wages, or payments to fulfill tax obligations before the remaining amount is given to the individual or company."
    };
    setChatHistory(prev => [...prev, taxRetentionResponse]);

    if (lowerInput.includes('talk to expert') || lowerInput.includes('talk to rsm') || lowerInput.includes('book a consultancy')) {
      const expertResponse = {
        role: 'assistant',
        content: "Please refer to the above predefined prompt."
      };
      setChatHistory(prev => [...prev, expertResponse]);
    }

  } else if (lowerInput.includes('talk to expert') || lowerInput.includes('talk to rsm') || lowerInput.includes('book a consultancy')) {
    const expertResponse = {
      role: 'assistant',
      content: "Please refer to the above predefined prompt."
    };
    setChatHistory(prev => [...prev, expertResponse]);

  } else if (lowerInput.includes('learn more') || lowerInput.includes('read more')) {
    const learnMoreResponse = {
      role: 'assistant',
      content: "Please refer to the above predefined prompt."
    };
    setChatHistory(prev => [...prev, learnMoreResponse]);

  } else if (lowerInput.includes('summary of newsletter')) {
    const newsletterSummary = {
      role: 'assistant',
      content: `The newsletter discusses the importance of tax retention for Kuwaiti companies, even though they are exempt from income tax. Key points include:\n\n1. Retention Obligation: All companies in Kuwait are required to retain 5% from each payment made to any company, regardless of their location.\n\n2. Tax Clearance Certificate (TCC): Kuwaiti companies must obtain an annual TCC from the Kuwait Tax Authority, despite being exempt from income tax.\n\n3. Liability for Defaulting Foreign Companies: If a foreign company leaves Kuwait without settling tax liabilities, the Kuwait Tax Authority can collect the due payment from the Kuwaiti contract owner.\n\n4. Consequences of Non-Compliance: Failure to adhere to tax retention regulations can result in penalties.`
    };
    setChatHistory(prev => [...prev, newsletterSummary]);

  } else {
    // Fetch AI assistant response from the API if it's not a predefined question
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: [...chatHistory, newMessage] }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response');
    }

    const data = await response.json();
    setChatHistory(prev => [...prev, data]);
  }
} catch (error) {
  console.error('Error:', error);
  setChatHistory(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
} finally {
  setIsLoading(false);
}

  }


  const handlePromptClick = (prompt: string) => {
    let promptValue = '';

    switch (prompt) {
      case 'Download Newsletter':
        window.open('https://cdn-nexlink.s3.us-east-2.amazonaws.com/RSMtaxes_a7e39cc3-3633-4701-94cc-7ab05d528315.pdf', '_blank');
        return;
      case 'Book an Appointment with RSM Team':
        window.open('https://calendly.com/demo-link', '_blank'); // Replace with actual Calendly link
        return;
      case 'Summary of Newsletter':
        promptValue = 'Summary of Newsletter';
        break;
      case 'About Tax Retention':
        promptValue = 'About Tax Retention';
        break;
      default:
        promptValue = prompt;
    }

    // Set the input value and simulate double-click
    setInputValue(promptValue);

    // First submit
    setTimeout(() => handleSubmit(), 100); // Delay to ensure state update

    // Second submit (simulate double-click effect)
    setTimeout(() => handleSubmit(), 300); // Delay to simulate a double-click effect
  }

  const refreshPrompts = () => {
    setChatHistory(prev => prev.filter(message => message.role === 'system'));
  }

  return (<div className="max-w-4xl mx-auto p-6 space-y-8 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow-lg mt-6">
    {/* Header Section with Centered Logo */}
    <div className="flex flex-col items-center">
      <img 
        src="https://cdn-nexlink.s3.us-east-2.amazonaws.com/rsm-international-vector-logo_2_b9899a01-9720-4f6b-9f73-dbfe8cc8912d.jpg" 
        alt="RSM Logo" 
        className="h-14 w-auto mb-4"  
      />
      </div>
      <div className="text">
        <h1 className="text-4xl font-bold text-[#000000]">
          Hi Dear, <span className="text-[#3F9C35]">Reader</span>
        </h1>
        <h2 className="text-3xl font-semibold text-[#3F9C35]">What would you like to know?</h2>
        <p className="text-gray-500 dark:text-gray-300">Use one of the most common prompts below or use your own to begin</p>
      </div>
    
  
    {/* Prompt buttons */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {prompts.length > 0 ? (
        prompts.map((prompt, index) => (
          <Card key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer" onClick={() => handlePromptClick(prompt.text)}>
            <CardContent className="flex items-center p-4 space-x-4">
              <div className="text-[#3F9C35]">{prompt.icon}</div>
              <p className="text-sm dark:text-gray-200">{prompt.text}</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500 dark:text-gray-300">No prompts available. Click "Refresh" to load prompts.</p>
      )}
    </div>
  
    {/* Refresh button */}
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="text-gray-500 dark:text-gray-300" onClick={refreshPrompts}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh Prompts
      </Button>
    </div>
  
    {/* Chat history */}
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {chatHistory.map((message, index) => (
        message.role !== 'system' && (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-[#3F9C35] text-white' 
                : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-800'
            }`}>
              {message.content}
            </div>
          </div>
        )
      ))}
    </div>
  
    {/* Input field and submit button */}
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="relative">
      <Input
        type="text"
        placeholder="Ask whatever you want..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="pr-32 pl-4 py-6 rounded-lg bg-gray-100 dark:bg-black-700 dark:text-black-200 text-[#000000]"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
        <span className="text-sm text-gray-400 dark:text-gray-300">{inputValue.length}/1000</span>
        <Button type="submit" size="sm" className="bg-[#3F9C35] text-white hover:bg-[#3F9C35] hover:opacity-80" disabled={isLoading}>
          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  
    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-300">
      <span>All Web</span>
      <ChevronDown className="h-4 w-4" />
    </div>
  </div>
  )  
}
