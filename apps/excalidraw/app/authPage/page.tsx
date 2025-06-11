"use client"
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, ArrowRight, UserPlus } from 'lucide-react';
import {useRef} from "react"
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { useRouter } from 'next/navigation';

function HandleSignin() {
    const router = useRouter();
    const userNameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);

  const [currentPage, setCurrentPage] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [signinData, setSigninData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [signupData, setSignupData] = useState({
    name: '',
    username: '',
    password: ''
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSigninChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSigninData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSigninSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
        username: userNameRef.current?.value,
        password: passwordRef.current?.value
    }
    const response = await axios.post(`${BACKEND_URL}/signin`, newUser)

    if(response.status === 200){
        const data = response.data;
        localStorage.setItem("token", data.token)
        router.push("/")
    }
  };

  const handleSignupSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
         name : nameRef.current?.value,
         username : userNameRef.current?.value,
         password : passwordRef.current?.value
    }
    console.log(newUser);

    const response = await axios.post(`${BACKEND_URL}/signup`, newUser)
    if(response.status === 200){
        const data = response.data;
        localStorage.setItem("token", data.token);
        router.push("/")
    }
  };

  const switchToSignup = () => {
    setCurrentPage('signup');
    setShowPassword(false);
    setFocusedField(null);
  };

  const switchToSignin = () => {
    setCurrentPage('signin');
    setShowPassword(false);
    setFocusedField(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {currentPage === 'signin' ? (
            <>
              {/* Signin Logo/Brand Section */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/25">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600">Sign in to your account to continue</p>
              </div>

              {/* Signin Form */}
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/20 p-8">
                <form onSubmit={handleSigninSubmit} className="space-y-6">
                  {/* Username Field */}
                  <div className="space-y-2">
                    <label htmlFor="signin-username" className="text-sm font-semibold text-gray-700">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className={`w-5 h-5 transition-colors duration-200 ${
                          focusedField === 'signin-username' ? 'text-blue-500' : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        type="text"
                        id="signin-username"
                        name="username"
                        autoComplete='username'
                        ref={userNameRef}
                        value={signinData.username}
                        onChange={handleSigninChange}
                        onFocus={() => setFocusedField('signin-username')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder="Enter your username"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="signin-password" className="text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className={`w-5 h-5 transition-colors duration-200 ${
                          focusedField === 'signin-password' ? 'text-blue-500' : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="signin-password"
                        name="password"
                        autoComplete='current-password'
                        ref={passwordRef}
                        value={signinData.password}
                        onChange={handleSigninChange}
                        onFocus={() => setFocusedField('signin-password')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={signinData.rememberMe}
                        onChange={handleSigninChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <a 
                      href="#" 
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                    >
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="group w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white/50"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                  </button>
                </form>

                {/* Divider */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-600">
                
                    <button 
                      onClick={switchToSignup}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 underline-offset-4 hover:underline"
                    >
                      Sign up here
                    </button>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Signup Logo/Brand Section */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/25">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-600">Join us today and get started</p>
              </div>

              {/* Signup Form */}
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/20 p-8">
                <form onSubmit={handleSignupSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="signup-name" className="text-sm font-semibold text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className={`w-5 h-5 transition-colors duration-200 ${
                          focusedField === 'signup-name' ? 'text-blue-500' : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        type="text"
                        id="signup-name"
                        name="name"
                        ref={nameRef}
                        value={signupData.name}
                        onChange={handleSignupChange}
                        onFocus={() => setFocusedField('signup-name')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  {/* Username Field */}
                  <div className="space-y-2">
                    <label htmlFor="signup-username" className="text-sm font-semibold text-gray-700">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className={`w-5 h-5 transition-colors duration-200 ${
                          focusedField === 'signup-username' ? 'text-blue-500' : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        type="text"
                        id="signup-username"
                        name="username"
                        ref={userNameRef}
                        value={signupData.username}
                        onChange={handleSignupChange}
                        onFocus={() => setFocusedField('signup-username')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder="Choose a username"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="signup-password" className="text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className={`w-5 h-5 transition-colors duration-200 ${
                          focusedField === 'signup-password' ? 'text-blue-500' : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="signup-password"
                        name="password"
                        ref={passwordRef}
                        value={signupData.password}
                        onChange={handleSignupChange}
                        onFocus={() => setFocusedField('signup-password')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder="Create a strong password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="group w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white/50"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                  </button>
                </form>

                {/* Divider */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <button 
                      onClick={switchToSignin}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 underline-offset-4 hover:underline"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
                     

export default HandleSignin;
                    