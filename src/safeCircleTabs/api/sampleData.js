import { db } from '../../firebase';
import { collection, addDoc, Timestamp, getDocs, deleteDoc } from 'firebase/firestore';

// Sample data for Safe Circle Stories Module
export const sampleStories = [
  {
    title: "Breaking Free from Domestic Silence",
    content: "For years, I lived in a home where love was conditional and fear was constant. The emotional abuse was subtle at first - controlling what I wore, who I spoke to, even questioning my sanity. But when it turned physical, I knew I had to find my voice. Today, I'm rebuilding my life, one boundary at a time. To anyone reading this: your silence protects your abuser, not you. Speak up, seek help, you deserve peace.",
    contentType: "text",
    category: "domestic-violence",
    genderPerspective: "female",
    abuseType: "domestic",
    authorName: "Anonymous Survivor",
    authorId: "anonymous_001",
    isAnonymous: true,
    triggerWarning: true,
    healingPrompt: "What helped you find your voice again?",
    likes: 24,
    dislikes: 1,
    commentsCount: 8,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // 7 days ago
  },
  {
    title: "The Weight of Unspoken Trauma",
    content: "As a man, I was taught that 'real men' don't cry, don't show weakness, and certainly don't admit to being victims. But the sexual assault I experienced as a teenager shaped every relationship I've had since. The shame, the isolation, the constant questioning of my masculinity - it nearly destroyed me. Therapy saved my life. Brothers, your pain is valid. Your strength lies in your vulnerability, not your silence.",
    contentType: "text",
    category: "sexual-assault",
    genderPerspective: "male",
    abuseType: "sexual",
    authorName: "Anonymous Survivor",
    authorId: "anonymous_002",
    isAnonymous: true,
    triggerWarning: true,
    healingPrompt: "How did you redefine what it means to be 'strong'?",
    likes: 31,
    dislikes: 0,
    commentsCount: 12,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)) // 5 days ago
  },
  {
    title: "From Victim to Advocate",
    content: "They say time heals all wounds, but I disagree. Time gives you space to heal yourself. After leaving an abusive marriage, I channeled my pain into purpose. Now I volunteer at a women's shelter, speaking at schools about healthy relationships, and mentoring young women. Your story doesn't end with the abuse - it begins with your courage to rebuild.",
    contentType: "text",
    category: "recovery",
    genderPerspective: "female",
    abuseType: "domestic",
    authorName: "Anonymous Survivor",
    authorId: "anonymous_003",
    isAnonymous: true,
    triggerWarning: false,
    healingPrompt: "How did you turn your pain into purpose?",
    likes: 45,
    dislikes: 2,
    commentsCount: 15,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)) // 3 days ago
  },
  {
    title: "The Invisible Scars of Childhood Abuse",
    content: "My father was supposed to protect me, not break me. The physical abuse stopped when I moved out, but the psychological damage followed me everywhere. Trust issues, self-doubt, nightmares that wake me in cold sweats. But I'm learning that healing isn't linear. Some days I feel broken, others I feel powerful. Both are part of my journey.",
    contentType: "text",
    category: "childhood-abuse",
    genderPerspective: "female",
    abuseType: "physical",
    authorName: "Anonymous Survivor",
    authorId: "anonymous_004",
    isAnonymous: true,
    triggerWarning: true,
    healingPrompt: "What does 'healing' look like for you today?",
    likes: 28,
    dislikes: 1,
    commentsCount: 9,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)) // 10 days ago
  },
  {
    title: "Finding Strength in Sisterhood",
    content: "When I finally left my abusive partner, I thought I'd be alone. But the women at the shelter became my family. We shared stories over coffee, cried together, laughed together. They taught me that my experience wasn't unique, but my strength was. Today, I pay it forward by supporting others on their journey to freedom.",
    contentType: "text",
    category: "support-networks",
    genderPerspective: "female",
    abuseType: "domestic",
    authorName: "Anonymous Survivor",
    authorId: "anonymous_005",
    isAnonymous: true,
    triggerWarning: false,
    healingPrompt: "Who helped you heal, and how can you help others?",
    likes: 38,
    dislikes: 0,
    commentsCount: 11,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)) // 2 days ago
  },
  {
    title: "My Journey from Silence to Advocacy",
    content: "This is my story of surviving domestic violence and finding my voice. I share this to help others know they're not alone.",
    contentType: "video",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", // Placeholder video URL
    thumbnailUrl: "/thumbnails/survivor-story-1.jpg",
    category: "recovery",
    genderPerspective: "female",
    abuseType: "domestic",
    authorName: "Anonymous Survivor",
    authorId: "anonymous_007",
    isAnonymous: true,
    triggerWarning: true,
    healingPrompt: "What gave you the courage to speak out?",
    likes: 67,
    dislikes: 1,
    commentsCount: 23,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)) // 1 day ago
  },
  {
    title: "Breaking the Stigma: A Man's Story",
    content: "Men experience abuse too. Here's my testimony about emotional abuse and how I rebuilt my life.",
    contentType: "video",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4", // Placeholder video URL
    thumbnailUrl: "/thumbnails/male-survivor-1.jpg",
    category: "breaking-cycles",
    genderPerspective: "male",
    abuseType: "emotional",
    authorName: "Anonymous Survivor",
    authorId: "anonymous_008",
    isAnonymous: true,
    triggerWarning: false,
    healingPrompt: "How did you redefine masculinity for yourself?",
    likes: 52,
    dislikes: 0,
    commentsCount: 18,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)) // 4 days ago
  },
  {
    title: "Breaking the Cycle: A Father's Story",
    content: "I grew up watching my father abuse my mother. I swore I'd never be like him. But when stress built up in my marriage, I found myself repeating the same patterns. Recognizing this saved my family. Therapy, accountability, and choosing love over anger every single day. Men, we can break these cycles. Our children deserve better fathers.",
    contentType: "text",
    category: "breaking-cycles",
    genderPerspective: "male",
    abuseType: "domestic",
    authorName: "Anonymous Survivor",
    authorId: "anonymous_006",
    isAnonymous: true,
    triggerWarning: false,
    healingPrompt: "What patterns did you break, and how?",
    likes: 42,
    dislikes: 1,
    commentsCount: 14,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)) // 6 days ago
  }
];

export const sampleCategories = [
  {
    id: "domestic-violence",
    name: "Domestic Violence",
    description: "Stories about intimate partner violence and abuse",
    imageUrl: "/categories/domestic-violence.jpg",
    createdAt: Timestamp.now()
  },
  {
    id: "sexual-assault",
    name: "Sexual Violence",
    description: "Experiences of sexual assault and harassment",
    imageUrl: "/categories/sexual-assault.jpg",
    createdAt: Timestamp.now()
  },
  {
    id: "childhood-abuse",
    name: "Childhood Abuse",
    description: "Stories of abuse experienced in childhood",
    imageUrl: "/categories/childhood-abuse.jpg",
    createdAt: Timestamp.now()
  },
  {
    id: "recovery",
    name: "Recovery & Healing",
    description: "Journeys of healing and recovery",
    imageUrl: "/categories/recovery.jpg",
    createdAt: Timestamp.now()
  },
  {
    id: "support-networks",
    name: "Support Networks",
    description: "Finding and building support systems",
    imageUrl: "/categories/support.jpg",
    createdAt: Timestamp.now()
  },
  {
    id: "breaking-cycles",
    name: "Breaking Cycles",
    description: "Breaking intergenerational cycles of abuse",
    imageUrl: "/categories/breaking-cycles.jpg",
    createdAt: Timestamp.now()
  }
];

export const sampleComments = [
  // Comments for story 1
  {
    storyId: "story_001",
    content: "Your courage inspires me. I'm at the beginning of this journey and your words give me hope.",
    authorId: "user_001",
    authorName: "HopefulHeart",
    isAnonymous: false,
    likes: 5,
    dislikes: 0,
    replies: [],
    status: "active",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000))
  },
  {
    storyId: "story_001",
    content: "Thank you for sharing. The part about silence protecting the abuser really hit home.",
    authorId: "user_002",
    authorName: "Anonymous",
    isAnonymous: true,
    likes: 3,
    dislikes: 0,
    replies: [],
    status: "active",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000))
  },
  // Comments for story 2
  {
    storyId: "story_002",
    content: "As another male survivor, reading this brought tears to my eyes. Thank you for your vulnerability.",
    authorId: "user_003",
    authorName: "BrotherInHealing",
    isAnonymous: false,
    likes: 8,
    dislikes: 0,
    replies: [],
    status: "active",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000))
  },
  {
    storyId: "story_002",
    content: "The stigma around male victims is so real. Your story helps break that down.",
    authorId: "user_004",
    authorName: "Anonymous",
    isAnonymous: true,
    likes: 6,
    dislikes: 0,
    replies: [],
    status: "active",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
  }
];

// Function to seed the database with sample data
export const seedDatabase = async () => {
  try {
    console.log('Seeding database with sample data...');

    // Add categories
    for (const category of sampleCategories) {
      await addDoc(collection(db, 'categories'), category);
    }

    // Add stories
    const storyRefs = [];
    for (const story of sampleStories) {
      const docRef = await addDoc(collection(db, 'stories'), story);
      storyRefs.push({ id: docRef.id, ...story });
    }

    // Add comments with correct story IDs
    for (let i = 0; i < sampleComments.length; i++) {
      const comment = sampleComments[i];
      const storyIndex = Math.floor(i / 2); // 2 comments per story
      if (storyRefs[storyIndex]) {
        comment.storyId = storyRefs[storyIndex].id;
        await addDoc(collection(db, 'comments'), comment);
      }
    }

    console.log('Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};

// Function to clear all data (for development)
export const clearDatabase = async () => {
  try {
    console.log('Clearing database...');

    // Note: In a real application, you'd want to be more careful with this
    // For development purposes only
    const collections = ['stories', 'comments', 'replies', 'categories', 'reports', 'likes'];

    for (const collectionName of collections) {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const deletePromises = [];
      querySnapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
      });
      await Promise.all(deletePromises);
    }

    console.log('Database cleared successfully!');
    return true;
  } catch (error) {
    console.error('Error clearing database:', error);
    return false;
  }
};