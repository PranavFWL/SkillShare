"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  qualification: string;
  skills: string[];
  city: string;
  country: string;
}

const qualifications = [
  "PhD in Mathematics", "PhD in Physics", "PhD in Chemistry", "PhD in Biology", "PhD in Computer Science",
  "PhD in Engineering", "PhD in Medicine", "PhD in Economics", "PhD in Psychology", "PhD in Literature",
  "Master's in Mathematics", "Master's in Physics", "Master's in Chemistry", "Master's in Biology",
  "Master's in Computer Science", "Master's in Engineering", "Master's in Business Administration (MBA)",
  "Master's in Economics", "Master's in Psychology", "Master's in Literature", "Master's in Education",
  "Bachelor's in Mathematics", "Bachelor's in Physics", "Bachelor's in Chemistry", "Bachelor's in Biology",
  "Bachelor's in Computer Science", "Bachelor's in Engineering", "Bachelor's in Business Administration",
  "Bachelor's in Economics", "Bachelor's in Psychology", "Bachelor's in Literature", "Bachelor's in Education",
  "Associate Degree", "High School Diploma", "12th Standard", "11th Standard", "10th Standard",
  "9th Standard", "8th Standard", "7th Standard", "6th Standard", "5th Standard", "4th Standard",
  "3rd Standard", "2nd Standard", "1st Standard", "Kindergarten", "Preschool", "Self-taught",
  "Professional Certificate", "Trade School", "Vocational Training", "Online Course Completion",
  "Coding Bootcamp", "Other"
];

const skills = [
  "Programming", "Web Development", "Mobile Development", "Data Science", "Machine Learning",
  "Artificial Intelligence", "Cybersecurity", "Cloud Computing", "DevOps", "Database Management",
  "UI/UX Design", "Graphic Design", "Video Editing", "Photography", "Content Writing", "Copywriting",
  "Digital Marketing", "Social Media Management", "SEO", "PPC Advertising", "Email Marketing",
  "Project Management", "Agile/Scrum", "Leadership", "Team Management", "Communication",
  "Public Speaking", "Negotiation", "Sales", "Customer Service", "Business Analysis",
  "Financial Analysis", "Accounting", "Bookkeeping", "Tax Preparation", "Investment Planning",
  "Teaching", "Tutoring", "Training", "Curriculum Development", "Educational Technology",
  "Language Translation", "Foreign Languages", "Creative Writing", "Technical Writing",
  "Music Production", "Audio Engineering", "Musical Instruments", "Singing", "Dancing",
  "Acting", "Theatre", "Film Making", "Animation", "3D Modeling", "Game Development",
  "Cooking", "Baking", "Nutrition", "Fitness Training", "Yoga", "Meditation", "Sports Coaching",
  "Automotive Repair", "Electronics Repair", "Plumbing", "Electrical Work", "Carpentry",
  "Welding", "Painting", "Interior Design", "Architecture", "Construction", "Real Estate",
  "Legal Research", "Paralegal", "Consulting", "Event Planning", "Travel Planning",
  "Healthcare", "Nursing", "Medical Coding", "Pharmacy", "Therapy", "Counseling",
  "Social Work", "Non-profit Management", "Fundraising", "Volunteer Coordination",
  "Research", "Data Analysis", "Statistics", "Quality Assurance", "Testing", "Other"
];

const cities = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio",
  "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus",
  "London", "Manchester", "Birmingham", "Glasgow", "Liverpool", "Leeds", "Sheffield",
  "Edinburgh", "Bristol", "Cardiff", "Belfast", "Dublin", "Cork", "Galway", "Limerick",
  "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg",
  "Quebec City", "Hamilton", "Kitchener", "Victoria", "Regina", "Saskatoon", "Halifax",
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata",
  "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal",
  "Tokyo", "Osaka", "Kyoto", "Yokohama", "Kobe", "Nagoya", "Sapporo", "Fukuoka",
  "Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu", "Hangzhou", "Wuhan",
  "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra",
  "Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Montpellier", "Strasbourg",
  "Berlin", "Munich", "Hamburg", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf",
  "Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence",
  "Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia",
  "Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Tilburg", "Groningen",
  "Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping",
  "Oslo", "Bergen", "Trondheim", "Stavanger", "Kristiansand", "Fredrikstad", "Tromsø",
  "Copenhagen", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers", "Kolding",
  "Helsinki", "Espoo", "Tampere", "Vantaa", "Turku", "Oulu", "Lahti", "Kuopio",
  "Other"
];

const countries = [
  "United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Italy",
  "Spain", "Netherlands", "Sweden", "Norway", "Denmark", "Finland", "Switzerland",
  "Austria", "Belgium", "Portugal", "Ireland", "Greece", "Czech Republic", "Poland",
  "Hungary", "Slovakia", "Slovenia", "Croatia", "Romania", "Bulgaria", "Estonia",
  "Latvia", "Lithuania", "Luxembourg", "Malta", "Cyprus", "Iceland", "Japan", "South Korea",
  "China", "India", "Singapore", "Malaysia", "Thailand", "Philippines", "Indonesia",
  "Vietnam", "Taiwan", "Hong Kong", "New Zealand", "South Africa", "Kenya", "Nigeria",
  "Egypt", "Morocco", "Israel", "United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait",
  "Brazil", "Argentina", "Chile", "Colombia", "Peru", "Ecuador", "Uruguay", "Paraguay",
  "Bolivia", "Venezuela", "Mexico", "Costa Rica", "Panama", "Guatemala", "Honduras",
  "El Salvador", "Nicaragua", "Jamaica", "Trinidad and Tobago", "Barbados", "Bahamas",
  "Russia", "Ukraine", "Belarus", "Kazakhstan", "Uzbekistan", "Georgia", "Armenia",
  "Azerbaijan", "Moldova", "Kyrgyzstan", "Tajikistan", "Turkmenistan", "Mongolia",
  "Other"
];

export default function PersonalInfoPage() {
  const [formData, setFormData] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    qualification: "",
    skills: [],
    city: "",
    country: ""
  });

  const [searchTerms, setSearchTerms] = useState({
    qualification: "",
    skills: "",
    city: "",
    country: ""
  });

  const [showDropdowns, setShowDropdowns] = useState({
    qualification: false,
    skills: false,
    city: false,
    country: false
  });

  const [customSkill, setCustomSkill] = useState("");
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false);

  const router = useRouter();
  const { user } = useUser();

  const filteredQualifications = qualifications.filter(qual =>
    qual.toLowerCase().includes(searchTerms.qualification.toLowerCase())
  );

  const filteredSkills = skills.filter(skill =>
    skill.toLowerCase().includes(searchTerms.skills.toLowerCase()) &&
    !formData.skills.includes(skill)
  );

  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(searchTerms.city.toLowerCase())
  );

  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(searchTerms.country.toLowerCase())
  );

  const handleQualificationSelect = (qualification: string) => {
    setFormData(prev => ({ ...prev, qualification }));
    setSearchTerms(prev => ({ ...prev, qualification }));
    setShowDropdowns(prev => ({ ...prev, qualification: false }));
  };

  const handleSkillSelect = (skill: string) => {
    if (skill === "Other") {
      setShowCustomSkillInput(true);
    } else {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
    setSearchTerms(prev => ({ ...prev, skills: "" }));
    setShowDropdowns(prev => ({ ...prev, skills: false }));
  };

  const handleCustomSkillAdd = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, customSkill.trim()] }));
      setCustomSkill("");
      setShowCustomSkillInput(false);
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleCitySelect = (city: string) => {
    setFormData(prev => ({ ...prev, city }));
    setSearchTerms(prev => ({ ...prev, city }));
    setShowDropdowns(prev => ({ ...prev, city: false }));
  };

  const handleCountrySelect = (country: string) => {
    setFormData(prev => ({ ...prev, country }));
    setSearchTerms(prev => ({ ...prev, country }));
    setShowDropdowns(prev => ({ ...prev, country: false }));
  };

  const handleCancel = () => {
    router.push('/');
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the personal info data
    console.log("Personal Info:", formData);
    
    // Mark personal info as completed for this user
    if (user) {
      localStorage.setItem(`personalInfo_completed_${user.id}`, 'true');
      // Store the personal info data (optional)
      localStorage.setItem(`personalInfo_data_${user.id}`, JSON.stringify(formData));
    }
    
    // Redirect to dashboard after completing personal info
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full -translate-y-36 translate-x-36"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full translate-y-48 -translate-x-48"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Image
                src="/sslogo-removebg-preview.png"
                alt="Skill Share Logo"
                width={60}
                height={60}
                className="mr-3"
              />
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Personal Information
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Please provide your personal details to complete your profile
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleProceed} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"
                  placeholder="Enter your first name"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            {/* Qualification */}
            <div className="relative">
              <label className="block text-gray-700 font-semibold mb-2">
                Qualification <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={searchTerms.qualification}
                onChange={(e) => {
                  setSearchTerms(prev => ({ ...prev, qualification: e.target.value }));
                  setShowDropdowns(prev => ({ ...prev, qualification: true }));
                }}
                onFocus={() => setShowDropdowns(prev => ({ ...prev, qualification: true }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"
                placeholder="Type to search qualifications..."
              />
              
              {showDropdowns.qualification && filteredQualifications.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10 mt-1">
                  {filteredQualifications.map((qualification, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleQualificationSelect(qualification)}
                      className="w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors duration-150 text-black"
                    >
                      {qualification}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="relative">
              <label className="block text-gray-700 font-semibold mb-2">
                Skills <span className="text-red-500">*</span>
              </label>
              
              {/* Selected Skills */}
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleSkillRemove(skill)}
                        className="ml-2 text-purple-500 hover:text-purple-700 transition-colors duration-150"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              {/* Custom Skill Input */}
              {showCustomSkillInput && (
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    placeholder="Enter custom skill..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                  />
                  <button
                    type="button"
                    onClick={handleCustomSkillAdd}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-150"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomSkillInput(false);
                      setCustomSkill("");
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-150"
                  >
                    Cancel
                  </button>
                </div>
              )}
              
              <input
                type="text"
                value={searchTerms.skills}
                onChange={(e) => {
                  setSearchTerms(prev => ({ ...prev, skills: e.target.value }));
                  setShowDropdowns(prev => ({ ...prev, skills: true }));
                }}
                onFocus={() => setShowDropdowns(prev => ({ ...prev, skills: true }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"
                placeholder="Type to search and add skills..."
              />
              
              {showDropdowns.skills && filteredSkills.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10 mt-1">
                  {filteredSkills.map((skill, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSkillSelect(skill)}
                      className="w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors duration-150 text-black"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* City and Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={searchTerms.city}
                  onChange={(e) => {
                    setSearchTerms(prev => ({ ...prev, city: e.target.value }));
                    setShowDropdowns(prev => ({ ...prev, city: true }));
                  }}
                  onFocus={() => setShowDropdowns(prev => ({ ...prev, city: true }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"
                  placeholder="Type to search cities..."
                />
                
                {showDropdowns.city && filteredCities.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10 mt-1">
                    {filteredCities.map((city, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleCitySelect(city)}
                        className="w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors duration-150 text-black"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={searchTerms.country}
                  onChange={(e) => {
                    setSearchTerms(prev => ({ ...prev, country: e.target.value }));
                    setShowDropdowns(prev => ({ ...prev, country: true }));
                  }}
                  onFocus={() => setShowDropdowns(prev => ({ ...prev, country: true }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"
                  placeholder="Type to search countries..."
                />
                
                {showDropdowns.country && filteredCountries.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10 mt-1">
                    {filteredCountries.map((country, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className="w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors duration-150 text-black"
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-4 bg-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-400 transform hover:-translate-y-1 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Proceed</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}