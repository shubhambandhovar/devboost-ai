import { useState } from 'react'
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import CodeExplainer from './components/CodeExplainer'
import ReadmeGenerator from './components/ReadmeGenerator'
import CommitGenerator from './components/CommitGenerator'
import BugDebugger from './components/BugDebugger'
import CodeRefactorer from './components/CodeRefactorer'
import CodeTranslator from './components/CodeTranslator'
import RegexGenerator from './components/RegexGenerator'
import UnitTestGenerator from './components/UnitTestGenerator'
import SecurityScanner from './components/SecurityScanner'
import DatabaseGenerator from './components/DatabaseGenerator'
import ArchitecturePlanner from './components/ArchitecturePlanner'
import InteractiveChat from './components/InteractiveChat'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Register from './components/Register'
import History from './components/History'
import Pricing from './components/Pricing'

function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
      <InteractiveChat />
    </div>
  )
}

function ToolLayout() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          DevBoost AI
        </h1>
        <p className="text-gray-400 mt-2">Supercharge your developer productivity with GenAI</p>
      </header>
      <Outlet />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Standalone Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={
            <div className="h-screen overflow-y-auto p-8 bg-dark">
              <Dashboard />
              <InteractiveChat />
            </div>
          } />
          
          {/* App Layout (with Sidebar) */}
          <Route element={<AppLayout />}>
            <Route path="/history" element={<History />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Tool Layout (centered constraints) */}
            <Route element={<ToolLayout />}>
              <Route path="/explain-code" element={<CodeExplainer />} />
              <Route path="/generate-readme" element={<ReadmeGenerator />} />
              <Route path="/generate-commit" element={<CommitGenerator />} />
              <Route path="/debug-bug" element={<BugDebugger />} />
              <Route path="/refactor-code" element={<CodeRefactorer />} />
              <Route path="/translate-code" element={<CodeTranslator />} />
              <Route path="/generate-regex" element={<RegexGenerator />} />
              <Route path="/generate-unit-test" element={<UnitTestGenerator />} />
              <Route path="/scan-security" element={<SecurityScanner />} />
              <Route path="/generate-database" element={<DatabaseGenerator />} />
              <Route path="/plan-architecture" element={<ArchitecturePlanner />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
