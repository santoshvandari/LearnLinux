import React, { useState } from 'react';
import { 
  BookOpenIcon, 
  CommandLineIcon, 
  FolderIcon, 
  CpuChipIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const DocumentationPage = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: <BookOpenIcon className="w-5 h-5" /> },
    { id: 'core-concepts', title: 'Core Concepts', icon: <CpuChipIcon className="w-5 h-5" /> },
    { id: 'file-system', title: 'File System', icon: <FolderIcon className="w-5 h-5" /> },
    { id: 'commands', title: 'Command Reference', icon: <CommandLineIcon className="w-5 h-5" /> },
  ];

  const content = {
    'getting-started': (
      <div className="space-y-6 animate-fade-in-up">
        <h1 className="text-4xl font-bold text-white mb-6">
          Getting Started with LearnLinux
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Welcome to LearnLinux, your interactive platform for mastering the Linux command line. 
          This documentation provides a comprehensive guide to using our terminal simulator and understanding standard Linux commands.
        </p>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Start</h3>
          <ol className="list-decimal list-inside space-y-4 text-gray-400">
            <li>Navigate to the <Link to="/" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Home Page</Link></li>
            <li>Click "Start Learning Now" to launch the terminal</li>
            <li>Type <code className="bg-black px-2 py-1 rounded text-green-400 font-mono text-sm border border-gray-800">help</code> to see available commands</li>
            <li>Experiment with file creation, navigation, and system tasks</li>
          </ol>
        </div>
      </div>
    ),
    'core-concepts': (
      <div className="space-y-6 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-6">Core Concepts</h1>
        
        <div className="grid gap-6">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-green-400 mb-3">The Shell</h3>
            <p className="text-gray-400">
              The shell is a program that takes commands from the keyboard and gives them to the operating system to perform.
              In this simulator, we emulate a bash-like environment.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-blue-400 mb-3">Paths</h3>
            <p className="text-gray-400 mb-2">
              <span className="text-white font-mono">Absolute Path:</span> Starts from the root directory (/)<br/>
              <span className="text-white font-mono">Relative Path:</span> Starts from your current directory
            </p>
            <div className="bg-black p-3 rounded font-mono text-sm text-gray-500 mt-2">
              /home/user/documents (Absolute)<br/>
              ./documents (Relative)
            </div>
          </div>
        </div>
      </div>
    ),
    'file-system': (
      <div className="space-y-6 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-6">File System Hierarchy</h1>
        <p className="text-gray-300 mb-6">
          Linux uses a hierarchical directory structure. Here are the common directories you'll encounter:
        </p>

        <div className="space-y-4">
          {[
            { path: '/', desc: 'Root directory - the start of the file system' },
            { path: '/home', desc: 'Contains personal directories for users' },
            { path: '/bin', desc: 'Essential command binaries (ls, cp, etc.)' },
            { path: '/etc', desc: 'System configuration files' },
            { path: '/tmp', desc: 'Temporary files' },
            { path: '/var', desc: 'Variable data files (logs, etc.)' }
          ].map((item) => (
            <div key={item.path} className="flex items-center p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
              <span className="w-24 font-mono text-yellow-400 font-bold">{item.path}</span>
              <span className="text-gray-300">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    'commands': (
      <div className="space-y-6 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-6">Command Reference</h1>
        <div className="space-y-8">
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-purple-400 mb-4">File Operations</h3>
            <div className="space-y-4">
              {[
                { cmd: 'ls', args: '-la', desc: 'List directory contents (detailed)' },
                { cmd: 'cd', args: '[dir]', desc: 'Change directory' },
                { cmd: 'pwd', args: '', desc: 'Print working directory' },
                { cmd: 'mkdir', args: '[name]', desc: 'Create a new directory' },
                { cmd: 'rmdir', args: '[dir]', desc: 'Remove empty directory' },
                { cmd: 'touch', args: '[file]', desc: 'Create an empty file' },
                { cmd: 'cp', args: '[src] [dest]', desc: 'Copy files or directories' },
                { cmd: 'mv', args: '[src] [dest]', desc: 'Move or rename files' },
                { cmd: 'rm', args: '-rf [file]', desc: 'Remove files/directories' },
                { cmd: 'ln', args: '-s [target] [link]', desc: 'Create symbolic link' },
                { cmd: 'file', args: '[filename]', desc: 'Determine file type' },
                { cmd: 'stat', args: '[file]', desc: 'Display file status' },
              ].map(c => (
                <div key={c.cmd} className="grid grid-cols-12 gap-4 border-b border-gray-800 pb-3 last:border-0 last:pb-0 items-center">
                  <div className="col-span-3 font-mono text-green-400 font-bold">{c.cmd}</div>
                  <div className="col-span-3 font-mono text-gray-500 text-sm">{c.args}</div>
                  <div className="col-span-6 text-gray-400 text-sm">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-orange-400 mb-4">System Information</h3>
            <div className="space-y-4">
               {[
                { cmd: 'whoami', args: '', desc: 'Display current user' },
                { cmd: 'pwd', args: '', desc: 'Print working directory' },
                { cmd: 'history', args: '', desc: 'Show command history' },
                { cmd: 'date', args: '', desc: 'Display system date and time' },
                { cmd: 'clear', args: '', desc: 'Clear the terminal screen' },
              ].map(c => (
                <div key={c.cmd} className="grid grid-cols-12 gap-4 border-b border-gray-800 pb-3 last:border-0 last:pb-0 items-center">
                  <div className="col-span-3 font-mono text-green-400 font-bold">{c.cmd}</div>
                  <div className="col-span-3 font-mono text-gray-500 text-sm">{c.args}</div>
                  <div className="col-span-6 text-gray-400 text-sm">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-4">File Permissions</h3>
            <div className="space-y-4">
              {[
                { cmd: 'chmod', args: '[mode] [file]', desc: 'Change file permissions' },
                { cmd: 'chown', args: '[user] [file]', desc: 'Change file owner' },
                { cmd: 'umask', args: '[mask]', desc: 'Set default file permissions' },
              ].map(c => (
                 <div key={c.cmd} className="grid grid-cols-12 gap-4 border-b border-gray-800 pb-3 last:border-0 last:pb-0 items-center">
                  <div className="col-span-3 font-mono text-green-400 font-bold">{c.cmd}</div>
                  <div className="col-span-3 font-mono text-gray-500 text-sm">{c.args}</div>
                  <div className="col-span-6 text-gray-400 text-sm">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-red-400 mb-4">Process Management</h3>
            <div className="space-y-4">
              {[
                { cmd: 'ps', args: 'aux', desc: 'List running processes' },
                { cmd: 'top', args: '', desc: 'Display processes in real-time' },
                { cmd: 'kill', args: '[pid]', desc: 'Terminate a process' },
                { cmd: 'bg', args: '', desc: 'Send process to background' },
                { cmd: 'fg', args: '', desc: 'Bring process to foreground' },
              ].map(c => (
                 <div key={c.cmd} className="grid grid-cols-12 gap-4 border-b border-gray-800 pb-3 last:border-0 last:pb-0 items-center">
                  <div className="col-span-3 font-mono text-green-400 font-bold">{c.cmd}</div>
                  <div className="col-span-3 font-mono text-gray-500 text-sm">{c.args}</div>
                  <div className="col-span-6 text-gray-400 text-sm">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Networking</h3>
            <div className="space-y-4">
              {[
                { cmd: 'ping', args: '[host]', desc: 'Test network connectivity' },
                { cmd: 'curl', args: '[url]', desc: 'Transfer data from/to a server' },
                { cmd: 'wget', args: '[url]', desc: 'Download files from web' },
                { cmd: 'ifconfig', args: '', desc: 'Configure network interface' },
                 { cmd: 'ssh', args: '[user]@[host]', desc: 'Secure Shell remote login' },
              ].map(c => (
                 <div key={c.cmd} className="grid grid-cols-12 gap-4 border-b border-gray-800 pb-3 last:border-0 last:pb-0 items-center">
                  <div className="col-span-3 font-mono text-green-400 font-bold">{c.cmd}</div>
                  <div className="col-span-3 font-mono text-gray-500 text-sm">{c.args}</div>
                  <div className="col-span-6 text-gray-400 text-sm">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Text Processing</h3>
            <div className="space-y-4">
              {[
                { cmd: 'cat', args: '[file]', desc: 'Display file contents' },
                { cmd: 'less', args: '[file]', desc: 'View file with pagination' },
                { cmd: 'head', args: '-n [num] [file]', desc: 'Show first N lines' },
                { cmd: 'tail', args: '-n [num] [file]', desc: 'Show last N lines' },
                { cmd: 'grep', args: '[pattern] [file]', desc: 'Search for patterns in files' },
                { cmd: 'sed', args: '', desc: 'Stream editor for text transformation' },
                { cmd: 'awk', args: '', desc: 'Pattern scanning and processing' },
                { cmd: 'wc', args: '[file]', desc: 'Count lines, words, and characters' },
              ].map(c => (
                 <div key={c.cmd} className="grid grid-cols-12 gap-4 border-b border-gray-800 pb-3 last:border-0 last:pb-0 items-center">
                  <div className="col-span-3 font-mono text-green-400 font-bold">{c.cmd}</div>
                  <div className="col-span-3 font-mono text-gray-500 text-sm">{c.args}</div>
                  <div className="col-span-6 text-gray-400 text-sm">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-pink-400 mb-4">Search & Find</h3>
            <div className="space-y-4">
              {[
                { cmd: 'find', args: '[path] -name [pattern]', desc: 'Search for files and directories' },
                { cmd: 'locate', args: '[filename]', desc: 'Find files by name (uses database)' },
                { cmd: 'which', args: '[command]', desc: 'Show full path of commands' },
                { cmd: 'whereis', args: '[command]', desc: 'Locate binary, source, and manual' },
              ].map(c => (
                 <div key={c.cmd} className="grid grid-cols-12 gap-4 border-b border-gray-800 pb-3 last:border-0 last:pb-0 items-center">
                  <div className="col-span-3 font-mono text-green-400 font-bold">{c.cmd}</div>
                  <div className="col-span-3 font-mono text-gray-500 text-sm">{c.args}</div>
                  <div className="col-span-6 text-gray-400 text-sm">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-emerald-400 mb-4">Archiving & Compression</h3>
            <div className="space-y-4">
              {[
                { cmd: 'tar', args: '-cvf [archive.tar] [files]', desc: 'Create tar archive' },
                { cmd: 'tar', args: '-xvf [archive.tar]', desc: 'Extract tar archive' },
                { cmd: 'gzip', args: '[file]', desc: 'Compress files' },
                { cmd: 'gunzip', args: '[file.gz]', desc: 'Decompress gzip files' },
                { cmd: 'zip', args: '[archive.zip] [files]', desc: 'Create zip archive' },
                { cmd: 'unzip', args: '[archive.zip]', desc: 'Extract zip archive' },
              ].map(c => (
                 <div key={c.cmd + c.args} className="grid grid-cols-12 gap-4 border-b border-gray-800 pb-3 last:border-0 last:pb-0 items-center">
                  <div className="col-span-3 font-mono text-green-400 font-bold">{c.cmd}</div>
                  <div className="col-span-3 font-mono text-gray-500 text-sm">{c.args}</div>
                  <div className="col-span-6 text-gray-400 text-sm">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-amber-400 mb-4">Disk Usage</h3>
            <div className="space-y-4">
              {[
                { cmd: 'df', args: '-h', desc: 'Show disk space usage' },
                { cmd: 'du', args: '-sh [dir]', desc: 'Show directory size' },
                { cmd: 'free', args: '-h', desc: 'Display memory usage' },
                { cmd: 'mount', args: '', desc: 'Mount file systems' },
                { cmd: 'umount', args: '[device]', desc: 'Unmount file systems' },
              ].map(c => (
                 <div key={c.cmd} className="grid grid-cols-12 gap-4 border-b border-gray-800 pb-3 last:border-0 last:pb-0 items-center">
                  <div className="col-span-3 font-mono text-green-400 font-bold">{c.cmd}</div>
                  <div className="col-span-3 font-mono text-gray-500 text-sm">{c.args}</div>
                  <div className="col-span-6 text-gray-400 text-sm">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-violet-400 mb-4">System Monitoring</h3>
            <div className="space-y-4">
              {[
                { cmd: 'htop', args: '', desc: 'Interactive process viewer' },
                { cmd: 'uptime', args: '', desc: 'Show system uptime' },
                { cmd: 'uname', args: '-a', desc: 'Show system information' },
                { cmd: 'df', args: '-i', desc: 'Show inode usage' },
                { cmd: 'vmstat', args: '', desc: 'Report virtual memory statistics' },
              ].map(c => (
                 <div key={c.cmd + c.args} className="grid grid-cols-12 gap-4 border-b border-gray-800 pb-3 last:border-0 last:pb-0 items-center">
                  <div className="col-span-3 font-mono text-green-400 font-bold">{c.cmd}</div>
                  <div className="col-span-3 font-mono text-gray-500 text-sm">{c.args}</div>
                  <div className="col-span-6 text-gray-400 text-sm">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-rose-400 mb-4">User Management</h3>
            <div className="space-y-4">
              {[
                { cmd: 'useradd', args: '[username]', desc: 'Create a new user' },
                { cmd: 'userdel', args: '[username]', desc: 'Delete a user' },
                { cmd: 'passwd', args: '[username]', desc: 'Change user password' },
                { cmd: 'su', args: '[username]', desc: 'Switch user' },
                { cmd: 'sudo', args: '[command]', desc: 'Execute command as superuser' },
                { cmd: 'groups', args: '[username]', desc: 'Show user groups' },
              ].map(c => (
                 <div key={c.cmd} className="grid grid-cols-12 gap-4 border-b border-gray-800 pb-3 last:border-0 last:pb-0 items-center">
                  <div className="col-span-3 font-mono text-green-400 font-bold">{c.cmd}</div>
                  <div className="col-span-3 font-mono text-gray-500 text-sm">{c.args}</div>
                  <div className="col-span-6 text-gray-400 text-sm">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-gray-800 rounded-lg text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed md:relative top-0 left-0 h-screen w-64 bg-gray-900 border-r border-gray-800 
        transform transition-transform duration-300 z-40 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex-shrink-0">
          <Link to="/" className="flex items-center space-x-2 w-full group">
             <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                <CommandLineIcon className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-xl font-bold text-white transition-colors">
                LearnLinux
              </span>
          </Link>
        </div>
          
        <nav className="space-y-2 px-6 flex-1 overflow-y-auto">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeSection === section.id 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              {section.icon}
              <span className="font-medium text-sm">{section.title}</span>
              {activeSection === section.id && (
                <ChevronRightIcon className="w-4 h-4 ml-auto" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 flex-shrink-0">
          <div className="bg-gray-900/50 rounded-lg p-4 text-xs text-gray-500 border border-gray-800">
            <p>Documentation v1.0</p>
            <p className="mt-1">© 2026 LearnLinux</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto w-full">
        <div className="max-w-4xl mx-auto px-6 py-12 md:px-12 md:py-16">
          {content[activeSection]}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DocumentationPage;
