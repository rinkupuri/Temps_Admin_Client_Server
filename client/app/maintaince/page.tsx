"use client"
import React from "react";
import Lottie from "lottie-react";
import { Wrench, Clock, Mail, AlertCircle } from "lucide-react";
import maintenanceAnimation from "@/components/maintaince.json";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-indigo-50">
        <div className="flex flex-col md:flex-row items-stretch">
          {/* Animation Section */}
          <div className="w-full md:w-5/12 p-8 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-50">
            <div className="w-full max-w-md transform hover:scale-105 transition-transform duration-300">
              <Lottie
                animationData={maintenanceAnimation}
                loop={true}
                className="w-full h-full"
                style={{ minHeight: "300px" }}
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full md:w-7/12 p-10 bg-white">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <AlertCircle className="w-8 h-8 text-indigo-600 animate-pulse" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Under Maintenance
                </h1>
              </div>

              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                We're currently upgrading our systems to bring you an even
                better experience. Thank you for your patience while we make
                these improvements.
              </p>

              {/* Features */}
              <div className="space-y-8 mb-10">
                <div className="flex items-start space-x-5 group">
                  <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-2xl group-hover:bg-indigo-200 transition-colors duration-200">
                    <Wrench className="w-7 h-7 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      System Upgrade
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      We're implementing cutting-edge features to enhance your
                      experience
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-5 group">
                  <div className="flex-shrink-0 bg-purple-100 p-3 rounded-2xl group-hover:bg-purple-200 transition-colors duration-200">
                    <Clock className="w-7 h-7 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Estimated Time
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      We expect to be back online within 2 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-5 group">
                  <div className="flex-shrink-0 bg-blue-100 p-3 rounded-2xl group-hover:bg-blue-200 transition-colors duration-200">
                    <Mail className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Stay Updated
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      For urgent inquiries, please contact{" "}
                      <a
                        href="mailto:support@example.com"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        support@example.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Updates */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                <h4 className="text-xl font-semibold text-indigo-900 mb-4">
                  Live Status Updates
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-indigo-900">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p>Database optimization in progress</p>
                  </div>
                  <div className="flex items-center space-x-3 text-indigo-900">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <p>Security patches being applied</p>
                  </div>
                  <div className="flex items-center space-x-3 text-indigo-900">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <p>System performance upgrades</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
