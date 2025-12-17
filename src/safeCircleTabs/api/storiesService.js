import { db } from '../../firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';

// Stories Collection
export const createStory = async (storyData) => {
  try {
    console.log('Creating story with data:', storyData);
    const docRef = await addDoc(collection(db, 'stories'), {
      ...storyData,
      createdAt: Timestamp.now(),
      likes: 0,
      dislikes: 0,
      commentsCount: 0,
      isAnonymous: storyData.isAnonymous || false,
      status: 'active' // active, reported, moderated
    });
    console.log('Story created successfully with ID:', docRef.id);
    return { id: docRef.id, ...storyData };
  } catch (error) {
    console.error('Error creating story:', error);
    throw error;
  }
};

export const getAllStories = async (filters = {}) => {
  try {
    console.log('Getting all stories with filters:', filters);
    let q = collection(db, 'stories');

    // Apply filters
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters.gender) {
      q = query(q, where('genderPerspective', '==', filters.gender));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    } else {
      q = query(q, where('status', '==', 'active'));
    }

    // Apply sorting
    let sortField = 'createdAt';
    let sortDirection = 'desc';

    if (filters.sortBy === 'liked') {
      sortField = 'likes';
    } else if (filters.sortBy === 'discussed') {
      sortField = 'commentsCount';
    }

    q = query(q, orderBy(sortField, sortDirection), limit(50));

    console.log('Executing Firestore query...');
    const querySnapshot = await getDocs(q);
    const stories = [];
    querySnapshot.forEach((doc) => {
      stories.push({ id: doc.id, ...doc.data() });
    });
    console.log('Retrieved stories from Firestore:', stories.length, 'stories');
    return stories;
  } catch (error) {
    console.error('Error getting stories:', error);
    throw error;
  }
};

export const getStory = async (id) => {
  try {
    const docRef = doc(db, 'stories', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Story not found');
    }
  } catch (error) {
    console.error('Error getting story:', error);
    throw error;
  }
};

export const updateStory = async (id, updates) => {
  try {
    const docRef = doc(db, 'stories', id);
    await updateDoc(docRef, updates);
    return true;
  } catch (error) {
    console.error('Error updating story:', error);
    throw error;
  }
};

export const deleteStory = async (id) => {
  try {
    await deleteDoc(doc(db, 'stories', id));
    return true;
  } catch (error) {
    console.error('Error deleting story:', error);
    throw error;
  }
};

// Categories
export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

// Comments
export const addComment = async (storyId, commentData) => {
  try {
    const commentRef = await addDoc(collection(db, 'comments'), {
      storyId,
      ...commentData,
      createdAt: Timestamp.now(),
      likes: 0,
      dislikes: 0,
      replies: [],
      isAnonymous: commentData.isAnonymous || false,
      status: 'active'
    });

    // Update story comments count
    const storyRef = doc(db, 'stories', storyId);
    const storySnap = await getDoc(storyRef);
    if (storySnap.exists()) {
      const currentCount = storySnap.data().commentsCount || 0;
      await updateDoc(storyRef, { commentsCount: currentCount + 1 });
    }

    return { id: commentRef.id, ...commentData };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const getComments = async (storyId) => {
  try {
    const q = query(
      collection(db, 'comments'),
      where('storyId', '==', storyId),
      where('status', '==', 'active'),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const comments = [];
    querySnapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() });
    });
    return comments;
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

export const addReply = async (commentId, replyData) => {
  try {
    const replyRef = await addDoc(collection(db, 'replies'), {
      commentId,
      ...replyData,
      createdAt: Timestamp.now(),
      likes: 0,
      dislikes: 0,
      isAnonymous: replyData.isAnonymous || false,
      status: 'active'
    });
    return { id: replyRef.id, ...replyData };
  } catch (error) {
    console.error('Error adding reply:', error);
    throw error;
  }
};

export const getReplies = async (commentId) => {
  try {
    const q = query(
      collection(db, 'replies'),
      where('commentId', '==', commentId),
      where('status', '==', 'active'),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const replies = [];
    querySnapshot.forEach((doc) => {
      replies.push({ id: doc.id, ...doc.data() });
    });
    return replies;
  } catch (error) {
    console.error('Error getting replies:', error);
    throw error;
  }
};

// Likes/Dislikes
export const toggleLike = async (storyId, userId, isLike) => {
  try {
    const likeRef = doc(db, 'likes', `${storyId}_${userId}`);
    const likeSnap = await getDoc(likeRef);

    const storyRef = doc(db, 'stories', storyId);
    const storySnap = await getDoc(storyRef);

    if (!storySnap.exists()) throw new Error('Story not found');

    const storyData = storySnap.data();

    if (likeSnap.exists()) {
      const existingLike = likeSnap.data();
      if (existingLike.type === (isLike ? 'like' : 'dislike')) {
        // Remove like/dislike
        await deleteDoc(likeRef);
        const updateData = isLike
          ? { likes: Math.max(0, storyData.likes - 1) }
          : { dislikes: Math.max(0, storyData.dislikes - 1) };
        await updateDoc(storyRef, updateData);
        return 'removed';
      } else {
        // Change from like to dislike or vice versa
        await updateDoc(likeRef, { type: isLike ? 'like' : 'dislike' });
        const updateData = isLike
          ? { likes: storyData.likes + 1, dislikes: Math.max(0, storyData.dislikes - 1) }
          : { likes: Math.max(0, storyData.likes - 1), dislikes: storyData.dislikes + 1 };
        await updateDoc(storyRef, updateData);
        return 'changed';
      }
    } else {
      // Add new like/dislike
      await addDoc(collection(db, 'likes'), {
        storyId,
        userId,
        type: isLike ? 'like' : 'dislike',
        createdAt: Timestamp.now()
      });
      const updateData = isLike
        ? { likes: storyData.likes + 1 }
        : { dislikes: storyData.dislikes + 1 };
      await updateDoc(storyRef, updateData);
      return 'added';
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

// Reports
export const reportContent = async (contentId, contentType, reportData) => {
  try {
    await addDoc(collection(db, 'reports'), {
      contentId,
      contentType, // 'story', 'comment', 'reply'
      ...reportData,
      createdAt: Timestamp.now(),
      status: 'pending'
    });
    return true;
  } catch (error) {
    console.error('Error reporting content:', error);
    throw error;
  }
};

// Moderation functions
export const moderateContent = async (contentId, contentType, action, moderatorId) => {
  try {
    const contentRef = doc(db, contentType === 'story' ? 'stories' : contentType === 'comment' ? 'comments' : 'replies', contentId);

    if (action === 'delete') {
      await updateDoc(contentRef, {
        status: 'moderated',
        moderatedBy: moderatorId,
        moderatedAt: Timestamp.now()
      });
    } else if (action === 'approve') {
      await updateDoc(contentRef, {
        status: 'active',
        moderatedBy: moderatorId,
        moderatedAt: Timestamp.now()
      });
    }

    // Update report status if this was from a report
    const reportsQuery = query(
      collection(db, 'reports'),
      where('contentId', '==', contentId),
      where('contentType', '==', contentType),
      where('status', '==', 'pending')
    );

    const reportsSnapshot = await getDocs(reportsQuery);
    reportsSnapshot.forEach(async (reportDoc) => {
      await updateDoc(doc(db, 'reports', reportDoc.id), {
        status: action === 'delete' ? 'resolved' : 'dismissed',
        resolvedBy: moderatorId,
        resolvedAt: Timestamp.now()
      });
    });

    return true;
  } catch (error) {
    console.error('Error moderating content:', error);
    throw error;
  }
};

export const getReports = async (status = 'pending') => {
  try {
    const q = query(
      collection(db, 'reports'),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const reports = [];
    querySnapshot.forEach((doc) => {
      reports.push({ id: doc.id, ...doc.data() });
    });
    return reports;
  } catch (error) {
    console.error('Error getting reports:', error);
    throw error;
  }
};

// ===== EVENTS MODULE FUNCTIONS =====

// Events Collection
export const createEvent = async (eventData) => {
  try {
    console.log('Creating event with data:', eventData);
    const docRef = await addDoc(collection(db, 'events'), {
      ...eventData,
      createdAt: Timestamp.now(),
      interestedCount: 0,
      registeredCount: 0,
      status: 'active' // active, cancelled, completed
    });
    console.log('Event created successfully with ID:', docRef.id);
    return { id: docRef.id, ...eventData };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const getAllEvents = async (filters = {}) => {
  try {
    console.log('Getting all events with filters:', filters);
    let q = collection(db, 'events');

    // Apply filters
    if (filters.type) {
      q = query(q, where('type', '==', filters.type));
    }
    if (filters.locationType) {
      q = query(q, where('locationType', '==', filters.locationType));
    }
    if (filters.targetAudience) {
      q = query(q, where('targetAudience', '==', filters.targetAudience));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    } else {
      q = query(q, where('status', '==', 'active'));
    }

    // Apply date filtering
    if (filters.dateRange === 'upcoming') {
      q = query(q, where('startDate', '>=', Timestamp.now()));
    } else if (filters.dateRange === 'past') {
      q = query(q, where('startDate', '<', Timestamp.now()));
    }

    // Apply sorting
    let sortField = 'startDate';
    let sortDirection = 'asc';

    if (filters.sortBy === 'popular') {
      sortField = 'interestedCount';
      sortDirection = 'desc';
    } else if (filters.sortBy === 'recent') {
      sortField = 'createdAt';
      sortDirection = 'desc';
    }

    q = query(q, orderBy(sortField, sortDirection), limit(50));

    console.log('Executing Firestore events query...');
    const querySnapshot = await getDocs(q);
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    console.log('Retrieved events from Firestore:', events.length, 'events');
    return events;
  } catch (error) {
    console.error('Error getting events:', error);
    throw error;
  }
};

export const getEvent = async (id) => {
  try {
    const docRef = doc(db, 'events', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Event not found');
    }
  } catch (error) {
    console.error('Error getting event:', error);
    throw error;
  }
};

export const updateEvent = async (id, updates) => {
  try {
    const docRef = doc(db, 'events', id);
    await updateDoc(docRef, updates);
    return true;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    await deleteDoc(doc(db, 'events', id));
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Event Registration
export const registerForEvent = async (eventId, userData) => {
  try {
    console.log('Registering user for event:', eventId, userData);
    const registrationRef = await addDoc(collection(db, 'eventRegistrations'), {
      eventId,
      ...userData,
      registeredAt: Timestamp.now(),
      status: 'registered',
      attended: false
    });

    // Update event registered count
    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    if (eventSnap.exists()) {
      const currentCount = eventSnap.data().registeredCount || 0;
      await updateDoc(eventRef, { registeredCount: currentCount + 1 });
    }

    console.log('Registration successful with ID:', registrationRef.id);
    return { id: registrationRef.id, ...userData };
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
};

export const markEventInterest = async (eventId, userId, interested) => {
  try {
    const interestRef = doc(db, 'eventInterests', `${eventId}_${userId}`);

    if (interested) {
      // Add interest
      await setDoc(interestRef, {
        eventId,
        userId,
        interestedAt: Timestamp.now()
      });

      // Update event interested count
      const eventRef = doc(db, 'events', eventId);
      const eventSnap = await getDoc(eventRef);
      if (eventSnap.exists()) {
        const currentCount = eventSnap.data().interestedCount || 0;
        await updateDoc(eventRef, { interestedCount: currentCount + 1 });
      }
    } else {
      // Remove interest
      await deleteDoc(interestRef);

      // Update event interested count
      const eventRef = doc(db, 'events', eventId);
      const eventSnap = await getDoc(eventRef);
      if (eventSnap.exists()) {
        const currentCount = eventSnap.data().interestedCount || 0;
        await updateDoc(eventRef, { interestedCount: Math.max(0, currentCount - 1) });
      }
    }

    return true;
  } catch (error) {
    console.error('Error updating event interest:', error);
    throw error;
  }
};

export const getEventRegistrations = async (eventId) => {
  try {
    const q = query(
      collection(db, 'eventRegistrations'),
      where('eventId', '==', eventId),
      orderBy('registeredAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const registrations = [];
    querySnapshot.forEach((doc) => {
      registrations.push({ id: doc.id, ...doc.data() });
    });
    return registrations;
  } catch (error) {
    console.error('Error getting event registrations:', error);
    throw error;
  }
};

export const checkUserRegistration = async (eventId, userId) => {
  try {
    const q = query(
      collection(db, 'eventRegistrations'),
      where('eventId', '==', eventId),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking user registration:', error);
    return false;
  }
};

export const checkUserInterest = async (eventId, userId) => {
  try {
    const interestRef = doc(db, 'eventInterests', `${eventId}_${userId}`);
    const interestSnap = await getDoc(interestRef);
    return interestSnap.exists();
  } catch (error) {
    console.error('Error checking user interest:', error);
    return false;
  }
};

// ===== LEARN MODULE FUNCTIONS =====

// Learning Modules Collection
export const createLearningModule = async (moduleData) => {
  try {
    console.log('Creating learning module with data:', moduleData);
    const docRef = await addDoc(collection(db, 'learningModules'), {
      ...moduleData,
      createdAt: Timestamp.now(),
      totalLessons: moduleData.lessons?.length || 0,
      completionCount: 0,
      status: 'active'
    });
    console.log('Learning module created successfully with ID:', docRef.id);
    return { id: docRef.id, ...moduleData };
  } catch (error) {
    console.error('Error creating learning module:', error);
    throw error;
  }
};

export const getAllLearningModules = async (filters = {}) => {
  try {
    console.log('Getting all learning modules with filters:', filters);
    let q = collection(db, 'learningModules');

    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters.difficulty) {
      q = query(q, where('difficulty', '==', filters.difficulty));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    } else {
      q = query(q, where('status', '==', 'active'));
    }

    q = query(q, orderBy('order', 'asc'), limit(50));

    console.log('Executing Firestore learning modules query...');
    const querySnapshot = await getDocs(q);
    const modules = [];
    querySnapshot.forEach((doc) => {
      modules.push({ id: doc.id, ...doc.data() });
    });
    console.log('Retrieved learning modules from Firestore:', modules.length, 'modules');
    return modules;
  } catch (error) {
    console.error('Error getting learning modules:', error);
    throw error;
  }
};

export const getLearningModule = async (id) => {
  try {
    const docRef = doc(db, 'learningModules', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Learning module not found');
    }
  } catch (error) {
    console.error('Error getting learning module:', error);
    throw error;
  }
};

// Lessons Collection
export const createLesson = async (moduleId, lessonData) => {
  try {
    console.log('Creating lesson for module:', moduleId, lessonData);
    const lessonRef = await addDoc(collection(db, 'lessons'), {
      moduleId,
      ...lessonData,
      createdAt: Timestamp.now(),
      completionCount: 0,
      status: 'active'
    });
    console.log('Lesson created successfully with ID:', lessonRef.id);
    return { id: lessonRef.id, ...lessonData };
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw error;
  }
};

export const getLessonsByModule = async (moduleId) => {
  try {
    const q = query(
      collection(db, 'lessons'),
      where('moduleId', '==', moduleId),
      where('status', '==', 'active'),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const lessons = [];
    querySnapshot.forEach((doc) => {
      lessons.push({ id: doc.id, ...doc.data() });
    });
    return lessons;
  } catch (error) {
    console.error('Error getting lessons:', error);
    throw error;
  }
};

export const getLesson = async (id) => {
  try {
    const docRef = doc(db, 'lessons', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Lesson not found');
    }
  } catch (error) {
    console.error('Error getting lesson:', error);
    throw error;
  }
};

// Quizzes Collection
export const createQuiz = async (lessonId, quizData) => {
  try {
    console.log('Creating quiz for lesson:', lessonId, quizData);
    const quizRef = await addDoc(collection(db, 'quizzes'), {
      lessonId,
      ...quizData,
      createdAt: Timestamp.now(),
      status: 'active'
    });
    console.log('Quiz created successfully with ID:', quizRef.id);
    return { id: quizRef.id, ...quizData };
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

export const getQuizByLesson = async (lessonId) => {
  try {
    const q = query(
      collection(db, 'quizzes'),
      where('lessonId', '==', lessonId),
      where('status', '==', 'active'),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting quiz:', error);
    throw error;
  }
};

// User Progress Collection
export const updateUserProgress = async (userId, moduleId, lessonId, progressData) => {
  try {
    const progressRef = doc(db, 'userProgress', `${userId}_${moduleId}_${lessonId}`);
    await setDoc(progressRef, {
      userId,
      moduleId,
      lessonId,
      ...progressData,
      lastUpdated: Timestamp.now()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

export const getUserProgress = async (userId, moduleId = null) => {
  try {
    let q = collection(db, 'userProgress');

    if (moduleId) {
      q = query(q, where('userId', '==', userId), where('moduleId', '==', moduleId));
    } else {
      q = query(q, where('userId', '==', userId));
    }

    const querySnapshot = await getDocs(q);
    const progress = [];
    querySnapshot.forEach((doc) => {
      progress.push({ id: doc.id, ...doc.data() });
    });
    return progress;
  } catch (error) {
    console.error('Error getting user progress:', error);
    throw error;
  }
};

export const submitQuizAttempt = async (userId, quizId, attemptData) => {
  try {
    console.log('Submitting quiz attempt:', userId, quizId, attemptData);
    const attemptRef = await addDoc(collection(db, 'quizAttempts'), {
      userId,
      quizId,
      ...attemptData,
      submittedAt: Timestamp.now()
    });
    console.log('Quiz attempt submitted successfully with ID:', attemptRef.id);
    return { id: attemptRef.id, ...attemptData };
  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
    throw error;
  }
};

export const getQuizAttempts = async (userId, quizId) => {
  try {
    const q = query(
      collection(db, 'quizAttempts'),
      where('userId', '==', userId),
      where('quizId', '==', quizId),
      orderBy('submittedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const attempts = [];
    querySnapshot.forEach((doc) => {
      attempts.push({ id: doc.id, ...doc.data() });
    });
    return attempts;
  } catch (error) {
    console.error('Error getting quiz attempts:', error);
    throw error;
  }
};

// Test Firestore connection
export const testFirestoreConnection = async () => {
  try {
    console.log('Testing Firestore connection...');

    // Try to read from stories collection
    const testQuery = query(collection(db, 'stories'), limit(1));
    const testSnapshot = await getDocs(testQuery);
    console.log('Firestore read test successful, found', testSnapshot.size, 'documents');

    // Try to write a test document
    const testDoc = await addDoc(collection(db, 'test'), {
      test: true,
      timestamp: Timestamp.now()
    });
    console.log('Firestore write test successful, created document:', testDoc.id);

    // Clean up test document
    await deleteDoc(doc(db, 'test', testDoc.id));
    console.log('Firestore delete test successful');

    return { success: true, message: 'Firestore connection working properly' };
  } catch (error) {
    console.error('Firestore connection test failed:', error);
    return { success: false, error: error.message };
  }
};