import Hero from '../components/Hero';
import SuccessStories from '../components/SuccessStories';
import CTA from '../components/CTA';

const Home = () => {
  return (
    <div className="min-h-screen font-sans">
      <Hero />
      <SuccessStories />
      <CTA />
    </div>
  );
};

export default Home;
