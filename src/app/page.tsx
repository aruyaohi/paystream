// pages/index.tsx
'use client'
import React from 'react';
import Head from 'next/head';
import HeroSection from './frontend/screens/hero';
import Navbar from './frontend/components/navbar';
import PayStreamFooter from './frontend/screens/footer';

const Home: React.FC = () => {
    return (
    <div className="min-h-screen bg-transparent">
      <Head>
        <title>TeslaVest - Tesla Stock Investment Platform</title>
        <meta name="description" content="Invest in the future of Tesla electric vehicles and clean energy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Navigation */}
      <Navbar/>
      <HeroSection/>
      <PayStreamFooter/>
    </div>
  );
}

export default Home;