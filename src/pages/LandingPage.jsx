import React from 'react';
import Home from './Home';
import About from './About';
import Education from './Education';
import Skills from './Skills';
import MyWork from './MyWork';
import Youtube from './Youtube';
import Content from './Content';
import Service from './Service';
import Navbar from '../components/Navbar';

const LandingPage = () => {
    return (
        <>
            <main className="snap-wrapper">
                <Home />
                <About />
                <Education />
                <Skills />
                <MyWork />
                <Youtube />
                <Service />
                <Content />
            </main>
            <Navbar />
        </>
    );
};

export default LandingPage;
