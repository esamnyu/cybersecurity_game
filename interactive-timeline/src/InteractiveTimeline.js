import React, { useState, useEffect } from 'react';
import { AlertCircle, Briefcase, Book, Award } from 'lucide-react';

// ... rest of your code remains the same
const timelineData = [
    {
      id: 1,
      category: 'Education',
      title: 'NYU Tandon School of Engineering',
      subtitle: 'M.S. Cybersecurity',
      date: 'Expected Dec 2024',
      description: 'GPA: 3.96',
      icon: Book,
    },
    {
      id: 2,
      category: 'Experience',
      title: 'NYU Langone Health',
      subtitle: 'AI & Cybersecurity Intern',
      date: 'May-Aug 2024',
      description: 'Worked on cutting-edge AI and cybersecurity projects in healthcare.',
      icon: Briefcase,
    },
    {
      id: 3,
      category: 'Projects',
      title: 'Roomies App',
      subtitle: 'Lead Developer',
      date: '2023',
      description: 'Developed a full-stack application for roommate management.',
      icon: AlertCircle,
    },
    {
      id: 4,
      category: 'Achievements',
      title: '2nd Place: CSAW LLM Attack CTF',
      subtitle: 'Competitive Achievement',
      date: '2023',
      description: 'Demonstrated advanced skills in LLM security challenges.',
      icon: Award,
    },
  ];

  const TimelineEntry = ({ entry, index, isActive, onClick }) => (
    <div className={`mb-8 flex justify-between items-center w-full ${isActive ? 'scale-105 transition-transform' : ''}`}>
      <div className={`order-1 w-5/12 ${index % 2 === 0 ? '' : 'text-right'}`}>
        {index % 2 === 0 && (
          <div>
            <h3 className="font-bold text-lg">{entry.title}</h3>
            <p className="text-sm text-gray-600">{entry.subtitle}</p>
            <p className="text-xs text-gray-500">{entry.date}</p>
            <button onClick={() => onClick(entry)} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">Learn More</button>
          </div>
        )}
      </div>
      <div className="z-20 flex items-center order-1 bg-gray-800 shadow-xl w-8 h-8 rounded-full">
        <span className="mx-auto text-white">{React.createElement(entry.icon, { size: 20 })}</span>
      </div>
      <div className={`order-1 w-5/12 ${index % 2 === 0 ? 'text-left' : ''}`}>
        {index % 2 !== 0 && (
          <div>
            <h3 className="font-bold text-lg">{entry.title}</h3>
            <p className="text-sm text-gray-600">{entry.subtitle}</p>
            <p className="text-xs text-gray-500">{entry.date}</p>
            <button onClick={() => onClick(entry)} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">Learn More</button>
          </div>
        )}
      </div>
    </div>
  );
  
  const InteractiveTimeline = () => {
    const [filter, setFilter] = useState('All');
    const [activeEntry, setActiveEntry] = useState(null);
    const [animated, setAnimated] = useState([]);
  
    const filteredData = filter === 'All'
      ? timelineData
      : timelineData.filter(entry => entry.category === filter);
  
    const handleEntryClick = (entry) => {
      setActiveEntry(entry);
    };
  
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setAnimated(prev => [...prev, entry.target.id]);
          }
        });
      }, { threshold: 0.5 });
  
      document.querySelectorAll('.timeline-entry').forEach(el => observer.observe(el));
  
      return () => observer.disconnect();
    }, [filteredData]);
  
    return (
      <div className="container mx-auto w-full h-full">
        <div className="relative wrap overflow-hidden p-10 h-full">
          <div className="border-2-2 absolute border-opacity-20 border-gray-700 h-full border" style={{left: '50%'}}></div>
          
          {/* Filter buttons */}
          <div className="mb-8 flex justify-center space-x-4">
            {['All', 'Education', 'Experience', 'Projects', 'Achievements'].map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded ${filter === category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {category}
              </button>
            ))}
          </div>
  
          {filteredData.map((entry, index) => (
            <div 
              key={entry.id} 
              id={`entry-${entry.id}`} 
              className={`timeline-entry transition-all duration-500 ${animated.includes(`entry-${entry.id}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <TimelineEntry
                entry={entry}
                index={index}
                isActive={activeEntry && activeEntry.id === entry.id}
                onClick={handleEntryClick}
              />
            </div>
          ))}
        </div>
        
        {/* Modal for detailed view */}
        {activeEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md">
              <h2 className="text-2xl font-bold">{activeEntry.title}</h2>
              <p className="text-gray-600">{activeEntry.subtitle}</p>
              <p className="mt-4">{activeEntry.description}</p>
              <p className="mt-2 text-sm text-gray-500">{activeEntry.date}</p>
              <button 
                onClick={() => setActiveEntry(null)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default InteractiveTimeline;