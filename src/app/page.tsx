'use client'
import React,{useEffect} from 'react';
import Head from 'next/head';
import HeroSection from './frontend/screens/hero';
import Navbar from './frontend/components/navbar';
import PayStreamFooter from './frontend/screens/footer';
import { useUser } from "@civic/auth/react";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {

  //deconstruct the user object from civic here...
  const { user } = useUser();
    const router = useRouter()
  
    useEffect(() => {
      if (user) {
        console.log("Logged in user:", user);
        router.push('/dashboard')
      }
    }, [user,router]);

    return (
    <div className="min-h-screen bg-transparent">
      <Head>
        <title>Paystream - Crypto Payroll Platform for making payroll payments</title>
        <meta name="description" content="Organise and make company payments using paystream" />
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