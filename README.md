# CityVibe

CityVibe is a web-first hyperlocal discovery platform tailored for Tier 2 and Tier 3 cities in India. It focuses on community-driven recommendations, short-form media, and localized discovery for food, events, and hangouts.

## Software Requirements Specification (SRS)

The full SRS is available in `SRS.md` and included below for quick reference.

### Project Title: CityVibe - Web-Based Hyperlocal City Discovery Platform

#### 1. Introduction
**1.1 Purpose**  
This document defines the software requirements for CityVibe, a web-based hyperlocal city discovery platform for users in Tier 2 and Tier 3 cities in India. The platform enables users to discover food spots, local events, fairs, budget hangout places, study cafes, sports grounds, hidden places, and weekend plans through community-generated content, short-form videos, local recommendations, and regional-language support.

**1.2 Scope**  
CityVibe addresses gaps in current discovery platforms that focus on metro cities, English-speaking audiences, and mainstream places. Users in smaller cities need a trusted, localized, and visually engaging platform to explore what to do in their own city. The web platform will:
- Allow users to explore city-specific recommendations
- Support short video and image-based recommendations
- Provide filters such as category, budget, locality, and vibe
- Enable users to upload and share recommendations
- Support local-language captions and descriptions
- Allow users to save places and create outing plans
- Provide a foundation for future mobile application expansion

**1.3 Intended Audience**  
Developers, product designers, QA engineers, project evaluators, stakeholders, future implementation teams.

**1.4 Product Vision**  
Create a web-first hyperlocal discovery platform that helps people in smaller Indian cities find enjoyable, affordable, and relevant local experiences through community recommendations and city-based content.

#### 2. Overall Description
**2.1 Product Perspective**  
CityVibe is a standalone responsive web application combining: local discovery platform, content-sharing platform, event browsing system, place recommendation system, community engagement system. The application will be web-first and designed to support future Android/iOS expansion.

**2.2 Product Goals**  
Provide city-specific discovery experience; offer a simple and engaging web interface; encourage users to upload local recommendations; support short-form media-based exploration; build a trustworthy local recommendation ecosystem; remain flexible for future mobile app development.

**2.3 User Classes and Characteristics**  
General users (browse recommendations); students (budget cafes, study spots, sports areas, affordable hangouts); couples/friend groups (date ideas, weekend plans, fun places, hidden gems); local creators/contributors (upload videos, photos, recommendations); local businesses (list or promote places); admin/moderators (moderation, approvals, analytics).

#### 3. Assumptions and Dependencies
**3.1 Assumptions**  
Users have internet access and a modern browser; the platform is responsive across desktop and mobile; users prefer easy browsing and visual content; local-language and Hinglish content improves adoption; initial usage may lean toward browsing over uploading.

**3.2 Dependencies**  
Browser support for modern HTML, CSS, and JavaScript; media upload/storage service; database for places, users, and content; map/location API; authentication service; moderation/admin tools; notification/email service if enabled.

#### 4. Functional Requirements
**4.1 User Registration and Authentication**  
Allow sign up via email, phone, or Google; secure login/logout; password reset; profile edit; manage preferences. Profile data may include: full name, username, profile picture, selected city, preferred language, bio, saved places, uploaded content, follower/following count.

**4.2 City Selection**  
Allow manual city selection and switching; optional approximate location detection; show recommendations based on selected city; support future geolocation personalization. City data includes city feed, trending places, categories, events, local contributors, hidden gems, seasonal recommendations.

**4.3 Home Page / Discovery Feed**  
Homepage includes featured recommendations, trending places, latest short videos, nearby or relevant suggestions, categories, seasonal/weekend recommendations. Example sections: Trending in Your City, Food Spots, Date Ideas, Hidden Gems, Study Cafes, Sports and Activities, Events and Melas, Budget Plans, Recommended for You.

**4.4 Place Discovery**  
Explore via category browsing, city browsing, locality filters, budget filters, popularity filters, recommendation tags. Categories: food spots, cafes, date places, study cafes, sports grounds, parks, hidden gems, shopping places, street food, event venues, local attractions, photography spots, family outing places, budget hangouts. Filters: budget, locality, open now, family-friendly, good for couples, good for friends, best for study, quiet place, aesthetic place, indoor/outdoor, best for photos, distance (if location permission available).

**4.5 Content Upload and Recommendations**  
Registered users can upload short videos or images, write captions, tag place name and city, assign category, add budget estimate, tag attributes like "best for friends" or "good for date," and submit review-style recommendations. Metadata: title, city, place name, category, estimated budget, description/caption, hashtags/tags, uploader info, upload timestamp, optional map location. Media constraints: image and video formats, 15-60 second videos, thumbnail generation, file size limits, upload progress display.

**4.6 Place Details Page**  
Show place name, cover image/video, location/address, category, budget estimate, description, timing (if available), user recommendations, comments/reviews, tags, save/share actions, similar places. Actions: save place, share link, comment, like/upvote, report incorrect details, open location in maps, add place to list.

**4.7 Event and Mela Discovery**  
Event section for local fairs/melas, cultural events, exhibitions, food events, college events, community gatherings, live performance events. Event details include title, venue, city, date/time, entry fee, organizer, description, media, map link, save/share option. Event submission by eligible users or admins: add/edit events, upload posters, define validity.

**4.8 Search Functionality**  
Search by place name, city, locality, event name, category, tags, creator profile. Features: recent searches, suggested searches, trending searches, category suggestions, city-wise filtered results.

**4.9 Saved Lists and Personal Planning**  
Save places, create collections/lists, simple outing plans, group multiple places, share lists via link. Example lists: Best Cafes in My City; Cheap Date Ideas; Weekend Plan; Hidden Gems; Study Spots; Best Places With Friends.

**4.10 Community Interaction**  
Like recommendations, comment, reply, follow creators, share externally, report abusive or spam content. Trust features may include verified contributor badge, top local creator badge, trusted reviewer label, business verified tag.

**4.11 Language Support**  
Support English, Hindi, Hinglish, and future regional languages. Allow captions in multiple languages, future multilingual UI, mixed-language search keywords, regional-language descriptions.

**4.12 Notifications**  
For web: may support email, in-app, and browser notifications (with permission) for new comments, new followers, saved event reminders, updates from followed creators, trending places in the selected city.

**4.13 Admin Panel**  
Admin dashboard to manage users, moderate uploads, review reported posts/comments, manage categories and city listings, approve/reject event submissions, monitor basic analytics, manage business/place listings.

**4.14 Reporting and Moderation**  
Users can report spam, offensive content, fake listings, misleading recommendations, duplicate uploads, abusive comments. Admins can review reports, remove or hide content, suspend users, manage moderation logs.

#### 5. Non-Functional Requirements
Performance: fast page loads, optimized media, responsive search, usable on lower-end devices.  
Scalability: support additional cities, growing users, media uploads, place/event records.  
Availability: accessible 24/7 except maintenance.  
Usability: simple UI, responsive design, quick discovery, clear navigation.  
Security: secure auth/session, encrypted passwords, role-based admin access, secure media handling, input validation.  
Reliability: persistent saved places and uploads, consistent data, resilient media storage.  
Compatibility: Chrome, Edge, Firefox, Android/iOS mobile browsers, responsive layouts.

#### 6. External Interface Requirements
User interface includes landing page, login/signup, city selection, homepage/discovery feed, category browsing, search, place details, event details, upload recommendation, saved lists, user profile, creator profile, admin dashboard. Navigation may use top nav bar, desktop sidebar/menu, responsive nav on smaller screens. Hardware interface: desktop/laptop browser, mobile browser, webcam/camera upload, optional geolocation permission. Software interface: map API, media storage, authentication provider, analytics service, email service, browser notifications, moderation tools.

#### 7. Data Requirements
Core entities: User, City, Place, Category, Recommendation Post, Event, Comment, Saved List, Report, Business Listing, Notification.  
Sample fields:  
- User: user_id, name, email/phone, password_hash, selected_city, preferred_language, profile_image, bio, created_at  
- Place: place_id, place_name, city_id, address, locality, latitude, longitude, category_id, budget_range, timing, description, created_at  
- Recommendation: recommendation_id, user_id, place_id, city_id, title, caption, media_url, media_type, tags, likes_count, comments_count, created_at  
- Event: event_id, city_id, event_name, venue, date_time, entry_fee, description, organizer_name, media_url

#### 8. User Roles and Permissions
Guest: browse public recommendations, search places/events, view categories and city pages.  
Registered: like, comment, save, follow, upload recommendations, create lists, update profile.  
Contributor/Creator: upload content regularly, manage recommendation posts, view contribution stats in future phases.  
Business User: claim/manage listings in future phases, submit events/offers in future phases.  
Admin: full platform management and moderation access.

#### 9. MVP Scope for Web Version
MVP features: user signup/login, city selection, homepage with discovery feed, category browsing, place details page, event listing page, search, upload recommendation with image/video, save place/list, like/comment functionality, admin moderation panel.  
Post-MVP/Future: AI-based recommendations, browser push notifications, creator analytics, business promotions, advanced event management, collaborative planning, multilingual UI, mobile app, personalized outing planner.

#### 10. Suggested Screens for Web Version
Landing page; login/signup page; home/discovery page; city page; category page; search results page; place details page; event details page; upload content page; saved places/lists page; user profile page; creator profile page; admin dashboard.

#### 11. Constraints
Early-stage content may be low; moderation load will matter; event/place data accuracy may vary; web upload must stay simple despite media handling; avoid over-complexity in the initial product.

#### 12. Risks
Cold start (insufficient content may reduce return visits); trust issues (fake/duplicate/low-quality posts); retention risk (users may not return if content is stale); moderation burden as activity increases.

#### 13. Success Metrics
Monthly and daily active users; recommendation uploads per city; average session duration; saved places per user; comment/like rate; repeat visit rate; creator activity rate; event page engagement.

#### 14. Future Enhancements
Dedicated mobile application; AI city assistant; outing planner; women-safe recommendations; student mode; family mode; advanced city maps; verified reviews; local business promotions; group planning features.

#### 15. Conclusion
CityVibe is a web-first hyperlocal discovery platform aimed at helping users in Tier 2 and Tier 3 Indian cities discover relevant places, events, and experiences through community content and local recommendations. The responsive web app keeps initial complexity low while remaining expandable into a full mobile ecosystem later.
