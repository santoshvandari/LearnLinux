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

// Command Reference Data
const commandCategories = [
  {
    title: 'File Operations',
    color: 'text-purple-400',
    commands: [
      { cmd: 'ls', args: '-la', desc: 'List directory contents (detailed)' },
      { cmd: 'cd', args: '[dir]', desc: 'Change directory' },
      { cmd: 'pwd', args: '', desc: 'Print working directory' },
      { cmd: 'mkdir', args: '-p [path]', desc: 'Create directory (with parents)' },
      { cmd: 'rmdir', args: '[dir]', desc: 'Remove empty directory' },
      { cmd: 'touch', args: '[file]', desc: 'Create an empty file' },
      { cmd: 'cp', args: '-r [src] [dest]', desc: 'Copy files or directories' },
      { cmd: 'mv', args: '[src] [dest]', desc: 'Move or rename files' },
      { cmd: 'rm', args: '-rf [file]', desc: 'Remove files/directories' },
      { cmd: 'ln', args: '-s [target] [link]', desc: 'Create symbolic link' },
      { cmd: 'file', args: '[filename]', desc: 'Determine file type' },
      { cmd: 'stat', args: '[file]', desc: 'Display file status' },
    ]
  },
  {
    title: 'Text Processing',
    color: 'text-cyan-400',
    commands: [
      { cmd: 'cat', args: '[file]', desc: 'Display file contents' },
      { cmd: 'less', args: '[file]', desc: 'View file with pagination' },
      { cmd: 'more', args: '[file]', desc: 'View file one screen at a time' },
      { cmd: 'head', args: '-n [num] [file]', desc: 'Show first N lines' },
      { cmd: 'tail', args: '-f [file]', desc: 'Follow file updates in real-time' },
      { cmd: 'grep', args: '[pattern] [file]', desc: 'Search for patterns in files' },
      { cmd: 'sed', args: 's/old/new/g [file]', desc: 'Stream editor for text transformation' },
      { cmd: 'awk', args: '{print $1} [file]', desc: 'Pattern scanning and processing' },
      { cmd: 'wc', args: '-l [file]', desc: 'Count lines, words, and characters' },
      { cmd: 'sort', args: '[file]', desc: 'Sort lines of text files' },
      { cmd: 'uniq', args: '[file]', desc: 'Remove duplicate lines' },
      { cmd: 'diff', args: '[file1] [file2]', desc: 'Compare files line by line' },
    ]
  },
  {
    title: 'File Permissions',
    color: 'text-blue-400',
    commands: [
      { cmd: 'chmod', args: '755 [file]', desc: 'Change file permissions' },
      { cmd: 'chown', args: '[user]:[group] [file]', desc: 'Change file owner' },
      { cmd: 'chgrp', args: '[group] [file]', desc: 'Change group ownership' },
      { cmd: 'umask', args: '[mask]', desc: 'Set default file permissions' },
    ]
  },
  {
    title: 'Search & Find',
    color: 'text-pink-400',
    commands: [
      { cmd: 'find', args: '[path] -name [pattern]', desc: 'Search for files and directories' },
      { cmd: 'locate', args: '[filename]', desc: 'Find files by name (uses database)' },
      { cmd: 'which', args: '[command]', desc: 'Show full path of commands' },
      { cmd: 'whereis', args: '[command]', desc: 'Locate binary, source, and manual' },
      { cmd: 'type', args: '[command]', desc: 'Display command type' },
    ]
  },
  {
    title: 'Process Management',
    color: 'text-red-400',
    commands: [
      { cmd: 'ps', args: 'aux', desc: 'List all running processes' },
      { cmd: 'top', args: '', desc: 'Display processes in real-time' },
      { cmd: 'htop', args: '', desc: 'Interactive process viewer' },
      { cmd: 'kill', args: '-9 [pid]', desc: 'Force terminate a process' },
      { cmd: 'killall', args: '[name]', desc: 'Kill processes by name' },
      { cmd: 'bg', args: '', desc: 'Send process to background' },
      { cmd: 'fg', args: '', desc: 'Bring process to foreground' },
      { cmd: 'jobs', args: '', desc: 'List background jobs' },
      { cmd: 'nohup', args: '[command] &', desc: 'Run command immune to hangups' },
    ]
  },
  {
    title: 'System Information',
    color: 'text-orange-400',
    commands: [
      { cmd: 'whoami', args: '', desc: 'Display current user' },
      { cmd: 'hostname', args: '', desc: 'Show system hostname' },
      { cmd: 'uname', args: '-a', desc: 'Show system information' },
      { cmd: 'uptime', args: '', desc: 'Show system uptime' },
      { cmd: 'date', args: '', desc: 'Display system date and time' },
      { cmd: 'cal', args: '', desc: 'Display calendar' },
      { cmd: 'w', args: '', desc: 'Show who is logged in' },
      { cmd: 'history', args: '', desc: 'Show command history' },
      { cmd: 'clear', args: '', desc: 'Clear the terminal screen' },
    ]
  },
  {
    title: 'Disk Usage',
    color: 'text-amber-400',
    commands: [
      { cmd: 'df', args: '-h', desc: 'Show disk space usage' },
      { cmd: 'du', args: '-sh [dir]', desc: 'Show directory size' },
      { cmd: 'free', args: '-h', desc: 'Display memory usage' },
      { cmd: 'fdisk', args: '-l', desc: 'List disk partitions' },
      { cmd: 'mount', args: '', desc: 'Mount file systems' },
      { cmd: 'umount', args: '[device]', desc: 'Unmount file systems' },
    ]
  },
  {
    title: 'Archiving & Compression',
    color: 'text-emerald-400',
    commands: [
      { cmd: 'tar', args: '-cvf [archive.tar] [files]', desc: 'Create tar archive' },
      { cmd: 'tar', args: '-xvf [archive.tar]', desc: 'Extract tar archive' },
      { cmd: 'tar', args: '-czvf [archive.tar.gz]', desc: 'Create compressed archive' },
      { cmd: 'gzip', args: '[file]', desc: 'Compress files' },
      { cmd: 'gunzip', args: '[file.gz]', desc: 'Decompress gzip files' },
      { cmd: 'zip', args: '-r [archive.zip] [dir]', desc: 'Create zip archive' },
      { cmd: 'unzip', args: '[archive.zip]', desc: 'Extract zip archive' },
      { cmd: 'bzip2', args: '[file]', desc: 'Compress with bzip2' },
    ]
  },
  {
    title: 'Networking',
    color: 'text-yellow-400',
    commands: [
      { cmd: 'ping', args: '-c 4 [host]', desc: 'Test network connectivity' },
      { cmd: 'curl', args: '[url]', desc: 'Transfer data from/to a server' },
      { cmd: 'wget', args: '[url]', desc: 'Download files from web' },
      { cmd: 'ifconfig', args: '', desc: 'Configure network interface' },
      { cmd: 'ip', args: 'addr show', desc: 'Show IP addresses' },
      { cmd: 'netstat', args: '-tuln', desc: 'Network statistics' },
      { cmd: 'ssh', args: '[user]@[host]', desc: 'Secure Shell remote login' },
      { cmd: 'scp', args: '[file] [user]@[host]:[path]', desc: 'Secure copy over SSH' },
      { cmd: 'rsync', args: '-avz [src] [dest]', desc: 'Sync files and directories' },
    ]
  },
  {
    title: 'User Management',
    color: 'text-rose-400',
    commands: [
      { cmd: 'useradd', args: '[username]', desc: 'Create a new user' },
      { cmd: 'userdel', args: '-r [username]', desc: 'Delete a user and home dir' },
      { cmd: 'usermod', args: '-aG [group] [user]', desc: 'Modify user account' },
      { cmd: 'passwd', args: '[username]', desc: 'Change user password' },
      { cmd: 'su', args: '- [username]', desc: 'Switch user' },
      { cmd: 'sudo', args: '[command]', desc: 'Execute command as superuser' },
      { cmd: 'groups', args: '[username]', desc: 'Show user groups' },
      { cmd: 'id', args: '[username]', desc: 'Show user ID and groups' },
    ]
  },
  {
    title: 'Package Management',
    color: 'text-violet-400',
    commands: [
      { cmd: 'apt update', args: '', desc: 'Update package list (Debian/Ubuntu)' },
      { cmd: 'apt install', args: '[package]', desc: 'Install package (Debian/Ubuntu)' },
      { cmd: 'apt remove', args: '[package]', desc: 'Remove package (Debian/Ubuntu)' },
      { cmd: 'yum install', args: '[package]', desc: 'Install package (RedHat/CentOS)' },
      { cmd: 'dnf install', args: '[package]', desc: 'Install package (Fedora)' },
      { cmd: 'pacman -S', args: '[package]', desc: 'Install package (Arch)' },
    ]
  },
  {
    title: 'System Monitoring',
    color: 'text-indigo-400',
    commands: [
      { cmd: 'vmstat', args: '1', desc: 'Report virtual memory statistics' },
      { cmd: 'iostat', args: '', desc: 'Report CPU and I/O statistics' },
      { cmd: 'sar', args: '', desc: 'System activity report' },
      { cmd: 'lsof', args: '', desc: 'List open files' },
      { cmd: 'dmesg', args: '', desc: 'Print kernel ring buffer' },
      { cmd: 'journalctl', args: '-xe', desc: 'Query systemd journal' },
    ]
  },
];

// Command Row Component
const CommandRow = ({ cmd, args, desc }) => (
  <div className="grid grid-cols-12 gap-4 border-b border-gray-800 pb-3 last:border-0 last:pb-0 items-center">
    <div className="col-span-3 font-mono text-green-400 font-bold text-sm">{cmd}</div>
    <div className="col-span-3 font-mono text-gray-500 text-xs">{args}</div>
    <div className="col-span-6 text-gray-400 text-sm">{desc}</div>
  </div>
);

// Command Category Component
const CommandCategory = ({ title, color, commands }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
    <h3 className={`text-xl font-bold ${color} mb-4`}>{title}</h3>
    <div className="space-y-4">
      {commands.map((c, idx) => (
        <CommandRow key={`${c.cmd}-${idx}`} {...c} />
      ))}
    </div>
  </div>
);

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

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-purple-400 mb-3">Command Structure</h3>
            <p className="text-gray-400 mb-2">
              Linux commands follow a simple structure:
            </p>
            <div className="bg-black p-3 rounded font-mono text-sm mt-2">
              <span className="text-green-400">command</span>{' '}
              <span className="text-yellow-400">[options]</span>{' '}
              <span className="text-blue-400">[arguments]</span>
            </div>
            <p className="text-gray-500 text-sm mt-3">
              Example: <code className="text-green-400">ls -la /home</code>
            </p>
          </div>
        </div>
      </div>
    ),
    'file-system': (
      <div className="space-y-6 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-6">File System Hierarchy</h1>
        <p className="text-gray-400 mb-6">
          Linux uses a hierarchical directory structure. Here are the common directories you'll encounter:
        </p>

        <div className="space-y-3">
          {[
            { path: '/', desc: 'Root directory - the start of the file system' },
            { path: '/home', desc: 'Contains personal directories for users' },
            { path: '/root', desc: 'Home directory for the root user' },
            { path: '/bin', desc: 'Essential command binaries (ls, cp, etc.)' },
            { path: '/sbin', desc: 'System binaries (require root privileges)' },
            { path: '/etc', desc: 'System configuration files' },
            { path: '/usr', desc: 'User programs and data' },
            { path: '/var', desc: 'Variable data files (logs, etc.)' },
            { path: '/tmp', desc: 'Temporary files (cleared on reboot)' },
            { path: '/opt', desc: 'Optional third-party software' },
            { path: '/dev', desc: 'Device files' },
            { path: '/proc', desc: 'Process and kernel information' },
          ].map((item) => (
            <div key={item.path} className="flex items-center p-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors">
              <span className="w-28 font-mono text-yellow-400 font-bold">{item.path}</span>
              <span className="text-gray-400">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    'commands': (
      <div className="space-y-6 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-6">Command Reference</h1>
        <p className="text-gray-400 mb-8">
          Comprehensive list of essential Linux commands organized by category. Each command includes common flags and usage examples.
        </p>
        <div className="space-y-6">
          {commandCategories.map((category, idx) => (
            <CommandCategory key={idx} {...category} />
          ))}
        </div>
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-colors"
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
             <div className="cursor-pointer w-8 h-8 flex items-center justify-center bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
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
              className={`w-full cursor-pointer flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
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
