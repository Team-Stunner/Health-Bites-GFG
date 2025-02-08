import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface Message {
    text: string;
    isBot: boolean;
    timestamp: Date;
}

const commonQuestions = [
    "How do I track my meals?",
    "How to create a meal plan?",
    "Where can I find my progress?",
    "How to use food recognition?"
];

const getResponse = (question: string): string => {
    const responses: { [key: string]: string } = {
        "How do I track my meals?": "To track your meals, go to the Tracking page and use the 's Tracker' section. You can add food items and their calories, or use our food recognition feature for automatic tracking.",
        "How to create a meal plan?": "Visit the Meal Planning page where you can generate weekly meal plans, get recipe recommendations, and create grocery lists based on your preferences and dietary requirements.",
        "Where can I find my progress?": "Your progress is visible on the Tracking page. You'll find daily progress charts, nutrition goals, and water intake tracking to help you stay on top of your health journey.",
        "How to use food recognition?": "Navigate to the Food Recognition page, click the upload button to take or select a photo of your food. Our AI will analyze the image and provide nutritional information that you can add to your daily log."
    };

    return responses[question] || "I'm sorry, I don't have specific information about that. Please try asking something else or contact our support team for more detailed assistance.";
};

export const SupportBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            text: "Hi! I'm your Health Bite assistant. How can I help you today?",
            isBot: true,
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (!inputText.trim()) return;

        const userMessage: Message = {
            text: inputText,
            isBot: false,
            timestamp: new Date()
        };

        const botResponse: Message = {
            text: getResponse(inputText),
            isBot: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage, botResponse]);
        setInputText('');
    };

    const handleQuickQuestion = (question: string) => {
        const userMessage: Message = {
            text: question,
            isBot: false,
            timestamp: new Date()
        };

        const botResponse: Message = {
            text: getResponse(question),
            isBot: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage, botResponse]);
    };

    return (
        <>
            <motion.button
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
            >
                <MessageCircle size={24} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-xl z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 border-b bg-blue-600 text-white rounded-t-lg">
                            <div className="flex items-center space-x-2">
                                <Bot className="h-5 w-5" />
                                <h3 className="font-medium text-sm">Health Bite Support</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="h-64 overflow-y-auto p-3 space-y-3">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-2 rounded-lg text-sm ${message.isBot
                                            ? 'bg-gray-100 text-gray-800'
                                            : 'bg-blue-600 text-white'
                                            }`}
                                    >
                                        {message.text}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Quick Questions */}
                        <div className="p-2 border-t border-b">
                            <p className="text-xs text-gray-600 mb-2">Common questions:</p>
                            <div className="flex flex-wrap gap-1">
                                {commonQuestions.map((question, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuickQuestion(question)}
                                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input */}
                        <div className="p-3">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your question..."
                                    className="flex-1 p-2 text-sm border rounded-lg focus:outline-none focus:border-blue-500"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSend}
                                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Send size={16} />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};