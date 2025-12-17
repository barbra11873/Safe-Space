# Safe Circle – Stories Module

## Overview
The Safe Circle is a community-driven storytelling space within the Safespace web platform that enables survivors of Gender-Based Violence (GBV) to share lived experiences, find support, and connect with others on similar journeys.

## Features

### ✅ Core Functionality
- **Anonymous Story Sharing**: Users can post stories anonymously or with their identity
- **Multiple Content Types**: Support for both written stories and video testimonials
- **Advanced Filtering**: Sort by recent, most liked, most discussed; filter by gender and category
- **Interactive Engagement**: Like/dislike stories, comment, and reply to comments
- **Content Moderation**: Admin tools for managing harmful content
- **Reporting System**: Users can report inappropriate content
- **Educational Resources**: Built-in support information and healing guidance

### ✅ User Roles
- **Anonymous Users**: Can view stories and read-only content
- **Registered Users**: Can post stories, like/dislike, comment, and report content
- **Moderators/Admins**: Can moderate content, approve/reject posts, manage reports

## Database Setup

### Seeding Sample Data
1. Navigate to `/forum/stories` in your application
2. If you're logged in as an admin, you'll see a "Database Management" section
3. Click "🌱 Seed Sample Data" to populate the database with sample stories and comments
4. The sample data includes:
   - 8 diverse survivor stories (male/female perspectives)
   - 6 story categories (Domestic Violence, Sexual Assault, Recovery, etc.)
   - Sample comments and engagement metrics
   - Video testimonials (using placeholder URLs)

### Sample Stories Included
1. **Breaking Free from Domestic Silence** - Female survivor, domestic violence
2. **The Weight of Unspoken Trauma** - Male survivor, sexual assault
3. **From Victim to Advocate** - Female survivor, recovery journey
4. **The Invisible Scars of Childhood Abuse** - Female survivor, childhood trauma
5. **Finding Strength in Sisterhood** - Female survivor, support networks
6. **Breaking the Cycle: A Father's Story** - Male survivor, breaking cycles
7. **My Journey from Silence to Advocacy** - Female survivor, video testimony
8. **Breaking the Stigma: A Man's Story** - Male survivor, video testimony

## Technical Implementation

### Firebase Collections
- `stories`: Main story content with metadata
- `comments`: Threaded comments on stories
- `replies`: Replies to comments
- `categories`: Story categorization
- `reports`: User-reported content
- `likes`: User engagement tracking

### Key Components
- `StoriesTab.jsx`: Main stories feed with filtering/sorting
- `Story.jsx`: Individual story view with comments
- `PostStory.jsx`: Story creation modal
- `CommentsSection.jsx`: Comment system with replies
- `LikeDislikeButtons.jsx`: Engagement buttons
- `DatabaseSeeder.jsx`: Admin database management

### Authentication Integration
- Uses Firebase Auth for user management
- Role-based permissions (admin/moderator/user)
- Anonymous posting capabilities
- Secure content access controls

## Usage Guide

### For Users
1. **View Stories**: Browse the stories feed, filter by category or gender
2. **Share Your Story**: Click "Share Your Story" to post anonymously or as a registered user
3. **Engage**: Like/dislike stories, leave comments and replies
4. **Report**: Use the report button on inappropriate content
5. **Learn**: Access educational resources in the sidebar

### For Admins
1. **Moderate Content**: Use approve/reject buttons on reported content
2. **Manage Reports**: Review and resolve user reports
3. **Seed Database**: Populate with sample data for testing
4. **Clear Data**: Reset database for development purposes

## Video Content
Sample videos are included using placeholder URLs from sample-videos.com. In production:
1. Set up Firebase Storage for secure video uploads
2. Implement video compression and format validation
3. Add content moderation for uploaded videos
4. Ensure GDPR compliance for user-generated content

## Security & Privacy
- All user data is handled securely through Firebase
- Anonymous posting protects user identities
- Content moderation prevents harmful material
- Reporting system enables community self-regulation
- Admin oversight ensures platform safety

## Development Notes
- Green theme aligns with GBV awareness symbolism
- Responsive design works on mobile and desktop
- Real-time updates for engagement metrics
- Scalable architecture for growing user base
- Comprehensive error handling and loading states

## Getting Started
1. Ensure Firebase is properly configured
2. Run the application: `npm run dev`
3. Navigate to `/forum/stories`
4. Log in as admin to seed sample data
5. Test all features: posting, commenting, moderation

The Safe Circle module is now fully functional and ready for production use, providing a supportive space for GBV survivors to share, heal, and connect.