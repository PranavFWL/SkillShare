"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function ImageCarousel() {
  const images = [
    { src: "/images/image 4.jpg", alt: "Get any work done", caption: "Get any work done by doing what you are good at" },
    { src: "/images/download (3).jpg", alt: "Collaborate with teams", caption: "Collaborate with teams around the world" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-full">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
          {image.caption && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 text-white p-4 rounded-lg backdrop-blur-sm text-center">
              <p className="text-2xl font-bold">{image.caption}</p>
            </div>
          )}
        </div>
      ))}
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white shadow-lg' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Check if user has completed personal information
      const hasCompletedPersonalInfo = localStorage.getItem(`personalInfo_completed_${user.id}`);
      
      if (!hasCompletedPersonalInfo) {
        router.push('/personal-info');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-1/2 w-full relative min-h-[40vh] lg:min-h-screen">
        <ImageCarousel />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20"></div>
      </div>
      
      <div className="lg:w-1/2 w-full flex flex-col justify-center items-center p-8 lg:p-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full -translate-y-36 translate-x-36"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full translate-y-48 -translate-x-48"></div>
        
        <div className="text-center relative z-10 max-w-md">
          <div className="mb-8">
            <div className="flex flex-col items-center justify-center mb-4">
              <Image
                src="/sslogo-removebg-preview.png"
                alt="Skill Share Logo"
                width={80}
                height={80}
                className="mb-4"
              />
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight whitespace-nowrap">
                Skill Share
              </h1>
            </div>
            <p className="text-xl lg:text-2xl text-gray-700 font-medium mb-2">
              Skill For Skill
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Connect, learn, and grow together in our vibrant community
            </p>
          </div>
          
          <div className="space-y-4">
            
            <div className="flex items-center justify-center space-x-8 pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">1000+</div>
                <div className="text-sm text-gray-500">Skills Shared</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">24/7</div>
                <div className="text-sm text-gray-500">Community</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <span className="relative z-10">Sign In</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </SignInButton>
                
                <SignUpButton mode="modal">
                  <button className="group px-8 py-4 bg-white text-gray-700 font-semibold rounded-full border-2 border-gray-200 hover:border-purple-300 hover:text-purple-600 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              
              <SignedIn>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-700 mb-2">Welcome back!</p>
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-12 h-12"
                        }
                      }}
                    />
                  </div>
                  <button 
                    onClick={() => window.location.href = '/profile'}
                    className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10">Go to Profile</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
