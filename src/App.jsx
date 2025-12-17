
import React from 'react';
import AboutGbv from './AboutGbv.jsx'
import './App.css'
import Quiz from './Quiz.jsx'
import SiteHome from './SiteHome.jsx'
import Myths from './myths.jsx'
import SafeCircle from './SafeCircle.jsx'
import GetHelp from './GetHelp.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import ResponsePrevention from './ResponsePrevention.jsx'
import {createBrowserRouter,createRoutesFromElements,Route,Link, RouterProvider, Outlet} from 'react-router-dom'
import DefaultRouteErrors from './DefaultRouteErrors.jsx'
import HomeTab from './safeCircleTabs/HomeTab.jsx'
import DefaultForumErrors from './safeCircleTabs/DefaultForumErrors.jsx'
import StoriesTab from './safeCircleTabs/StoriesTab.jsx'
import EventsTab from './safeCircleTabs/EventsTab.jsx'
import LearnTab from './safeCircleTabs/LearnTab.jsx'
import LearningModule from './safeCircleTabs/LearningModule.jsx'
import ChatBot from './safeCircleTabs/chatBot.jsx'
import Story from './safeCircleTabs/Story.jsx'
import Event from './safeCircleTabs/Event.jsx'
import AboutUS from './aboutUs.jsx'
import UserProfile from './UserProfile.jsx'
import { AuthProvider } from './AuthContext.jsx'

// App Layout
const AppLayout = () => {
    return <Outlet />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route index element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="home" element={<SiteHome />} />
      <Route path="profile" element={<UserProfile />} />
      <Route path="about" element={<AboutGbv />} />
      <Route path="aboutGBV" element={<AboutGbv />} />
      <Route path="response-prevention" element={<ResponsePrevention />} />
      <Route path="getHelp" element={<GetHelp />} />
      <Route path="myths&facts" element={<Myths />} />
      <Route path="aboutUs" element={<AboutUS />} />
      <Route path="quiz" element={<Quiz />} />
      <Route path="forum" element={<SafeCircle />}>
        <Route index element={<HomeTab />} />
        <Route path="stories" element={<StoriesTab />} />
        <Route path="stories/:id" element={<Story />} />
        <Route path="events" element={<EventsTab />} />
        <Route path="events/:id" element={<Event />} />
        <Route path="learn" element={<LearnTab />} />
        <Route path="learn/:id" element={<LearningModule />} />
        <Route path="chatBot" element={<ChatBot />} />
        <Route path="*" element={<DefaultForumErrors />} />
      </Route>

      <Route path="*" element={<DefaultRouteErrors />} />
    </Route>
  )
)

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App
