'use client';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-dark via-slate-900 to-dark">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-5xl font-bold gradient-text mb-4">
          PhilzBab Agent
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          AI-Powered 3D Responsive Website Builder
        </p>
        
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 border border-slate-700 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-semibold text-white">AI Chat</h3>
                <p className="text-sm text-gray-400">Natural language descriptions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎨</span>
              <div>
                <h3 className="font-semibold text-white">3D Generation</h3>
                <p className="text-sm text-gray-400">Automatic code creation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="font-semibold text-white">Live Preview</h3>
                <p className="text-sm text-gray-400">Real-time rendering</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <h3 className="font-semibold text-white">Responsive</h3>
                <p className="text-sm text-gray-400">All device support</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            PhilzBab Agent v1.0.0 | Built with Next.js, Three.js & React
          </p>
          <p className="text-gray-500 text-xs">
            📍 Status: Development Mode
          </p>
        </div>
      </div>
    </div>
  );
}
