"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface JobListing {
  id: number;
  title: string;
  description: string;
  credits: number;
  postedBy: string;
  location?: string;
  experience?: number;
  experienceUnit?: 'Years' | 'Months';
}

interface ChatUser {
  id: number;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  message: string;
  timestamp: string;
  isCurrentUser: boolean;
}

const jobListings: JobListing[] = [
  {
    id: 1,
    title: "Frontend React Developer",
    description: "We are looking for an experienced React developer to join our team and help build cutting-edge web applications. The ideal candidate should have strong knowledge of React, TypeScript, and modern frontend development practices. You will be responsible for creating responsive user interfaces, implementing state management solutions, and collaborating with our design and backend teams. Experience with Next.js, Tailwind CSS, and testing frameworks would be a plus. This is a remote-friendly position with flexible working hours and opportunities for professional growth.",
    credits: 750,
    postedBy: "Sarah Johnson",
    location: "Remote",
    experience: 3,
    experienceUnit: "Years"
  },
  {
    id: 2,
    title: "UI/UX Designer",
    description: "Join our creative team as a UI/UX Designer where you'll be responsible for creating intuitive and visually appealing user experiences. We need someone who can translate business requirements into user-friendly designs, conduct user research, create wireframes and prototypes, and work closely with developers to ensure pixel-perfect implementation. Proficiency in Figma, Adobe Creative Suite, and understanding of design systems is essential. You should have a strong portfolio showcasing your design process and problem-solving skills.",
    credits: 650,
    postedBy: "Michael Chen",
    location: "Mumbai",
    experience: 2,
    experienceUnit: "Years"
  },
  {
    id: 3,
    title: "Python Backend Developer",
    description: "We're seeking a skilled Python backend developer to build and maintain our server-side applications. You'll work with Django or FastAPI frameworks, design RESTful APIs, manage databases, and ensure high performance and security of our applications. Experience with cloud platforms like AWS or Google Cloud, containerization with Docker, and knowledge of microservices architecture would be valuable. You'll collaborate with frontend developers and participate in code reviews and system design discussions.",
    credits: 800,
    postedBy: "David Rodriguez",
    location: "Bangalore",
    experience: 4,
    experienceUnit: "Years"
  },
  {
    id: 4,
    title: "Mobile App Developer",
    description: "Looking for a talented mobile app developer to create cross-platform applications using React Native or Flutter. You should have experience with mobile app development lifecycle, app store submission processes, and integrating with various APIs and third-party services. Knowledge of native iOS and Android development would be beneficial. You'll work on creating smooth user experiences, implementing push notifications, and ensuring app performance across different devices and screen sizes.",
    credits: 700,
    postedBy: "Emily Watson",
    location: "Delhi",
    experience: 18,
    experienceUnit: "Months"
  },
  {
    id: 5,
    title: "Data Scientist",
    description: "Join our data team as a Data Scientist to help derive insights from complex datasets and build machine learning models. You should be proficient in Python, R, or similar languages, have experience with libraries like pandas, scikit-learn, and TensorFlow, and be comfortable working with SQL databases. You'll be responsible for data cleaning, exploratory data analysis, model development, and presenting findings to stakeholders. Experience with cloud ML platforms and big data tools would be advantageous.",
    credits: 900,
    postedBy: "Alex Thompson",
    location: "Hyderabad",
    experience: 5,
    experienceUnit: "Years"
  },
  {
    id: 6,
    title: "DevOps Engineer",
    description: "We need a DevOps Engineer to help streamline our development and deployment processes. You'll work with CI/CD pipelines, container orchestration with Kubernetes, infrastructure as code using Terraform or CloudFormation, and monitoring solutions. Experience with cloud platforms, automated testing, and security best practices is crucial. You'll collaborate with development teams to improve deployment efficiency and system reliability while maintaining high security standards.",
    credits: 850,
    postedBy: "Jessica Lee",
    location: "Pune",
    experience: 6,
    experienceUnit: "Years"
  },
  {
    id: 7,
    title: "Graphic Designer",
    description: "Creative Graphic Designer needed to produce high-quality visual content for our marketing campaigns and brand materials. You should be proficient in Adobe Creative Suite, have a strong understanding of brand guidelines, and be able to create designs for both digital and print media. Experience with motion graphics, social media content creation, and web design would be a plus. You'll work closely with the marketing team to develop compelling visual stories that engage our audience.",
    credits: 500,
    postedBy: "Ryan Miller",
    location: "Chennai",
    experience: 8,
    experienceUnit: "Months"
  },
  {
    id: 8,
    title: "Content Writer",
    description: "We're looking for a skilled Content Writer to create engaging and SEO-optimized content for our website, blog, and marketing materials. You should have excellent writing skills, understand content strategy, and be able to adapt your writing style for different audiences and platforms. Experience with content management systems, basic SEO knowledge, and ability to research and write about technical topics would be valuable. You'll collaborate with the marketing team to develop content that drives engagement and conversions.",
    credits: 400,
    postedBy: "Lisa Anderson",
    location: "Kolkata",
    experience: 1,
    experienceUnit: "Years"
  },
  {
    id: 9,
    title: "Project Manager",
    description: "Experienced Project Manager needed to oversee multiple development projects and ensure timely delivery. You should have strong organizational skills, experience with project management tools like Jira or Asana, and be comfortable working with cross-functional teams. Knowledge of Agile methodologies, risk management, and stakeholder communication is essential. You'll be responsible for project planning, resource allocation, progress tracking, and ensuring projects meet quality standards and deadlines.",
    credits: 600,
    postedBy: "Kevin Brown",
    location: "Ahmedabad",
    experience: 7,
    experienceUnit: "Years"
  },
  {
    id: 10,
    title: "Cybersecurity Specialist",
    description: "Join our security team as a Cybersecurity Specialist to help protect our systems and data from threats. You should have knowledge of security frameworks, penetration testing, vulnerability assessment, and incident response procedures. Experience with security tools, network security, and compliance standards like GDPR or HIPAA would be beneficial. You'll conduct security audits, develop security policies, and work with teams to implement security best practices across the organization.",
    credits: 950,
    postedBy: "Amanda Davis",
    location: "Remote",
    experience: 8,
    experienceUnit: "Years"
  }
];

const mockChatUsers: ChatUser[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    lastMessage: "Thanks for your proposal! When can we start?",
    timestamp: "2 min ago",
    unreadCount: 2,
    isOnline: true
  },
  {
    id: 2,
    name: "Michael Chen",
    lastMessage: "The design looks great. Let's discuss the timeline.",
    timestamp: "1 hour ago",
    unreadCount: 0,
    isOnline: true
  },
  {
    id: 3,
    name: "David Rodriguez",
    lastMessage: "Could you share your portfolio?",
    timestamp: "3 hours ago",
    unreadCount: 1,
    isOnline: false
  },
  {
    id: 4,
    name: "Emily Watson",
    lastMessage: "Perfect! I'll send you the requirements.",
    timestamp: "1 day ago",
    unreadCount: 0,
    isOnline: false
  },
  {
    id: 5,
    name: "Alex Thompson",
    lastMessage: "When would be a good time to call?",
    timestamp: "2 days ago",
    unreadCount: 3,
    isOnline: true
  }
];

const mockChatMessages: { [key: number]: ChatMessage[] } = {
  1: [
    {
      id: 1,
      senderId: 1,
      senderName: "Sarah Johnson",
      message: "Hi! I saw your React development skills and I'm interested in working with you.",
      timestamp: "10:30 AM",
      isCurrentUser: false
    },
    {
      id: 2,
      senderId: 0,
      senderName: "You",
      message: "Hello Sarah! I'd be happy to help with your project. Could you tell me more about what you're looking for?",
      timestamp: "10:35 AM",
      isCurrentUser: true
    },
    {
      id: 3,
      senderId: 1,
      senderName: "Sarah Johnson",
      message: "I need a frontend developer for an e-commerce platform. The project involves React, TypeScript, and integration with our REST API.",
      timestamp: "10:40 AM",
      isCurrentUser: false
    },
    {
      id: 4,
      senderId: 0,
      senderName: "You",
      message: "That sounds perfect! I have extensive experience with React and TypeScript. I've built several e-commerce platforms before. Would you like to see some examples?",
      timestamp: "10:42 AM",
      isCurrentUser: true
    },
    {
      id: 5,
      senderId: 1,
      senderName: "Sarah Johnson",
      message: "Thanks for your proposal! When can we start?",
      timestamp: "11:15 AM",
      isCurrentUser: false
    }
  ],
  2: [
    {
      id: 1,
      senderId: 2,
      senderName: "Michael Chen",
      message: "Hello! I'm looking for a UI/UX designer for my startup.",
      timestamp: "Yesterday 2:30 PM",
      isCurrentUser: false
    },
    {
      id: 2,
      senderId: 0,
      senderName: "You",
      message: "Hi Michael! I'd love to learn more about your project.",
      timestamp: "Yesterday 2:45 PM",
      isCurrentUser: true
    },
    {
      id: 3,
      senderId: 2,
      senderName: "Michael Chen",
      message: "The design looks great. Let's discuss the timeline.",
      timestamp: "Today 9:00 AM",
      isCurrentUser: false
    }
  ]
};

function JobCard({ job, onMessageClick }: { job: JobListing; onMessageClick: (jobPoster: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const getPreviewText = (text: string) => {
    const words = text.split(' ');
    if (words.length <= 30) return text;
    return words.slice(0, 30).join(' ') + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => console.log(`Navigate to ${job.postedBy}'s profile`)}
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            {job.postedBy}
          </button>
          <button 
            onClick={() => console.log(`Navigate to ${job.postedBy}'s profile`)}
            className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-200 flex items-center justify-center overflow-hidden"
          >
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="text-gray-600 leading-relaxed mb-4">
        {isExpanded ? job.description : getPreviewText(job.description)}
        
        {job.description.split(' ').length > 30 && (
          <button
            onClick={toggleExpansion}
            className="ml-2 text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold text-green-600">
          Offer {job.credits} credits
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 flex space-x-4">
            {job.location && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </span>
            )}
            {job.experience && job.experienceUnit && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {job.experience} {job.experienceUnit}
              </span>
            )}
          </div>
          <button
            onClick={() => onMessageClick(job.postedBy)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 transition-colors duration-200 font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
            <span>Message</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatWindow({ user, messages, onBack, onSendMessage }: {
  user: ChatUser;
  messages: ChatMessage[];
  onBack: () => void;
  onSendMessage: (message: string) => void;
}) {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-white">
        <button 
          onClick={onBack}
          className="mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            {user.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-black">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.isOnline ? 'Online' : 'Offline'}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isCurrentUser
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-gray-100 text-black'
              }`}
            >
              <p className="text-sm">{message.message}</p>
              <p className={`text-xs mt-1 ${
                message.isCurrentUser ? 'text-purple-100' : 'text-gray-600'
              }`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
          />
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatSidebar({ isOpen, onClose, selectedUserName }: { isOpen: boolean; onClose: () => void; selectedUserName?: string }) {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [chatMessages, setChatMessages] = useState(mockChatMessages);

  // Auto-select user when selectedUserName is provided
  useEffect(() => {
    if (selectedUserName && isOpen) {
      const userToSelect = mockChatUsers.find(user => user.name === selectedUserName);
      if (userToSelect) {
        setSelectedUser(userToSelect);
      }
    }
  }, [selectedUserName, isOpen]);

  const handleUserSelect = (user: ChatUser) => {
    setSelectedUser(user);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  const handleSendMessage = (message: string) => {
    if (selectedUser) {
      const newMessage: ChatMessage = {
        id: Date.now(),
        senderId: 0,
        senderName: "You",
        message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true
      };

      setChatMessages(prev => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage]
      }));
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedUser ? (
          <ChatWindow
            user={selectedUser}
            messages={chatMessages[selectedUser.id] || []}
            onBack={handleBackToList}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-bold text-black">Messages</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {mockChatUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors duration-200"
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {user.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 ml-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-black">{user.name}</h3>
                      <span className="text-xs text-gray-600">{user.timestamp}</span>
                    </div>
                    <p className="text-sm text-black truncate">{user.lastMessage}</p>
                  </div>
                  
                  {user.unreadCount > 0 && (
                    <div className="ml-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {user.unreadCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

interface PostRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (jobData: Omit<JobListing, 'id' | 'postedBy'>) => void;
  userCredits: number;
}

function PostRequirementModal({ isOpen, onClose, onPost, userCredits }: PostRequirementModalProps) {
  const [workTitle, setWorkTitle] = useState<string[]>([]);
  const [customTitle, setCustomTitle] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [location, setLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [experience, setExperience] = useState<number | ''>('');
  const [experienceUnit, setExperienceUnit] = useState<'Years' | 'Months'>('Years');
  const [credits, setCredits] = useState<number | ''>('');
  const [isTitleDropdownOpen, setIsTitleDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const titleDropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const [savedJobTitles, setSavedJobTitles] = useState<string[]>([
    'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer',
    'UI/UX Designer', 'Graphic Designer', 'Data Scientist', 'DevOps Engineer',
    'Project Manager', 'Content Writer', 'Digital Marketing Specialist', 'SEO Specialist',
    'React Developer', 'Node.js Developer', 'Python Developer', 'Java Developer',
    'Software Engineer', 'Web Developer', 'WordPress Developer', 'E-commerce Developer'
  ]);
  const [savedLocations] = useState<string[]>([
    'Remote', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune',
    'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
    'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad',
    'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali',
    'Vasai-Virar', 'Varanasi', 'Srinagar', 'Dhanbad', 'Jodhpur', 'Amritsar', 'Raipur',
    'Allahabad', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Madurai', 'Guwahati',
    'Chandigarh', 'Hubli-Dharwad', 'Mysore', 'Tiruchirappalli', 'Bareilly', 'Aligarh',
    'Tiruppur', 'Gurgaon', 'Moradabad', 'Jalandhar', 'Bhubaneswar', 'Salem', 'Mira-Bhayandar',
    'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner', 'Amravati',
    'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar',
    'Dehradun', 'Durgapur', 'Asansol', 'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer',
    'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar',
    'Jammu', 'Sangli-Miraj & Kupwad', 'Mangalore', 'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli',
    'Malegaon', 'Gaya', 'Jalgaon', 'Udaipur', 'Maheshtala'
  ]);

  const wordCount = workDescription.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isDescriptionValid = wordCount >= 5;
  const isCreditsValid = typeof credits === 'number' && credits <= userCredits;
  
  const canPost = workTitle.length > 0 && isDescriptionValid && location && 
                  experience !== '' && credits !== '' && isCreditsValid;

  const handleTitleSelect = (title: string) => {
    if (!workTitle.includes(title)) {
      setWorkTitle([...workTitle, title]);
    }
    setCustomTitle('');
  };

  const handleTitleRemove = (title: string) => {
    setWorkTitle(workTitle.filter(t => t !== title));
  };

  const handleAddCustomTitle = () => {
    if (customTitle.trim() && !savedJobTitles.includes(customTitle.trim())) {
      setSavedJobTitles([...savedJobTitles, customTitle.trim()]);
      handleTitleSelect(customTitle.trim());
      setCustomTitle('');
    }
  };

  const handleLocationSelect = (loc: string) => {
    setLocation(loc);
    setCustomLocation('');
    setIsLocationDropdownOpen(false);
  };

  const handlePost = () => {
    if (canPost) {
      const jobData = {
        title: workTitle.join(', '),
        description: workDescription,
        location: location,
        experience: Number(experience),
        experienceUnit: experienceUnit,
        credits: Number(credits)
      };
      onPost(jobData);
      // Reset form
      setWorkTitle([]);
      setWorkDescription('');
      setLocation('');
      setExperience('');
      setCredits('');
      onClose();
    }
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (titleDropdownRef.current && !titleDropdownRef.current.contains(event.target as Node)) {
        setIsTitleDropdownOpen(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Post Requirement</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Work Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Title</label>
              <div className="relative" ref={titleDropdownRef}>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  onFocus={() => setIsTitleDropdownOpen(true)}
                  placeholder="Search or type job titles..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {isTitleDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {customTitle && !savedJobTitles.includes(customTitle) && (
                      <button
                        onClick={handleAddCustomTitle}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 text-blue-600 border-b"
                      >
                        Add &ldquo;{customTitle}&rdquo; to list
                      </button>
                    )}
                    {savedJobTitles
                      .filter(title => title.toLowerCase().includes(customTitle.toLowerCase()))
                      .map((title) => (
                        <button
                          key={title}
                          onClick={() => handleTitleSelect(title)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-black"
                        >
                          {title}
                        </button>
                      ))}
                  </div>
                )}
              </div>
              {workTitle.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {workTitle.map((title) => (
                    <span key={title} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                      {title}
                      <button
                        onClick={() => handleTitleRemove(title)}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Work Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Work Description</label>
                <span className="text-sm text-gray-400">Write detailed description about work requirement</span>
              </div>
              <textarea
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                placeholder="Describe your work requirement in detail (minimum 5 words)..."
                rows={6}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
              />
              <div className="flex justify-between items-center mt-1">
                <span className={`text-sm ${isDescriptionValid ? 'text-green-600' : 'text-red-600'}`}>
                  {wordCount}/5 words minimum
                </span>
                {!isDescriptionValid && wordCount > 0 && (
                  <span className="text-sm text-red-600">Minimum 5 words required</span>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative" ref={locationDropdownRef}>
                <input
                  type="text"
                  value={customLocation || location}
                  onChange={(e) => {
                    setCustomLocation(e.target.value);
                    setLocation('');
                  }}
                  onFocus={() => setIsLocationDropdownOpen(true)}
                  placeholder="Search locations..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {isLocationDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {customLocation && !savedLocations.includes(customLocation) && (
                      <button
                        onClick={() => {
                          setLocation(customLocation);
                          setCustomLocation('');
                          setIsLocationDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 text-blue-600 border-b"
                      >
                        Add &ldquo;{customLocation}&rdquo;
                      </button>
                    )}
                    {savedLocations
                      .filter(loc => loc.toLowerCase().includes((customLocation || location).toLowerCase()))
                      .map((loc) => (
                        <button
                          key={loc}
                          onClick={() => handleLocationSelect(loc)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-black"
                        >
                          {loc}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value ? Number(e.target.value) : '')}
                  placeholder="0"
                  min="0"
                  className="w-24 border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => setExperienceUnit(experienceUnit === 'Years' ? 'Months' : 'Years')}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {experienceUnit}
                </button>
              </div>
            </div>

            {/* Credits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value ? Number(e.target.value) : '')}
                  placeholder="0"
                  min="1"
                  className={`flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    !isCreditsValid && credits !== '' ? 'border-red-500 text-red-600' : 'border-gray-300 text-black'
                  }`}
                />
                {!isCreditsValid && credits !== '' && (
                  <span className="text-red-600 text-sm">Insufficient credits</span>
                )}
              </div>
              <div className="mt-1 text-sm text-gray-600">
                Available credits: {userCredits}
              </div>
            </div>

            {/* Post Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handlePost}
                disabled={!canPost}
                className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                  canPost
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Post Requirement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({ onChatOpen }: { onChatOpen: () => void }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const userCredits = 1612;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image
            src="/sslogo-removebg-preview.png"
            alt="Skill Share Logo"
            width={40}
            height={40}
          />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Skill Share
          </h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-lg font-semibold text-gray-700">
            Credits {userCredits}
          </div>
          
          <button 
            onClick={onChatOpen}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 relative">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5m0 0V5a6 6 0 00-6-6v0a6 6 0 00-6 6v7l-5 5h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-800">John Doe</p>
                  <p className="text-sm text-gray-600">john.doe@example.com</p>
                </div>
                
                <div className="py-1">
                  <button 
                    onClick={() => window.location.href = '/buy-credits'}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Buy Credits
                  </button>
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    Settings
                  </button>
                  <SignOutButton redirectUrl="/">
                    <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200">
                      Log out
                    </button>
                  </SignOutButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [creditOperator, setCreditOperator] = useState('>');
  const [creditValue, setCreditValue] = useState<string>('');
  const [isFieldDropdownOpen, setIsFieldDropdownOpen] = useState(false);
  const [allJobs, setAllJobs] = useState<JobListing[]>(jobListings);
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>(jobListings);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedChatUser, setSelectedChatUser] = useState<string>('');

  // Guard to ensure user has completed personal info
  useEffect(() => {
    if (isLoaded && user) {
      const hasCompletedPersonalInfo = localStorage.getItem(`personalInfo_completed_${user.id}`);
      
      if (!hasCompletedPersonalInfo) {
        router.push('/personal-info');
        return;
      }
    }
  }, [isLoaded, user, router]);

  // Show loading while checking user status
  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if personal info is completed - if not, return loading (will redirect)
  const hasCompletedPersonalInfo = localStorage.getItem(`personalInfo_completed_${user.id}`);
  if (!hasCompletedPersonalInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  const availableFields = [
    'Frontend Development',
    'Backend Development',
    'Full Stack Development',
    'Mobile Development',
    'UI/UX Design',
    'Graphic Design',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'Cloud Computing',
    'Cybersecurity',
    'Project Management',
    'Content Writing',
    'Digital Marketing',
    'SEO',
    'React',
    'Angular',
    'Vue.js',
    'Node.js',
    'Python',
    'Java',
    'JavaScript',
    'TypeScript',
    'PHP',
    'Ruby',
    'Go',
    'Rust',
    'C++',
    'C#',
    'Swift',
    'Kotlin',
    'Flutter',
    'React Native',
    'iOS Development',
    'Android Development',
    'WordPress',
    'Shopify',
    'E-commerce',
    'Database Design',
    'MySQL',
    'PostgreSQL',
    'MongoDB',
    'Firebase',
    'AWS',
    'Azure',
    'Google Cloud',
    'Docker',
    'Kubernetes',
    'Git',
    'CI/CD',
    'Testing',
    'Quality Assurance',
    'Blockchain',
    'Web3',
    'AI/ML',
    'NLP',
    'Computer Vision',
    'Game Development',
    'Unity',
    'Unreal Engine',
    'Video Editing',
    'Animation',
    '3D Modeling',
    'Photoshop',
    'Illustrator',
    'Figma',
    'Sketch',
    'Prototyping',
    'Wireframing',
    'User Research',
    'Analytics',
    'Business Intelligence',
    'Excel',
    'Power BI',
    'Tableau',
    'Sales',
    'Customer Support',
    'Virtual Assistant',
    'Translation',
    'Voice Over',
    'Photography',
    'Social Media Management',
    'Email Marketing',
    'PPC Advertising',
    'Affiliate Marketing',
    'Copywriting',
    'Technical Writing',
    'Blog Writing',
    'Proofreading',
    'Legal Writing',
    'Accounting',
    'Bookkeeping',
    'Financial Analysis',
    'Consulting',
    'Training',
    'Tutoring',
    'Music Production',
    'Podcast Editing',
    'Audio Engineering'
  ];

  const toggleFieldSelection = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const applyFilters = () => {
    let filtered = allJobs;

    // Apply field filter
    if (selectedFields.length > 0) {
      filtered = filtered.filter(job => 
        selectedFields.some(field => 
          job.title.toLowerCase().includes(field.toLowerCase()) ||
          job.description.toLowerCase().includes(field.toLowerCase())
        )
      );
    }

    // Apply credits filter
    if (creditValue) {
      const creditNum = parseInt(creditValue);
      if (!isNaN(creditNum)) {
        filtered = filtered.filter(job => 
          creditOperator === '>' ? job.credits > creditNum : job.credits < creditNum
        );
      }
    }

    setFilteredJobs(filtered);
  };

  const clearFilters = () => {
    setSelectedFields([]);
    setCreditValue('');
    setFilteredJobs(allJobs);
  };

  const handlePostJob = (jobData: Omit<JobListing, 'id' | 'postedBy'>) => {
    const newJob: JobListing = {
      id: Math.max(...allJobs.map(j => j.id)) + 1,
      ...jobData,
      postedBy: "John Doe" // This should come from user context in a real app
    };
    
    const updatedJobs = [newJob, ...allJobs];
    setAllJobs(updatedJobs);
    
    // Apply current filters to the updated job list
    let filtered = updatedJobs;
    if (selectedFields.length > 0) {
      filtered = filtered.filter(job => 
        selectedFields.some(field => 
          job.title.toLowerCase().includes(field.toLowerCase()) ||
          job.description.toLowerCase().includes(field.toLowerCase())
        )
      );
    }
    if (creditValue) {
      const creditNum = parseInt(creditValue);
      if (!isNaN(creditNum)) {
        filtered = filtered.filter(job => 
          creditOperator === '>' ? job.credits > creditNum : job.credits < creditNum
        );
      }
    }
    setFilteredJobs(filtered);
  };

  const handleMessageClick = (jobPosterName: string) => {
    setSelectedChatUser(jobPosterName);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      <Header onChatOpen={() => setIsChatOpen(true)} />
      <ChatSidebar 
        isOpen={isChatOpen} 
        onClose={() => {
          setIsChatOpen(false);
          setSelectedChatUser('');
        }} 
        selectedUserName={selectedChatUser}
      />
      <PostRequirementModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
        onPost={handlePostJob}
        userCredits={1612}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Filter Section */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Filters</h3>
              
              {/* Field Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsFieldDropdownOpen(!isFieldDropdownOpen)}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                  >
                    {selectedFields.length === 0 
                      ? 'Select fields...' 
                      : `${selectedFields.length} field${selectedFields.length > 1 ? 's' : ''} selected`
                    }
                    <svg className="absolute right-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isFieldDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {availableFields.map((field) => (
                        <label key={field} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFields.includes(field)}
                            onChange={() => toggleFieldSelection(field)}
                            className="mr-2 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-black">{field}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                
                {selectedFields.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedFields.map((field) => (
                      <span key={field} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                        {field}
                        <button
                          onClick={() => toggleFieldSelection(field)}
                          className="ml-1 text-purple-600 hover:text-purple-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Credits Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credits Range
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCreditOperator(creditOperator === '>' ? '<' : '>')}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
{creditOperator === '>' ? 'Greater than' : 'Less than'}
                  </button>
                  <input
                    type="number"
                    value={creditValue}
                    onChange={(e) => setCreditValue(e.target.value)}
                    placeholder="Enter amount"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={applyFilters}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-blue-700 transition-colors duration-200 font-medium"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Job Listings */}
          <div className="flex-1">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Available Opportunities</h2>
              <p className="text-gray-600">
                Discover and apply for exciting projects that match your skills
                {filteredJobs.length !== allJobs.length && (
                  <span className="ml-2 text-purple-600 font-medium">
                    ({filteredJobs.length} of {allJobs.length} jobs shown)
                  </span>
                )}
              </p>
            </div>
            
            <div className="grid gap-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} onMessageClick={handleMessageClick} />
                ))
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 8h6m6-8a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => setIsPostModalOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative group transition-all duration-300 ease-in-out transform ${
            isHovered 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-full shadow-lg hover:shadow-xl' 
              : 'bg-gradient-to-r from-purple-600 to-blue-600 w-16 h-16 rounded-full shadow-lg hover:shadow-xl'
          }`}
        >
          <div className={`flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'space-x-2' : ''
          }`}>
            <svg 
              className={`text-white transition-all duration-300 ${
                isHovered ? 'w-7 h-7' : 'w-8 h-8'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {isHovered && (
              <span className="text-white font-medium whitespace-nowrap">
                Post a requirement
              </span>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}