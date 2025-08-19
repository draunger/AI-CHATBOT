"use client"

// import type React from "react"

import { useState } from "react";
import { useChat } from "ai/react";

type MessagePart = {
  type: "text";
  text: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  parts: MessagePart[];
};

import {
  Send,
  MessageSquare,
  Settings,
  User,
  LogOut,
  Bot,
  Shield,
  Headphones,
  CreditCard,
  Calendar,
  Zap,
  ChevronRight,
  Clock,
  FileText,
  History,
  Paperclip,
  ListFilter,
  FileDown,
  TimerIcon as Timeline,
  MessageSquareWarning,
  Receipt,
  BarChart,
  CalendarDays,
  ClipboardEdit,
  ListChecks,
  Repeat,
  Clock3,
  BookText,
  BookOpen,
  UserPlus,
  FileStack,
  HeartHandshake,
  Key,
  Bell,
  Globe,
  Trash2,
  Download,
  Eye,
  Mail,
  MessageSquareText,
  Text,
  UserCog,
  ImageIcon,
  Phone,
  AtSign,
  UserCheck,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Updated support categories
const supportCategories = [
  { id: "security", title: "Security & Access", icon: Shield, count: 3, color: "bg-red-500" },
  { id: "helpdesk", title: "Help Desk", icon: Headphones, count: 4, color: "bg-blue-500" },
  { id: "payroll", title: "Payroll & Finance", icon: CreditCard, count: 5, color: "bg-green-500" },
  { id: "scheduling", title: "Scheduling", icon: Calendar, count: 5, color: "bg-purple-500" },
]

// FAQs data
const faqCategories = [
  {
    title: "Account & Access",
    faqs: [
      { question: "How do I reset my password?", answer: "Go to login page and click 'Forgot Password'" },
      { question: "How to enable 2FA?", answer: "Visit Security Settings in your profile" },
      { question: "Can't access my account", answer: "Contact IT support for account recovery" },
    ],
  },
  {
    title: "Payroll & Benefits",
    faqs: [
      { question: "When is payday?", answer: "Every 15th and last day of the month" },
      { question: "How to update tax information?", answer: "Use the HR portal under Tax Settings" },
      { question: "Health insurance enrollment", answer: "Open enrollment period is in November" },
    ],
  },
  {
    title: "Time & Attendance",
    faqs: [
      { question: "How to request time off?", answer: "Submit requests through the employee portal" },
      { question: "Sick leave policy", answer: "Up to 10 days per year with doctor's note" },
      { question: "Remote work guidelines", return: "Check the remote work policy in handbook" },
    ],
  },
]

const navigationItems = [
  { title: "Support Hub", icon: MessageSquare, isActive: true },
  { title: "Knowledge Base", icon: BookText, isCollapsible: true, id: "knowledge-base" },
  { title: "Settings", icon: Settings, isCollapsible: true, id: "settings" }, // Marked as collapsible
]

// Define role styles
const roleStyles: { [key: string]: { color: string; emoji: string } } = {
  employee: { color: "bg-blue-100 text-blue-700", emoji: "👨‍💻" },
  hr: { color: "bg-purple-100 text-purple-700", emoji: "👩‍💼" },
  admin: { color: "bg-red-100 text-red-700", emoji: "🛡️" },
}

export default function EnterpriseSupportHub() {
  const [input, setInput] = useState("")
  const { messages, sendMessage, isLoading, stop } = useChat()
  const [openFaqSections, setOpenFaqSections] = useState<string[]>([])
  const [openSecurityAccessCategory, setOpenSecurityAccessCategory] = useState(false) // State for Security & Access category collapsible
  const [openHelpDeskCategory, setOpenHelpDeskCategory] = useState(false) // State for Help Desk category collapsible
  const [openPayrollFinanceCategory, setOpenPayrollFinanceCategory] = useState(false) // State for Payroll & Finance category collapsible
  const [openSchedulingCategory, setOpenSchedulingCategory] = useState(false) // State for Scheduling category collapsible
  const [is2FAEnabled, setIs2FAEnabled] = useState(false) // State for 2FA toggle
  const [unlockAccountIdentifier, setUnlockAccountIdentifier] = useState("") // State for unlock account form
  const [openChatHistory, setOpenChatHistory] = useState(false) // State for Chat History collapsible
  const [openKnowledgeBase, setOpenKnowledgeBase] = useState(false) // State for Knowledge Base collapsible

  // New state for Settings sub-sections - only one can be open at a time
  const [openSettings, setOpenSettings] = useState(false) // Overall settings collapsible
  const [activeSettingSection, setActiveSettingSection] = useState<string | null>(null) // Tracks which sub-section is open

  // States for "Submit a support ticket" dialog
  const [isSubmitTicketDialogOpen, setIsSubmitTicketDialogOpen] = useState(false)
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketDescription, setTicketDescription] = useState("")
  const [ticketCategory, setTicketCategory] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage({ text: input })
      setInput("")
    }
  }

  const toggleFaqSection = (title: string) => {
    setOpenFaqSections((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]))
  }

  const handleUnlockAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Unlock Account request for:", unlockAccountIdentifier)
    // In a real app, you'd send this to your backend
    alert(`Unlock account request submitted for: ${unlockAccountIdentifier}`)
    setUnlockAccountIdentifier("")
  }

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ ticketSubject, ticketDescription, ticketCategory })
    alert(`Ticket submitted: Subject - ${ticketSubject}, Category - ${ticketCategory}`)
    setTicketSubject("")
    setTicketDescription("")
    setTicketCategory("")
    setIsSubmitTicketDialogOpen(false)
  }

  // Mock user data - in real app this would come from auth
  const username = "John Doe"
  const userEmail = "john.doe@example.com"
  const employeeId = "EMP00123"
  const leaveBalance = 15 // days
  const activeTickets = 2
  const userRole = "employee" // Mock user role

  const currentRoleStyle = roleStyles[userRole] || { color: "bg-slate-100 text-slate-700", emoji: "" }

  return (
    <div className="flex h-screen overflow-x-hidden overflow-y-auto bg-slate-50 rounded-[10px] w-full">
      <Sidebar className="border-r border-slate-200 rounded-[10px]">
        <SidebarHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-[10px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base">Assistify</h2>
              <p className="text-blue-100 text-xs">Helpdesk for HR & Employee</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-white overflow-y-auto h-full max-h-screen p-2 pb-6">
          {/* Chat History Section */}
          <Collapsible open={openChatHistory} onOpenChange={setOpenChatHistory} className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left hover:bg-slate-50 rounded-lg transition-colors mt-[15px]">
                  <span className="text-slate-700 font-semibold">Chat History</span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${openChatHistory ? "rotate-90" : ""}`}
                  />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton onClick={() => console.log("View Today's chats")}>
                        <CalendarDays className="w-4 h-4" />
                        <span>Today</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton onClick={() => console.log("View Yesterday's chats")}>
                        <Clock className="w-4 h-4" />
                        <span>Yesterday</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton onClick={() => console.log("View Last 7 Days chats")}>
                        <Calendar className="w-4 h-4" />
                        <span>Last 7 Days</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton onClick={() => console.log("View Last 30 Days chats")}>
                        <Calendar className="w-4 h-4" />
                        <span>Last 30 Days</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton onClick={() => console.log("View All chats")}>
                        <History className="w-4 h-4" />
                        <span>All Chats</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>

          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-700 font-semibold">Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) =>
                  item.isCollapsible ? (
                    <Collapsible
                      key={item.id}
                      open={item.id === "knowledge-base" ? openKnowledgeBase : openSettings}
                      onOpenChange={item.id === "knowledge-base" ? setOpenKnowledgeBase : setOpenSettings}
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            isActive={item.isActive}
                            className="hover:bg-blue-50 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700 data-[active=true]:border-r-2 data-[active=true]:border-blue-500"
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                            <ChevronRight
                              className={`ml-auto w-4 h-4 text-slate-400 transition-transform ${
                                (item.id === "knowledge-base" && openKnowledgeBase) ||
                                (item.id === "settings" && openSettings)
                                  ? "rotate-90"
                                  : ""
                              }`}
                            />
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-2">
                        {item.id === "knowledge-base" && (
                          <SidebarMenu>
                            <SidebarMenuItem>
                              <SidebarMenuButton onClick={() => console.log("View Company Policies")}>
                                <BookText className="w-4 h-4" />
                                <span>Company Policies</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton onClick={() => console.log("View Step-by-step Guides")}>
                                <BookOpen className="w-4 h-4" />
                                <span>Step-by-step Guides</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton onClick={() => console.log("View Onboarding Resources")}>
                                <UserPlus className="w-4 h-4" />
                                <span>Onboarding Resources</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton onClick={() => console.log("View HR and Payroll Documents")}>
                                <FileStack className="w-4 h-4" />
                                <span>HR and Payroll Documents</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton onClick={() => console.log("View Benefits and Wellness")}>
                                <HeartHandshake className="w-4 h-4" />
                                <span>Benefits and Wellness</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </SidebarMenu>
                        )}
                        {item.id === "settings" && (
                          <SidebarMenu>
                            {/* Profile Settings */}
                            <Collapsible
                              open={activeSettingSection === "profile-settings"}
                              onOpenChange={() =>
                                setActiveSettingSection(
                                  activeSettingSection === "profile-settings" ? null : "profile-settings",
                                )
                              }
                            >
                              <CollapsibleTrigger asChild>
                                <SidebarMenuItem>
                                  <SidebarMenuButton>
                                    <UserCog className="w-4 h-4" />
                                    <span>1. Profile Settings</span>
                                    <ChevronRight
                                      className={`ml-auto w-4 h-4 text-slate-400 transition-transform ${
                                        activeSettingSection === "profile-settings" ? "rotate-90" : ""
                                      }`}
                                    />
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="pl-2">
                                <SidebarMenu>
                                  <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => console.log("Edit profile details")}>
                                      <User className="w-4 h-4" />
                                      <span>Edit profile details</span>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                  <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => console.log("Change email or username")}>
                                      <AtSign className="w-4 h-4" />
                                      <span>Change email or username</span>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                  <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => console.log("Upload/update profile picture")}>
                                      <ImageIcon className="w-4 h-4" />
                                      <span>Upload/update profile picture</span>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                </SidebarMenu>
                              </CollapsibleContent>
                            </Collapsible>

                            {/* Security & Password */}
                            <Collapsible
                              open={activeSettingSection === "security-password"}
                              onOpenChange={() =>
                                setActiveSettingSection(
                                  activeSettingSection === "security-password" ? null : "security-password",
                                )
                              }
                            >
                              <CollapsibleTrigger asChild>
                                <SidebarMenuItem>
                                  <SidebarMenuButton>
                                    <Key className="w-4 h-4" />
                                    <span>2. Security & Password</span>
                                    <ChevronRight
                                      className={`ml-auto w-4 h-4 text-slate-400 transition-transform ${
                                        activeSettingSection === "security-password" ? "rotate-90" : ""
                                      }`}
                                    />
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="pl-2">
                                <SidebarMenu>
                                  <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => setInput("I need to change my password.")}>
                                      <Key className="w-4 h-4" />
                                      <span>Change password</span>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                  <SidebarMenuItem>
                                    <div className="flex items-center justify-between w-full p-2 rounded-lg text-sm text-slate-700">
                                      <Label
                                        htmlFor="2fa-toggle-settings"
                                        className="flex items-center gap-2 cursor-pointer"
                                      >
                                        <Shield className="w-4 h-4" />
                                        <span>Enable/disable 2FA</span>
                                      </Label>
                                      <Switch
                                        id="2fa-toggle-settings"
                                        checked={is2FAEnabled}
                                        onCheckedChange={setIs2FAEnabled}
                                        className="data-[state=checked]:bg-blue-600"
                                      />
                                    </div>
                                  </SidebarMenuItem>
                                  <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => console.log("View login activity")}>
                                      <Eye className="w-4 h-4" />
                                      <span>View login activity</span>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                </SidebarMenu>
                              </CollapsibleContent>
                            </Collapsible>

                            {/* Notification Preferences */}
                            <Collapsible
                              open={activeSettingSection === "notification-preferences"}
                              onOpenChange={() =>
                                setActiveSettingSection(
                                  activeSettingSection === "notification-preferences"
                                    ? null
                                    : "notification-preferences",
                                )
                              }
                            >
                              <CollapsibleTrigger asChild>
                                <SidebarMenuItem>
                                  <SidebarMenuButton>
                                    <Bell className="w-4 h-4" />
                                    <span>3. Notification Preferences</span>
                                    <ChevronRight
                                      className={`ml-auto w-4 h-4 text-slate-400 transition-transform ${
                                        activeSettingSection === "notification-preferences" ? "rotate-90" : ""
                                      }`}
                                    />
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="pl-2">
                                <SidebarMenu>
                                  <SidebarMenuItem>
                                    <div className="flex items-center justify-between w-full p-2 rounded-lg text-sm text-slate-700">
                                      <Label
                                        htmlFor="email-notifications"
                                        className="flex items-center gap-2 cursor-pointer"
                                      >
                                        <Mail className="w-4 h-4" />
                                        <span>Email notifications</span>
                                      </Label>
                                      <Switch id="email-notifications" />
                                    </div>
                                  </SidebarMenuItem>
                                  <SidebarMenuItem>
                                    <div className="flex items-center justify-between w-full p-2 rounded-lg text-sm text-slate-700">
                                      <Label htmlFor="sms-alerts" className="flex items-center gap-2 cursor-pointer">
                                        <Phone className="w-4 h-4" />
                                        <span>SMS alerts</span>
                                      </Label>
                                      <Switch id="sms-alerts" />
                                    </div>
                                  </SidebarMenuItem>
                                  <SidebarMenuItem>
                                    <div className="flex items-center justify-between w-full p-2 rounded-lg text-sm text-slate-700">
                                      <Label
                                        htmlFor="chatbot-popups"
                                        className="flex items-center gap-2 cursor-pointer"
                                      >
                                        <MessageSquareText className="w-4 h-4" />
                                        <span>Chatbot pop-up notifications</span>
                                      </Label>
                                      <Switch id="chatbot-popups" />
                                    </div>
                                  </SidebarMenuItem>
                                </SidebarMenu>
                              </CollapsibleContent>
                            </Collapsible>

                            {/* Language & Accessibility */}
                            <Collapsible
                              open={activeSettingSection === "language-accessibility"}
                              onOpenChange={() =>
                                setActiveSettingSection(
                                  activeSettingSection === "language-accessibility" ? null : "language-accessibility",
                                )
                              }
                            >
                              <CollapsibleTrigger asChild>
                                <SidebarMenuItem>
                                  <SidebarMenuButton>
                                    <Globe className="w-4 h-4" />
                                    <span>4. Language & Accessibility</span>
                                    <ChevronRight
                                      className={`ml-auto w-4 h-4 text-slate-400 transition-transform ${
                                        activeSettingSection === "language-accessibility" ? "rotate-90" : ""
                                      }`}
                                    />
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="pl-2">
                                <SidebarMenu>
                                  <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => console.log("Change language")}>
                                      <Globe className="w-4 h-4" />
                                      <span>Change language</span>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                  <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => console.log("Text size adjustments")}>
                                      <Text className="w-4 h-4" />
                                      <span>Text size adjustments</span>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                </SidebarMenu>
                              </CollapsibleContent>
                            </Collapsible>

                            {/* Account Management */}
                            <Collapsible
                              open={activeSettingSection === "account-management"}
                              onOpenChange={() =>
                                setActiveSettingSection(
                                  activeSettingSection === "account-management" ? null : "account-management",
                                )
                              }
                            >
                              <CollapsibleTrigger asChild>
                                <SidebarMenuItem>
                                  <SidebarMenuButton>
                                    <Trash2 className="w-4 h-4" />
                                    <span>5. Account Management</span>
                                    <ChevronRight
                                      className={`ml-auto w-4 h-4 text-slate-400 transition-transform ${
                                        activeSettingSection === "account-management" ? "rotate-90" : ""
                                      }`}
                                    />
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="pl-2">
                                <SidebarMenu>
                                  <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => console.log("Deactivate or delete account")}>
                                      <Trash2 className="w-4 h-4" />
                                      <span>Deactivate or delete account</span>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                  <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => console.log("Download data or ticket history")}>
                                      <Download className="w-4 h-4" />
                                      <span>Download data or ticket history</span>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                  <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => console.log("View assigned roles")}>
                                      <UserCheck className="w-4 h-4" />
                                      <span>View assigned roles</span>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                </SidebarMenu>
                              </CollapsibleContent>
                            </Collapsible>
                          </SidebarMenu>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={item.isActive}
                        className="hover:bg-blue-50 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700 data-[active=true]:border-r-2 data-[active=true]:border-blue-500"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ),
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-700 font-semibold">Support Categories</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2">
                {supportCategories.map((category) => (
                  <Collapsible
                    key={category.id}
                    open={
                      category.id === "security"
                        ? openSecurityAccessCategory
                        : category.id === "helpdesk"
                          ? openHelpDeskCategory
                          : category.id === "payroll"
                            ? openPayrollFinanceCategory
                            : category.id === "scheduling"
                              ? openSchedulingCategory
                              : undefined
                    }
                    onOpenChange={
                      category.id === "security"
                        ? setOpenSecurityAccessCategory
                        : category.id === "helpdesk"
                          ? setOpenHelpDeskCategory
                          : category.id === "payroll"
                            ? setOpenPayrollFinanceCategory
                            : category.id === "scheduling"
                              ? setOpenSchedulingCategory
                              : undefined
                    }
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-slate-100 hover:border-slate-200 transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                            <category.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-slate-700">{category.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-xs">
                            {category.count}
                          </Badge>
                          <ChevronRight
                            className={`w-4 h-4 text-slate-400 transition-transform ${
                              (category.id === "security" && openSecurityAccessCategory) ||
                              (category.id === "helpdesk" && openHelpDeskCategory) ||
                              (category.id === "payroll" && openPayrollFinanceCategory) ||
                              (category.id === "scheduling" && openSchedulingCategory)
                                ? "rotate-90"
                                : ""
                            }`}
                          />
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    {category.id === "security" && (
                      <CollapsibleContent className="pl-2">
                        <SidebarMenu>
                          <SidebarMenuItem>
                            <Dialog>
                              <DialogTrigger asChild>
                                <SidebarMenuButton>
                                  <Shield className="w-4 h-4" />
                                  <span>Unlock Account</span>
                                </SidebarMenuButton>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Unlock Account</DialogTitle>
                                  <DialogDescription>
                                    Enter your email or employee ID to request account unlock.
                                  </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleUnlockAccountSubmit} className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="identifier" className="text-right">
                                      Email / ID
                                    </Label>
                                    <Input
                                      id="identifier"
                                      value={unlockAccountIdentifier}
                                      onChange={(e) => setUnlockAccountIdentifier(e.target.value)}
                                      className="col-span-3"
                                      placeholder="john.doe@example.com or EMP00123"
                                      required
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button type="submit">Request Unlock</Button>
                                  </DialogFooter>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => setInput("I need to reset my password.")}>
                              <User className="w-4 h-4" />
                              <span>Reset Password</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <div className="flex items-center justify-between w-full p-2 rounded-lg text-sm text-slate-700">
                              <Label htmlFor="2fa-toggle" className="flex items-center gap-2 cursor-pointer">
                                <Shield className="w-4 h-4" />
                                <span>Enable 2FA</span>
                              </Label>
                              <Switch
                                id="2fa-toggle"
                                checked={is2FAEnabled}
                                onCheckedChange={setIs2FAEnabled}
                                className="data-[state=checked]:bg-blue-600"
                              />
                            </div>
                          </SidebarMenuItem>
                        </SidebarMenu>
                      </CollapsibleContent>
                    )}
                    {category.id === "helpdesk" && (
                      <CollapsibleContent className="pl-2">
                        <SidebarMenu>
                          <SidebarMenuItem>
                            <Dialog open={isSubmitTicketDialogOpen} onOpenChange={setIsSubmitTicketDialogOpen}>
                              <DialogTrigger asChild>
                                <SidebarMenuButton>
                                  <FileText className="w-4 h-4" />
                                  <span>Submit a support ticket</span>
                                </SidebarMenuButton>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Submit Support Ticket</DialogTitle>
                                  <DialogDescription>
                                    Fill out the form below to submit a new support ticket.
                                  </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmitTicket} className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="ticket-subject">Subject</Label>
                                    <Input
                                      id="ticket-subject"
                                      value={ticketSubject}
                                      onChange={(e) => setTicketSubject(e.target.value)}
                                      placeholder="Brief summary of your issue"
                                      required
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="ticket-description">Description</Label>
                                    <Textarea
                                      id="ticket-description"
                                      value={ticketDescription}
                                      onChange={(e) => setTicketDescription(e.target.value)}
                                      placeholder="Provide detailed information about your issue"
                                      rows={4}
                                      required
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="ticket-category">Category</Label>
                                    <Select value={ticketCategory} onValueChange={setTicketCategory} required>
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a category" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="technical">Technical Support</SelectItem>
                                        <SelectItem value="software">Software Issue</SelectItem>
                                        <SelectItem value="hardware">Hardware Problem</SelectItem>
                                        <SelectItem value="network">Network Connectivity</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <DialogFooter>
                                    <Button type="submit">Submit Ticket</Button>
                                  </DialogFooter>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => setInput("Show me my submitted tickets.")}>
                              <History className="w-4 h-4" />
                              <span>View submitted tickets</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => setInput("Show me my ticket history.")}>
                              <ListFilter className="w-4 h-4" />
                              <span>Ticket history + filter</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => setInput("How do I attach a file to a ticket?")}>
                              <Paperclip className="w-4 h-4" />
                              <span>Attach file/screenshot</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </SidebarMenu>
                      </CollapsibleContent>
                    )}
                    {category.id === "payroll" && (
                      <CollapsibleContent className="pl-2">
                        <SidebarMenu>
                          <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => setInput("I need to download my payslip.")}>
                              <FileDown className="w-4 h-4" />
                              <span>Payslip download</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => setInput("Show me my salary credited timeline.")}>
                              <Timeline className="w-4 h-4" />
                              <span>Salary credited timeline</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => setInput("I want to raise a salary discrepancy.")}>
                              <MessageSquareWarning className="w-4 h-4" />
                              <span>Raise salary discrepancy</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => setInput("I need to submit a reimbursement form.")}>
                              <Receipt className="w-4 h-4" />
                              <span>Reimbursement submission</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => setInput("Show me my tax summary.")}>
                              <BarChart className="w-4 h-4" />
                              <span>Tax summary / deduction preview</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </SidebarMenu>
                      </CollapsibleContent>
                    )}
                    {category.id === "scheduling" && (
                      <CollapsibleContent className="pl-2">
                        <SidebarMenu>
                          <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => setInput("Show me the shift calendar.")}>
                              <CalendarDays className="w-4 h-4" />
                              <span>Shift calendar viewer</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => setInput("I want to apply for time off.")}>
                              <ClipboardEdit className="w-4 h-4" />
                              <span>Apply for time off / leave</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => setInput("Show me my leave history.")}>
                              <ListChecks className="w-4 h-4" />
                              <span>View leave history</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => setInput("I want to swap a shift.")}>
                              <Repeat className="w-4 h-4" />
                              <span>Swap shift request</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => setInput("Simulate punch-in/punch-out.")}>
                              <Clock3 className="w-4 h-4" />
                              <span>Punch-in / Punch-out simulator</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </SidebarMenu>
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-700 font-semibold">Frequently Asked Questions</SidebarGroupLabel>
            <SidebarGroupContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {faqCategories.map((category) => (
                    <Collapsible key={category.title}>
                      <CollapsibleTrigger
                        className="flex items-center justify-between w-full p-2 text-left hover:bg-slate-50 rounded-lg transition-colors"
                        onClick={() => toggleFaqSection(category.title)}
                      >
                        <span className="text-sm font-medium text-slate-700">{category.title}</span>
                        <ChevronRight
                          className={`w-4 h-4 text-slate-400 transition-transform ${
                            openFaqSections.includes(category.title) ? "rotate-90" : ""
                          }`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-2">
                        <div className="space-y-1 mt-2">
                          {category.faqs.map((faq, index) => (
                            <button
                              key={index}
                              className="w-full text-left p-2 text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors"
                              onClick={() => setInput(faq.question)}
                            >
                              {faq.question}
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </ScrollArea>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="flex flex-col">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between px-4 sm:px-6 bg-white border-b border-slate-200 shadow-sm rounded-[10px] w-full max-w-[1200px] mx-auto h-16">
          <div className="flex items-center gap-4">
            {/* Sidebar Trigger Button - visible on all screen sizes */}
      <SidebarTrigger className="text-slate-600 hover:bg-slate-100">
      <span className="sr-only">Toggle Sidebar</span>
  {/* You can also use an icon here if you like */}
      <Zap className="w-4 h-4" />
      </SidebarTrigger>

      <Separator orientation="vertical" className="h-6 bg-slate-200" />

        <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
        <Zap className="w-5 h-5 text-white" />
              </div>
              </div>

              <div>
                <h1 className="font-bold text-slate-900">Assistify</h1>
                <p className="text-sm text-slate-500">Helpdesk for HR & Employee</p>
              </div>
            </div>
          {/* </div> */}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Active</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 p-0 rounded-full hover:bg-slate-100 flex items-center justify-center">
                  <Avatar className="h-9 w-9 border-2 border-slate-200">
                    <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {username.charAt(0)}
                      {username.split(" ")[1]?.charAt(0) || ""}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{username}</p>
                    <p className="w-[200px] truncate text-muted-foreground">{userEmail}</p>
                    <Badge className={`mt-1 text-xs capitalize ${currentRoleStyle.color}`}>
                      {currentRoleStyle.emoji} {userRole}
                    </Badge>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-slate-50">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-slate-50">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-red-50 text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 w-[1250px]">
          <div className="grid grid-cols-1 gap-6 h-full">
            {/* Chat Interface */}
            <div className="">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-600" />
                    AI Support Assistant
                  </CardTitle>
                  <CardDescription>Ask me anything about company policies, IT support, or benefits</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 px-6">
                    {messages.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <Bot className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">Hi John, how can I help you today?</h2>
                        <p className="text-slate-600 mb-6 max-w-md mx-auto">
                          I'm your AI assistant for workplace support. Choose a quick action, browse FAQs, or ask me
                          anything.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                          {[
                            "How to request new ID card?",
                            "When is the next holiday?",
                            "Why am I getting unauthorized access error?",
                            "How to connect to company WiFi?",
                          ].map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="text-left justify-start h-auto p-4 border-slate-200 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                              onClick={() => setInput(suggestion)}
                            >
                              <span className="text-sm">{suggestion}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 py-4">
                        {messages.map((message: Message) => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            {message.role === "assistant" && (
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                <Bot className="w-4 h-4 text-white" />
                              </div>
                            )}
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                message.role === "user"
                                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                                  : "bg-slate-100 text-slate-900 border border-slate-200"
                              }`}
                            >
                              {message.parts.map((part, i) => {
                                switch (part.type) {
                                  case "text":
                                    return (
                                      <div key={`${message.id}-${i}`} className="text-sm leading-relaxed">
                                        {part.text}
                                      </div>
                                    )
                                }
                              })}
                              {message.role === "assistant" && (
                                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                  <span>Was this helpful?</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                                    onClick={() => console.log("Feedback: 👍 for message", message.id)}
                                  >
                                    👍
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                                    onClick={() => console.log("Feedback: 👎 for message", message.id)}
                                  >
                                    👎
                                  </Button>
                                </div>
                              )}
                            </div>
                            {message.role === "user" && (
                              <Avatar className="w-8 h-8 border-2 border-blue-200 flex-shrink-0 shadow-sm">
                                <AvatarImage src="/placeholder.svg?height=32&width=32&text=User" alt="User" />
                                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                                  JD
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.4s" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="border-t border-slate-200 p-4">
                    <form onSubmit={handleSubmit}>
                      <div className="flex gap-3">
                        <Input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Type your question or request here..."
                          className="flex-1 border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl"
                          disabled={isLoading}
                        />
                        {isLoading && ( // Only show stop button when loading
                          <Button
                            type="button" // Important: type="button" to prevent form submission
                            onClick={stop}
                            disabled={!isLoading}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6"
                          >
                            Stop
                          </Button>
                        )}
                        <Button
                          type="submit"
                          disabled={!input.trim() || isLoading} // Disable send button when loading
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                        >
                          <Send className="w-4 h-4 text-white" />
                        </Button>
                      </div>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  )
}
