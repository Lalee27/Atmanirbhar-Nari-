import Hero from '../components/Hero';
import SuccessStories from '../components/SuccessStories';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen font-sans">
      <Hero />
      <SuccessStories />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
