

const About = () => {
  return (
    <div className="container mx-auto px-4">
      <section className="py-8">
        <h1 className="text-4xl font-bold text-center mb-4">About Us</h1>
        <p className="text-xg text-center mb-8">
          Learn more about our commitment to helping individuals find their perfect home and Manage their Properties at their finger tips.
        </p>
        
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-1/2 px-4 mb-8">
            <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
            <p>
              Our mission is to streamline the real estate process, making it easier for people to buy, sell, and rent properties. We believe that finding a dream home should be a joy, not a burden.
            </p>
          </div>
          <div className="w-full lg:w-1/2 px-4 mb-8">
            <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
            <p>
              We envision a world where the next step in your life journey is just a click away. We are dedicated to providing innovative solutions that empower our clients in the real estate market.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-6">Meet Our Team</h2>
        <div className="flex flex-wrap justify-center items-center -mx-2">
          {/* Team member card */}
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img className="w-full" src="./ceo.jpg" alt="Team member" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2"></h3>
                <p className="text-gray-600 text-sm">CEO & Founder</p>
              </div>
            </div>
          </div>
          {/* Add more team member cards as needed */}
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img className="w-full" src="./cof.jpg" alt="Team member" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2"></h3>
                <p className="text-gray-600 text-sm">Founder</p>
              </div>
            </div>
          </div>
        {/* {more team member} */}
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img className="w-full" src="./cof2.jpg" alt="Team member" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2"></h3>
                <p className="text-gray-600 text-sm"> Founder</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;