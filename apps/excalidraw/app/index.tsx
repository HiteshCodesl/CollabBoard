"use client"
import React, { useState } from 'react';
import { Users, Plus, ArrowRight, Zap, Shield, Globe, X, Palette, MessageSquare, Download, Star, Loader2,  } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { BACKEND_URL } from './config';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50  backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all duration-300 scale-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

const WhiteboardPreview = dynamic(() => import('@/app/preview'), {
  ssr: false
})

function App() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomSlug, setRoomSlug] = useState('');
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const createRoomRef = useRef<HTMLInputElement>(null)
  const joinRoomRef = useRef<HTMLInputElement>(null);

 const handleCreateRoom = async(e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (roomSlug.trim()) {
      setShowCreateModal(false);
      setRoomSlug("");
    }
    const name = createRoomRef.current?.value;

     const response = await axios.post(`${BACKEND_URL}/room`, {name}, {
      headers: {
        "Authorization": localStorage.getItem("token")
      }
  });

  if(response.status === 200){
      const data = response.data;
      const roomId = data.roomId;
      router.push(`/canvas/${roomId}`)
      setShowCreateModal(false);
      setLoading(false);
     }
  };

const handleJoinRoom = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (roomSlug.trim()) {
      setShowCreateModal(false);
      setRoomId("");
    }
  
    const id = joinRoomRef.current?.value;
    const response = await axios.post(`${BACKEND_URL}/room/id`, {id},{
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
    
    if(response.status === 200){
      setLoading(false);
      const data = response.data;
      const roomId = data.roomId;
       router.push(`/canvas/${roomId}`)
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-6 bg-white/90 backdrop-blur-md border-b border-blue-100">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-800 bg-clip-text text-transparent">
                  CollabBoard
                </span>
                <p className="text-sm text-gray-600 -mt-1">Whiteboard Collaborative App</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">Pricing</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">Contact</a>
              <Link href="/authPage"><button  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors duration-200">
                Sign In
              </button></Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 py-10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Star className="w-4 h-4 mr-2" />
              Trusted by 50,000+ teams worldwide
            </div>
            
            <h1 className="hero-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 sm:mb-8 leading-tight px-4">
              Whiteboard Collaborative App
            </h1>
            
             <p className="hero-text text-base sm:text-lg lg:text-xl text-gray-700 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              Transform your ideas into reality with our powerful collaborative whiteboard platform. 
              Create, brainstorm, and innovate together in real-time, no matter where your team is located.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button
                onClick={() => setShowCreateModal(true)}
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-5 rounded-2xl font-semibold text-lg shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
              >
                <Plus className="w-6 h-6" />
                <span>Create New Room</span>
                {loading ? <Loader2 /> :<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />}
              </button>
              
              <button
                onClick={() => setShowJoinModal(true)}
                className="group bg-white hover:bg-gray-50 border-2 border-blue-200 hover:border-blue-300 text-blue-700 px-10 py-5 rounded-2xl font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
              >
                <Users className="w-6 h-6" />
                <span>Join Existing Room</span>
                {loading ? <Loader2 /> : <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />}
              </button>
            </div>

            {/* Demo Preview */}
            <WhiteboardPreview />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Everything you need to collaborate
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Powerful features designed to make your team collaboration seamless and productive.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white border border-blue-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-time Collaboration</h3>
                <p className="text-gray-600 leading-relaxed">See changes instantly as your team works together. No delays, no conflicts, just seamless collaboration.</p>
              </div>
              
              <div className="bg-white border border-blue-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Enterprise Security</h3>
                <p className="text-gray-600 leading-relaxed">Bank-level encryption and security protocols keep your sensitive data and ideas completely protected.</p>
              </div>
              
              <div className="bg-white border border-blue-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Global Access</h3>
                <p className="text-gray-600 leading-relaxed">Access your whiteboards from anywhere in the world, on any device, at any time.</p>
              </div>

              <div className="bg-white border border-blue-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Integrated Chat</h3>
                <p className="text-gray-600 leading-relaxed">Built-in messaging and video calls keep your team connected while you work on the whiteboard.</p>
              </div>

              <div className="bg-white border border-blue-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Download className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Export & Share</h3>
                <p className="text-gray-600 leading-relaxed">Export your work in multiple formats and share with stakeholders who arent on the platform.</p>
              </div>

              <div className="bg-white border border-blue-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Palette className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Rich Drawing Tools</h3>
                <p className="text-gray-600 leading-relaxed">Professional drawing tools, shapes, templates, and assets to bring your ideas to life.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="px-6 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Simple, transparent pricing
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the plan that works best for your team. All plans include our core collaboration features.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <p className="text-gray-600 mb-6">Perfect for small teams getting started</p>
                <div className="text-4xl font-bold text-gray-900 mb-6">$0<span className="text-lg text-gray-600">/month</span></div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Up to 3 team members
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    5 whiteboards
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Basic drawing tools
                  </li>
                </ul>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-colors duration-200">
                  Get Started Free
                </button>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 shadow-xl text-white relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-400 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-blue-100 mb-6">Best for growing teams and businesses</p>
                <div className="text-4xl font-bold mb-6">$12<span className="text-lg text-blue-200">/month</span></div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Up to 25 team members
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Unlimited whiteboards
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Advanced tools & templates
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Video calls & chat
                  </li>
                </ul>
                <button className="w-full bg-white text-blue-600 hover:bg-gray-50 py-3 rounded-xl font-medium transition-colors duration-200">
                  Start Pro Trial
                </button>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-6">For large organizations with advanced needs</p>
                <div className="text-4xl font-bold text-gray-900 mb-6">Custom</div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Unlimited team members
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Advanced security & compliance
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Priority support
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Custom integrations
                  </li>
                </ul>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors duration-200">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to transform your collaboration?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of teams who have already revolutionized their workflow with CollabBoard.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Start Free Today
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200">
                Schedule Demo
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-16 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold">CollabBoard</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  The ultimate whiteboard collaborative app for modern teams.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">© 2024 CollabBoard. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Create Room Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Room</h2>
            <p className="text-gray-600">Choose a unique name for your whiteboard room</p>
          </div>
          
          <form onSubmit={handleCreateRoom} className="space-y-6">
            <div>
              <label htmlFor="roomSlug" className="block text-sm font-medium text-gray-700 mb-2">
                Room Name
              </label>
              <input
                type="text"
                id="roomSlug"
                ref={createRoomRef}
                value={roomSlug}
                onChange={(e) => setRoomSlug(e.target.value)}
                placeholder="my-awesome-project"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Use letters, numbers, and hyphens. This will be part of your room URL.
              </p>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              >
                Create Room
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Join Room Modal */}
      <Modal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)}>
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Room</h2>
            <p className="text-gray-600">Enter the room ID to join an existing whiteboard</p>
          </div>
          
          <form onSubmit={handleJoinRoom} className="space-y-6">
            <div>
             <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-2">
                Room ID
              </label>
              <input
                type="text"
                id="roomId"
                value={roomId}
                ref={joinRoomRef}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="abc123def456"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Ask the room creator for the room ID to join their whiteboard.
              </p>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setShowJoinModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              >
                Join Room
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default App;