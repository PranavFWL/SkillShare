"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

interface CreditPackage {
  id: string;
  credits: number;
  image: string;
  price?: number;
}

const creditPackages: CreditPackage[] = [
  { id: "100", credits: 100, image: "/cr100.png", price: 100 },
  { id: "500", credits: 500, image: "/cr500.png", price: 450 },
  { id: "1000", credits: 1000, image: "/cr1000.png", price: 900 },
];

export default function BuyCreditsPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setCustomAmount(""); // Clear custom amount when selecting a package
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedPackage(null); // Clear package selection when entering custom amount
  };

  const handleBuyCredits = async () => {
    if (!user) return;

    setIsProcessing(true);
    
    let creditsToBuy = 0;
    if (selectedPackage) {
      const pkg = creditPackages.find(p => p.id === selectedPackage);
      creditsToBuy = pkg?.credits || 0;
    } else if (customAmount) {
      creditsToBuy = parseInt(customAmount);
    }

    if (creditsToBuy > 0) {
      // Here you would integrate with a payment processor
      // For now, we'll simulate the purchase
      console.log(`Purchasing ${creditsToBuy} credits for user ${user.id}`);
      
      // Simulate processing time
      setTimeout(() => {
        alert(`Successfully purchased ${creditsToBuy} credits!`);
        setIsProcessing(false);
        router.push('/dashboard');
      }, 2000);
    } else {
      setIsProcessing(false);
      alert('Please select a package or enter a valid custom amount.');
    }
  };

  const canBuyCredits = selectedPackage || (customAmount && parseInt(customAmount) > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full -translate-y-36 translate-x-36"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full translate-y-48 -translate-x-48"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header with Return Button */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.push('/')}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Return
            </button>
            
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Buy Credits
              </h1>
              <p className="text-gray-600 text-lg">
                Choose a credit package or enter a custom amount
              </p>
            </div>
            
            <div className="w-24"></div> {/* Spacer for alignment */}
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            {/* Credit Packages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {creditPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                    selectedPackage === pkg.id
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                  onClick={() => handlePackageSelect(pkg.id)}
                >
                  {selectedPackage === pkg.id && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="mb-4">
                      <Image
                        src={pkg.image}
                        alt={`${pkg.credits} Credits`}
                        width={120}
                        height={120}
                        className="mx-auto rounded-lg"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {pkg.credits} Credits
                    </h3>
                    {pkg.price && (
                      <p className="text-lg text-green-600 font-semibold">
                        ₹{pkg.price}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Amount Section */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Or Enter Custom Amount
              </h3>
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    placeholder="Enter number of credits"
                    min="1"
                    className="w-full px-4 py-3 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-black text-center"
                  />
                  {customAmount && parseInt(customAmount) > 0 && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Buy Credits Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleBuyCredits}
                disabled={!canBuyCredits || isProcessing}
                className={`px-8 py-4 font-semibold rounded-full shadow-lg transition-all duration-300 transform ${
                  canBuyCredits && !isProcessing
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-xl hover:-translate-y-1'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Buy Credits'
                )}
              </button>
            </div>

            {/* Current Credits Display */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Current Credits: <span className="font-semibold text-purple-600">1000</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}