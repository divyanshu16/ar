// Wedding Data for Abhimanyu & Rupali
// February 7-8, 2026 | Alwar, Rajasthan

export const coupleData = {
  groomName: 'Abhimanyu',
  brideName: 'Rupali',
  weddingDate: new Date('2026-02-08T19:00:00'),
  hashtag: '#CodemeetsClause',
  tagline: 'Two souls, one journey',
  venue: {
    name: 'Alwar Motel and Resorts',
    city: 'Alwar',
    state: 'Rajasthan',
    country: 'India'
  }
};

export const events = [
  {
    id: 'mehendi',
    name: 'Mehendi',
    date: '2026-02-07',
    time: '02:00 PM',
    dateDisplay: 'February 7, 2026',
    venue: 'Banquet Hall, Alwar Motel and Resorts, Alwar',
    dressCode: 'Shades of Green and Olive',
    followedBy: 'Lunch',
    description: 'Join us as intricate henna designs adorn the bride, celebrating the beauty of tradition.',
    icon: '🪷',
    color: '#708238', // olive green
    gradient: 'linear-gradient(135deg, #708238 0%, #9CAF88 100%)'
  },
  {
    id: 'sangeet',
    name: 'Sangeet',
    date: '2026-02-07',
    time: '07:30 PM',
    dateDisplay: 'February 7, 2026',
    venue: 'Banquet Hall, Alwar Motel and Resorts, Alwar',
    dressCode: 'Disco Affair',
    followedBy: 'Cocktail Dinner',
    description: 'An evening of music, dance, and celebration as families come together in joy.',
    icon: '🪘',
    color: '#9333EA', // purple for disco
    gradient: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)'
  },
  {
    id: 'haldi',
    name: 'Haldi',
    date: '2026-02-08',
    time: '10:00 AM',
    dateDisplay: 'February 8, 2026',
    venue: 'Poolside, Alwar Motel and Resorts, Alwar',
    dressCode: 'Shades of Yellow and Pink',
    followedBy: 'Rajasthani Lunch',
    description: 'A vibrant ceremony where turmeric blesses the couple with radiance and good fortune.',
    icon: '💛',
    color: '#FFD700', // yellow
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
  },
  {
    id: 'wedding',
    name: 'Wedding',
    date: '2026-02-08',
    time: '07:00 PM',
    dateDisplay: 'February 8, 2026',
    venue: 'Lawn, Alwar Motel and Resorts, Alwar',
    dressCode: 'Traditional',
    dressCodeNote: 'Please skip red, maroon, and similar shades',
    followedBy: 'Dinner',
    description: 'The sacred ceremony where two hearts unite in eternal love under the stars.',
    icon: '🔥',
    color: '#D4AF37', // gold
    gradient: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)'
  }
];

export const loveStoryMilestones = [
  {
    id: 1,
    title: 'First Meeting',
    year: '2020',
    description: 'Where two paths crossed and destiny began to unfold.',
    icon: '✨'
  },
  {
    id: 2,
    title: 'First Date',
    year: '2020',
    description: 'Nervous hearts, endless conversations, and the spark that ignited it all.',
    icon: '☕'
  },
  {
    id: 3,
    title: 'Official Together',
    year: '2021',
    description: 'When "maybe" became "definitely" and two became one.',
    icon: '💕'
  },
  {
    id: 4,
    title: 'Meeting the Families',
    year: '2022',
    description: 'Two families united in joy, blessing this beautiful bond.',
    icon: '👨‍👩‍👧‍👦'
  },
  {
    id: 5,
    title: 'The Proposal',
    year: '2025',
    description: 'One question, one answer, and a lifetime of adventures ahead.',
    icon: '💍'
  },
  {
    id: 6,
    title: 'Forever Begins',
    year: '2026',
    description: 'February 8th - The day we say "I do" surrounded by love.',
    icon: '🔥'
  }
];

export const quizQuestions = [
  {
    id: 1,
    question: 'Where did Abhimanyu and Rupali first meet?',
    options: ['College', 'Through friends', 'At work', 'Online'],
    correctAnswer: 1 // placeholder - update with real answer
  },
  {
    id: 2,
    question: 'What was their first date activity?',
    options: ['Coffee', 'Movie', 'Dinner', 'Walk in the park'],
    correctAnswer: 0 // placeholder
  },
  {
    id: 3,
    question: 'Who said "I love you" first?',
    options: ['Abhimanyu', 'Rupali', 'Both at the same time', 'Neither admits it!'],
    correctAnswer: 0 // placeholder
  },
  {
    id: 4,
    question: 'What is their favorite thing to do together?',
    options: ['Travel', 'Watch movies', 'Cook together', 'Long drives'],
    correctAnswer: 0 // placeholder
  },
  {
    id: 5,
    question: 'What is Abhimanyu\'s nickname for Rupali?',
    options: ['Sweetheart', 'Jaan', 'Cutie', 'It\'s a secret!'],
    correctAnswer: 3 // placeholder
  }
];

export const galleryImages = [
  {
    id: 1,
    src: '/images/couple-1.jpg',
    alt: 'Abhimanyu and Rupali',
    caption: 'Our journey begins'
  },
  {
    id: 2,
    src: '/images/couple-2.jpg',
    alt: 'Together forever',
    caption: 'Making memories'
  },
  {
    id: 3,
    src: '/images/couple-3.jpg',
    alt: 'Love story',
    caption: 'Every moment with you'
  },
  {
    id: 4,
    src: '/images/couple-4.jpg',
    alt: 'Engagement',
    caption: 'The proposal'
  },
  {
    id: 5,
    src: '/images/couple-5.jpg',
    alt: 'Pre-wedding',
    caption: 'Counting down the days'
  },
  {
    id: 6,
    src: '/images/couple-6.jpg',
    alt: 'Adventures',
    caption: 'Our adventures'
  }
];

// Countdown calculation helper (IST - Indian Standard Time UTC+5:30)
export const getCountdown = () => {
  // Wedding date in IST (UTC+5:30)
  const weddingDate = new Date('2026-02-08T19:00:00+05:30');
  const now = new Date();
  const diff = weddingDate - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};
