import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'

const currencies = {
    USD: { name: 'USD', flag: '🇺🇸', rate: 1 },
    EUR: { name: 'EUR', flag: '🇪🇺', rate: 0.96 },
    GBP: { name: 'GBP', flag: '🇬🇧', rate: 0.80 },
    JPY: { name: 'JPY', flag: '🇯🇵', rate: 145.32 },
    CHF: { name: 'CHF', flag: '🇨🇭', rate: 0.93 },
}

const NumberAnimation = ({ value }: { value: string }) => {
    return (
        <div className="flex overflow-hidden h-8">
            {value.split('').map((digit, index) => (
                <motion.span
                    key={`${index}-${digit}`}
                    className="inline-block w-4 text-center text-2xl font-medium"
                    initial={{ y: 30 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.1, delay: index * 0.08, type: 'spring', stiffness: 130 }}
                >
                    {digit}
                </motion.span>
            ))}
        </div>
    )
}

export default function CurrencyConverter() {
    const [amount, setAmount] = useState('10')
    const [fromCurrency, setFromCurrency] = useState('USD')
    const [toCurrency, setToCurrency] = useState('EUR')
    const [showDropdown, setShowDropdown] = useState<'from' | 'to' | null>(null)
    const [convertedAmount, setConvertedAmount] = useState('0')

    useEffect(() => {
        const fromRate = currencies[fromCurrency as keyof typeof currencies].rate
        const toRate = currencies[toCurrency as keyof typeof currencies].rate
        const converted = ((parseFloat(amount) || 0) * toRate) / fromRate
        setConvertedAmount(converted.toFixed(2))
    }, [amount, fromCurrency, toCurrency])

    const handleAmountChange = (value: string, isFrom: boolean) => {
        const numValue = value.replace(/[^0-9.]/g, '')
        if (isFrom) {
            setAmount(numValue)
            const fromRate = currencies[fromCurrency as keyof typeof currencies].rate
            const toRate = currencies[toCurrency as keyof typeof currencies].rate
            const converted = ((parseFloat(numValue) || 0) * toRate) / fromRate
            setConvertedAmount(converted.toFixed(2))
        } else {
            setConvertedAmount(numValue)
            const fromRate = currencies[fromCurrency as keyof typeof currencies].rate
            const toRate = currencies[toCurrency as keyof typeof currencies].rate
            const newAmount = ((parseFloat(numValue) || 0) * fromRate) / toRate
            setAmount(newAmount.toFixed(2))
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-3xl p-6 w-[400px] shadow-xl">
                <h2 className="text-2xl font-medium text-gray-700 mb-6">Swap Currency</h2>

                <div className="space-y-4">
                    {/* From Currency */}
                    <div className="relative">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex justify-between items-center">
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={amount}
                                    onChange={(e) => handleAmountChange(e.target.value, true)}
                                    className="bg-transparent text-2xl font-medium w-24 focus:outline-none"
                                    placeholder="0"
                                />
                                <button
                                    onClick={() => setShowDropdown(showDropdown === 'from' ? null : 'from')}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm hover:shadow transition-all"
                                >
                                    <span>{currencies[fromCurrency as keyof typeof currencies].flag}</span>
                                    <span>{fromCurrency}</span>
                                    <motion.div
                                        animate={{ rotate: showDropdown === 'from' ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </motion.div>
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {showDropdown === 'from' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-10"
                                >
                                    {Object.entries(currencies).map(([code, { flag }]) => (
                                        <button
                                            key={code}
                                            onClick={() => {
                                                setFromCurrency(code)
                                                setShowDropdown(null)
                                                handleAmountChange(amount, true)
                                            }}
                                            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                                        >
                                            <span>{flag}</span>
                                            <span className="flex-1 text-left">{code}</span>
                                            {fromCurrency === code && (
                                                <Check className="w-4 h-4 text-blue-500" />
                                            )}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* To Currency */}
                    <div className="relative">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex justify-between items-center">
                                <NumberAnimation value={convertedAmount} />

                                <button
                                    onClick={() => setShowDropdown(showDropdown === 'to' ? null : 'to')}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm hover:shadow transition-all"
                                >
                                    <span>{currencies[toCurrency as keyof typeof currencies].flag}</span>
                                    <span>{toCurrency}</span>
                                    <motion.div
                                        animate={{ rotate: showDropdown === 'to' ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </motion.div>
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {showDropdown === 'to' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-10"
                                >
                                    {Object.entries(currencies).map(([code, { flag }]) => (
                                        <button
                                            key={code}
                                            onClick={() => {
                                                setToCurrency(code)
                                                setShowDropdown(null)
                                                handleAmountChange(convertedAmount, false)
                                            }}
                                            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                                        >
                                            <span>{flag}</span>
                                            <span className="flex-1 text-left">{code}</span>
                                            {toCurrency === code && (
                                                <Check className="w-4 h-4 text-blue-500" />
                                            )}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <button className="w-full mt-6 bg-gray-900 text-white rounded-xl py-4 hover:bg-gray-800 transition-colors">
                    Proceed
                </button>

                <div className="mt-4 text-center text-sm text-gray-500">
                    1 {fromCurrency} ≈ {(currencies[toCurrency as keyof typeof currencies].rate / currencies[fromCurrency as keyof typeof currencies].rate).toFixed(2)} {toCurrency}
                </div>
            </div>
        </div>
    )
}
