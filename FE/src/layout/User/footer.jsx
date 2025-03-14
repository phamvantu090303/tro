import logo from "../../assets/logo/logo.svg";
import twitter from "../../assets/icon/twitter.png";
import linker from "../../assets/icon/linker.png";

function Footer() {
  return (
    <footer className="w-full bg-[#1C1E3A] text-white py-8">
      <div className="w-full px-4 lg:px-[150px] mx-auto">
        <div className="flex flex-wrap justify-between">
          <div className="mb-6">
            <img src={logo} className="h-10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 text-sm">
            <div>
              <h3 className="font-semibold text-xl mb-8">About Us</h3>
              <ul className="space-y-1">
                <li className="text-base">Company Overview</li>
                <li className="text-base">Our Mission & Values</li>
                <li className="text-base">Careers</li>
                <li className="text-base">Blog</li>
                <li className="text-base">Press Releases</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-xl  mb-8">Customer Service</h3>
              <ul className="space-y-1">
                <li className="text-base">Contact Us</li>
                <li className="text-base">FAQs</li>
                <li className="text-base">Live Chat</li>
                <li className="text-base">Cancellation Policy</li>
                <li className="text-base">Booking Policies</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-8">Explore</h3>
              <ul className="space-y-1">
                <li className="text-base">Destinations</li>
                <li className="text-base">Special Offers</li>
                <li className="text-base">Last-Minute Deals</li>
                <li className="text-base">Travel Guides</li>
                <li className="text-base">Blog & Travel Tips</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-8">Support</h3>
              <ul className="space-y-1">
                <li className="text-base">Privacy Policy</li>
                <li className="text-base">Terms & Conditions</li>
                <li className="text-base">Accessibility</li>
                <li className="text-base">Feedback & Suggestions</li>
                <li className="text-base">Sitemap</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-8">Membership</h3>
              <ul className="space-y-1">
                <li className="text-base">Loyalty Program</li>
                <li className="text-base">Unlock Exclusive Offers</li>
                <li className="text-base">Rewards & Benefits</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Line */}
        <div className="border-t border-gray-600 my-6"></div>

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© 2024 Ascenda. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0 justify-center md:justify-start">
            <img src={linker} alt="Linker icon" />
            <img src={twitter} alt="Twitter icon" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
