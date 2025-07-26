"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  firstName: string;
  lastName: string;
  occupation: string;
  gender: string;
  skills: string[];
}

const occupations = [
  "Student", "House Wife", "Veteran", "Retired", "Teacher", "Engineer", "Doctor", "Nurse", 
  "Lawyer", "Artist", "Designer", "Developer", "Manager", "Consultant", "Entrepreneur", 
  "Freelancer", "Writer", "Photographer", "Chef", "Accountant", "Sales Representative", 
  "Marketing Professional", "HR Professional", "Social Worker", "Therapist", "Researcher", 
  "Scientist", "Mechanic", "Electrician", "Plumber", "Carpenter", "Farmer", "Driver", 
  "Security Guard", "Cleaner", "Cashier", "Waiter", "Bartender", "Fitness Trainer", 
  "Musician", "Actor", "Journalist", "Pilot", "Police Officer", "Firefighter", "Paramedic",
  "Unemployed", "Other"
];

const skills = [
  "Programming", "Web Development", "Mobile Development", "Data Science", "Machine Learning",
  "Graphic Design", "UI/UX Design", "Video Editing", "Photography", "Writing", "Marketing",
  "Sales", "Project Management", "Leadership", "Communication", "Teaching", "Tutoring",
  "Languages", "Music", "Cooking", "Baking", "Fitness", "Yoga", "Dancing", "Painting",
  "Drawing", "Crafts", "Gardening", "Automotive", "Electronics", "Woodworking", "Sewing",
  "Knitting", "Financial Planning", "Accounting", "Legal Advice", "Healthcare", "Counseling",
  "Social Media", "Content Creation", "Public Speaking", "Event Planning", "Interior Design",
  "Architecture", "Construction", "Plumbing", "Electrical Work", "Mechanical Repair",
  "Computer Repair", "Math", "Science", "History", "Literature", "Sports", "Gaming"
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    occupation: "",
    gender: "",
    skills: []
  });
  
  const [occupationSearch, setOccupationSearch] = useState("");
  const [skillsSearch, setSkillsSearch] = useState("");
  const [showOccupationDropdown, setShowOccupationDropdown] = useState(false);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  
  const router = useRouter();

  const filteredOccupations = occupations.filter(occupation =>
    occupation.toLowerCase().includes(occupationSearch.toLowerCase())
  );

  const filteredSkills = skills.filter(skill =>
    skill.toLowerCase().includes(skillsSearch.toLowerCase()) &&
    !profile.skills.includes(skill)
  );

  const handleOccupationSelect = (occupation: string) => {
    setProfile(prev => ({ ...prev, occupation }));
    setOccupationSearch(occupation);
    setShowOccupationDropdown(false);
  };

  const handleSkillSelect = (skill: string) => {
    setProfile(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    setSkillsSearch("");
    setShowSkillsDropdown(false);
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the profile data
    console.log("Profile data:", profile);
    // For now, just redirect to home
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full -translate-y-36 translate-x-36"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full translate-y-48 -translate-x-48"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Complete Your Profile
            </h1>
            <p className="text-gray-600 text-lg">
              Tell us about yourself to get started on your SkillShare journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={profile.firstName}
                  onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
                  value={profile.lastName}
                  onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            {/* Occupation */}
            <div className="relative">
              <label className="block text-gray-700 font-semibold mb-2">
                Occupation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={occupationSearch}
                onChange={(e) => {
                  setOccupationSearch(e.target.value);
                  setShowOccupationDropdown(true);
                }}
                onFocus={() => setShowOccupationDropdown(true)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Type to search occupations..."
              />
              
              {showOccupationDropdown && filteredOccupations.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10 mt-1">
                  {filteredOccupations.map((occupation, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleOccupationSelect(occupation)}
                      className="w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors duration-150 text-black"
                    >
                      {occupation}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={profile.gender === "male"}
                    onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value }))}
                    className="mr-2 w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-gray-700">Male</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={profile.gender === "female"}
                    onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value }))}
                    className="mr-2 w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-gray-700">Female</span>
                </label>
              </div>
            </div>

            {/* Skills */}
            <div className="relative">
              <label className="block text-gray-700 font-semibold mb-2">
                Skills <span className="text-red-500">*</span>
              </label>
              
              {/* Selected Skills */}
              {profile.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.skills.map((skill, index) => (
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
              
              <input
                type="text"
                value={skillsSearch}
                onChange={(e) => {
                  setSkillsSearch(e.target.value);
                  setShowSkillsDropdown(true);
                }}
                onFocus={() => setShowSkillsDropdown(true)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Type to search and add skills..."
              />
              
              {showSkillsDropdown && filteredSkills.length > 0 && (
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

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Complete Profile</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}