
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Shield, Star, ArrowRight } from "lucide-react";
import { BackgroundPaths } from "@/components/ui/background-paths";
import Footer from "@/components/ui/animated-footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-900">
      {/* Hero Section with Animated Background */}
      <div className="relative min-h-screen flex items-center justify-center">
        <BackgroundPaths title="Share Skills, Spark Growth" />
        
        {/* Header overlay */}
        <header className="absolute top-0 left-0 right-0 z-20 container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 flex items-center justify-center rounded bg-white shadow-md overflow-hidden">
              <img src="/logo.svg" alt="SkillSpark Logo" className="w-8 h-8 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              SkillSpark
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" className="hover:bg-neutral-800 bg-white/80 text-black border-neutral-700">
                Sign In
              </Button>
            </Link>
          </div>
        </header>
      </div>

      {/* Features Section */}
      <section className="py-24 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Why Choose SkillSpark?
            </h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              Join thousands of learners who are already exchanging skills and building meaningful connections
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white text-center">Connect & Exchange</h3>
              <p className="text-neutral-300 text-center leading-relaxed">
                Find people with complementary skills and arrange mutually beneficial exchanges. Build lasting relationships while learning.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white text-center">Safe & Secure</h3>
              <p className="text-neutral-300 text-center leading-relaxed">
                Build trust through our rating system and verified user profiles. Your safety and privacy are our top priorities.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white text-center">Grow Together</h3>
              <p className="text-neutral-300 text-center leading-relaxed">
                Expand your skillset while helping others achieve their learning goals. Create a community of continuous growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-neutral-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">10K+</div>
              <div className="text-neutral-400">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">5K+</div>
              <div className="text-neutral-400">Skills Exchanged</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">4.9★</div>
              <div className="text-neutral-400">User Rating</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">100+</div>
              <div className="text-neutral-400">Cities</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              How It Works
            </h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              Get started in just three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold text-white">Create Your Profile</h3>
              <p className="text-neutral-300">
                Sign up and showcase your skills, what you want to learn, and your availability.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold text-white">Find Your Match</h3>
              <p className="text-neutral-300">
                Browse users with complementary skills and send swap requests to start learning.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold text-white">Start Learning</h3>
              <p className="text-neutral-300">
                Meet up virtually or in person and exchange skills with your new learning partner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-8 text-neutral-400 max-w-2xl mx-auto">
            Join thousands of learners who are already exchanging skills and building meaningful connections
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-white text-black hover:bg-neutral-100 px-8 py-6 text-lg font-semibold">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                Browse Skills
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              What Our Users Say
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  AP
                </div>
                <div>
                  <div className="font-semibold text-white">Arjun Patel</div>
                  <div className="text-sm text-neutral-300">Web Developer</div>
                </div>
              </div>
              <p className="text-neutral-300 italic">
                "SkillSpark helped me learn photography while teaching someone React. It's amazing how much you can learn when you teach others!"
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  PK
                </div>
                <div>
                  <div className="font-semibold text-white">Priya Kumar</div>
                  <div className="text-sm text-neutral-300">Data Scientist</div>
                </div>
              </div>
              <p className="text-neutral-300 italic">
                "I've made incredible connections and learned new skills I never thought I'd have time for. The community is fantastic!"
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  RS
                </div>
                <div>
                  <div className="font-semibold text-white">Rahul Sharma</div>
                  <div className="text-sm text-neutral-300">Designer</div>
                </div>
              </div>
              <p className="text-neutral-300 italic">
                "The platform is so intuitive and the people are genuinely helpful. I've expanded my skillset significantly!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Footer */}
      <Footer
        leftLinks={[
          { href: "/terms", label: "Terms & policies" },
          { href: "/privacy-policy", label: "Privacy policy" },
        ]}
        rightLinks={[
          
         
         
          
        ]}
        copyrightText="SkillSpark 2025. All Rights Reserved"
        barCount={23}
      />
    </div>
  );
};

export default Index;
