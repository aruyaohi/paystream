'use client'
import React,{useEffect} from 'react';
import Head from 'next/head';
import HeroSection from './frontend/screens/hero';
import Navbar from './frontend/components/navbar';
import PayStreamFooter from './frontend/screens/footer';
import { useUser } from "@civic/auth-web3/react";
import { useRouter } from "next/navigation";
// import { userHasWallet } from '@civic/auth-web3';

const Home: React.FC = () => {

  //deconstruct the user object from civic here...
  const userContext = useUser();
    const router = useRouter()
  
    useEffect(() => {
      if (userContext.user) {
        router.push('/dashboard')
        // if(userContext.user && !userHasWallet(userContext)){
        //   userContext.createWallet()
        //   console.log(userContext.user);
        // }
      }
    }, [userContext]);

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