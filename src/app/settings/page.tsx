"use client"

import { useState } from "react"
import { Moon, Sun, Bell, Download, Upload, Shield, User, Palette } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("appearance")

  const tabs = [
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "account", label: "Account", icon: User },
    { id: "data", label: "Data & Export", icon: Download },
    { id: "security", label: "Security", icon: Shield },
  ]

  return (
    <div className="p-8 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your workspace preferences.</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar tabs */}
        <div className="w-56 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 max-w-2xl">
          {activeTab === "appearance" && <AppearanceSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "account" && <AccountSettings />}
          {activeTab === "data" && <DataSettings />}
          {activeTab === "security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  )
}

function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">Theme</h3>
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/30 text-white">
            <Moon className="h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 transition-all">
            <Sun className="h-5 w-5" />
            <div className="text-left">
              <p className="text-sm font-medium">Light Mode</p>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </div>
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">Accent Color</h3>
        <div className="flex gap-3">
          {["#6C63FF", "#00C2FF", "#FF6B6B", "#16C784", "#F4B400", "#EA4335"].map((color) => (
            <button
              key={color}
              className={`h-10 w-10 rounded-xl transition-all hover:scale-110 ${
                color === "#6C63FF" ? "ring-2 ring-white ring-offset-2 ring-offset-background" : ""
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function NotificationSettings() {
  const notifications = [
    { label: "Daily reminder for upcoming posts", enabled: true },
    { label: "Alert for missed posts", enabled: true },
    { label: "Content due today notification", enabled: true },
    { label: "Review pending alerts", enabled: false },
    { label: "Approval pending alerts", enabled: false },
    { label: "Browser push notifications", enabled: false },
  ]

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-semibold text-white mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        {notifications.map((n, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <span className="text-sm text-white">{n.label}</span>
            <button
              className={`relative h-6 w-11 rounded-full transition-colors ${
                n.enabled ? "bg-primary" : "bg-white/10"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow-md ${
                  n.enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function AccountSettings() {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Name</label>
            <input
              type="text"
              defaultValue="Admin User"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Email</label>
            <input
              type="email"
              defaultValue="admin@prodzy.com"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <button className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-all active:scale-95">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function DataSettings() {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">Export Data</h3>
        <p className="text-sm text-muted-foreground mb-4">Download your data in various formats.</p>
        <div className="flex flex-wrap gap-3">
          {["CSV", "Excel", "JSON", "PDF"].map((format) => (
            <button
              key={format}
              className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-all"
            >
              <Download className="h-4 w-4" />
              Export {format}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">Import Data</h3>
        <p className="text-sm text-muted-foreground mb-4">Import content from external sources.</p>
        <div className="flex gap-3">
          {["CSV", "Excel"].map((format) => (
            <button
              key={format}
              className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-all"
            >
              <Upload className="h-4 w-4" />
              Import {format}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function SecuritySettings() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-semibold text-white mb-4">Security</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm text-white">Two-Factor Authentication</p>
            <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
          </div>
          <button className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10 transition-all">
            Enable
          </button>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-white/5">
          <div>
            <p className="text-sm text-white">Change Password</p>
            <p className="text-xs text-muted-foreground">Update your account password</p>
          </div>
          <button className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10 transition-all">
            Update
          </button>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-white/5">
          <div>
            <p className="text-sm text-red-400">Delete Account</p>
            <p className="text-xs text-muted-foreground">Permanently remove your account</p>
          </div>
          <button className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-all">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
