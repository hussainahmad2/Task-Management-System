import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Settings,
  LogOut,
  Briefcase,
  Menu,
  X,
  Building2,
  Shield,
  Activity,
  Server,
  UserPlus,
  Calendar,
  DollarSign,
  FileText,
  Star,
  ClipboardList,
  Target,
  GitBranch,
  Clock,
  BookOpen,
  Sun,
  Moon,
  MessageCircle,
  User as UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOrganizations } from "@/hooks/use-organizations";
import { useTheme } from "@/hooks/use-theme";
import { usePermissions } from "@/contexts/PermissionsContext";
import { useState } from "react";
import { ChatSidebar } from "./messaging/ChatSidebar";
import { ChatHeader } from "./messaging/ChatHeader";
import { MessageList } from "./messaging/MessageList";
import { MessageInput } from "./messaging/MessageInput";
import { useMessaging } from "@/contexts/MessagingContext";
import { ChatRoom } from "@/types/messaging";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);

  const { state, actions } = useMessaging();
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null);

  // Use real data from context
  const chatRooms = state.chatRooms;
  const messages = state.messages[activeChatRoom?.id || ''] || [];
  const { theme, setTheme, density } = useTheme();
  const { data: orgs } = useOrganizations();
  const { hasPermission } = usePermissions();

  // Simple check - in a real app we'd have a context for current org
  const activeOrg = orgs?.[0];

  // Check user role for role-specific navigation
  const userRole = user?.role || "";
  const isHRManager = userRole === "HR Manager" || userRole === "hr_manager";
  const isCPO = userRole === "CPO";
  const isCTO = userRole === "CTO";
  const isEmployee = userRole === "Senior Employee" || userRole === "Junior Employee";
  const isIntern = userRole === "Intern";

  // HR-specific navigation items
  const hrNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/messaging", label: "Messages", icon: MessageCircle },
    { href: "/hr/recruitment", label: "Recruitment", icon: UserPlus },
    { href: "/hr/leaves", label: "Leave Management", icon: Calendar },
    { href: "/hr/payroll", label: "Payroll", icon: DollarSign },
    { href: "/hr/performance", label: "Performance Reviews", icon: Star },
    { href: "/hr/policies", label: "Policies", icon: FileText },
    { href: "/employees", label: "Employees", icon: Users },
    { href: "/departments", label: "Departments", icon: Building2 },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  // CPO-specific navigation items
  const cpoNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/messaging", label: "Messages", icon: MessageCircle },
    { href: "/cpo/roadmap", label: "Product Roadmap", icon: Target },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/employees", label: "Team", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  // CTO-specific navigation items
  const ctoNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/messaging", label: "Messages", icon: MessageCircle },
    { href: "/cto/reviews", label: "Code Reviews", icon: GitBranch },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/employees", label: "Team", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  // Employee-specific navigation items
  const employeeNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/messaging", label: "Messages", icon: MessageCircle },
    { href: "/employee/timesheet", label: "Timesheet", icon: Clock },
    { href: "/employee/leaves", label: "My Leaves", icon: Calendar },
    { href: "/employee/payroll", label: "My Payroll", icon: DollarSign },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  // Intern-specific navigation items
  const internNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/messaging", label: "Messages", icon: MessageCircle },
    { href: "/intern/learning", label: "Learning Modules", icon: BookOpen },
    { href: "/employee/timesheet", label: "Timesheet", icon: Clock },
    { href: "/employee/leaves", label: "My Leaves", icon: Calendar },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  // Default navigation items for other roles
  const defaultNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/messaging", label: "Messages", icon: MessageCircle },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/employees", label: "Employees", icon: Users },
    { href: "/departments", label: "Departments", icon: Building2 },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  // Determine which nav items to use based on role
  let navItems = defaultNavItems;
  if (isHRManager) navItems = hrNavItems;
  else if (isCPO) navItems = cpoNavItems;
  else if (isCTO) navItems = ctoNavItems;
  else if (isEmployee) navItems = employeeNavItems;
  else if (isIntern) navItems = internNavItems;

  if (hasPermission("permissions.manage")) {
    navItems.push({ href: "/permissions", label: "Permissions", icon: Shield });
  }

  // Expanded Role Dashboards access for CEO/Superadmin
  // This allows the CEO to quickly inspect other department dashboards
  if (hasPermission("permissions.manage") || user?.role === "CEO") { // Using existing permission or CEO role
    // We can use a divider or just add them
    // Ideally we'd have a collapsible section, but for now flat list with specific prefixes
  }

  // Handle messaging functionality
  const handleSelectChatRoom = (chatRoomId: string) => {
    const room = chatRooms.find(room => room.id === chatRoomId);
    if (room) {
      setActiveChatRoom(room);
      actions.setActiveChatRoom(chatRoomId);
      // Mark messages as read when selecting a chat room
      actions.markMessagesAsRead(chatRoomId);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeChatRoom || !user?.id) return;

    try {
      await actions.sendMessage(activeChatRoom.id, content);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSendSticker = async (stickerId: string) => {
    if (!activeChatRoom || !user?.id) return;

    try {
      const stickerUrl = `/api/stickers/${stickerId}`;
      await actions.sendMessage(activeChatRoom.id, '', 'sticker', stickerUrl);
    } catch (error) {
      console.error('Failed to send sticker:', error);
    }
  };

  const handleSendEmoji = async (emoji: string) => {
    if (!activeChatRoom || !user?.id) return;

    try {
      await actions.sendMessage(activeChatRoom.id, emoji, 'text');
    } catch (error) {
      console.error('Failed to send emoji:', error);
    }
  };

  // Set current user when available
  const setCurrentUserRef = React.useRef(actions.setCurrentUser);

  React.useEffect(() => {
    setCurrentUserRef.current = actions.setCurrentUser;
  }, [actions.setCurrentUser]);

  React.useEffect(() => {
    if (user?.id) {
      setCurrentUserRef.current(user.id);
    }
  }, [user?.id]);

  const specializedDashboards = [
    { href: "/dashboard/hr", label: "HR Dashboard", icon: Users },
    { href: "/dashboard/finance", label: "Finance", icon: Building2 },
    { href: "/dashboard/engineering", label: "Engineering", icon: Briefcase },
    { href: "/dashboard/operations", label: "Operations", icon: Activity },
    { href: "/dashboard/it", label: "IT Systems", icon: Server },
  ];

  const showSpecialized = user?.role === "CEO" || user?.role === "Superadmin";


  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 h-screen w-64 bg-card border-r border-border z-50 transition-transform duration-200 ease-in-out",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8 sidebar-header transition-all">
            <div className="w-10 h-10 sidebar-header-icon rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20 transition-all">
              {activeOrg?.name.substring(0, 1) || "E"}
            </div>
            <div>
              <h1 className="font-display font-bold text-lg sidebar-header-text leading-tight transition-all">
                {activeOrg?.name || "Enterprise"}
              </h1>
              <p className="text-xs text-muted-foreground">{activeOrg?.plan || "Free Plan"}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group sidebar-item",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}>
                    <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    {item.label}
                  </div>
                </Link>
              );
            })}

            {/* Department Views for CEO */}
            {showSpecialized && (
              <div className="mt-6 mb-2">
                <h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Department Views
                </h4>
                {specializedDashboards.map((item) => {
                  const isActive = location === item.href;
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href}>
                      <div className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group sidebar-item",
                        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}>
                        <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                        {item.label}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-transparent hover:border-primary transition-all">
                    <AvatarImage src={user?.profileImageUrl || undefined} alt="Profile" className="object-cover" />
                    <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={`/employees/${user?.id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto relative">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>

          {/* Messaging Panel Overlay */}
          {isMessagingOpen && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex" onClick={() => setIsMessagingOpen(false)}>
              <div
                className="ml-auto w-full max-w-4xl h-full bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-2xl border-l border-border"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex h-full">
                  {/* Chat Sidebar */}
                  <div className="w-80 border-r border-border bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <ChatSidebar
                      chatRooms={chatRooms}
                      activeChatRoomId={activeChatRoom?.id}
                      onSelectChatRoom={handleSelectChatRoom}
                      onCreateChat={() => { }}
                      className="h-full"
                    />
                  </div>

                  {/* Chat Content */}
                  <div className="flex-1 flex flex-col">
                    {activeChatRoom ? (
                      <>
                        <ChatHeader
                          chatRoom={activeChatRoom}
                          onBack={() => setActiveChatRoom(null)}
                          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-border"
                        />
                        <MessageList
                          messages={messages}
                          currentUserId={user?.id || "current-user"}
                          className="flex-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                        />
                        <MessageInput
                          onSendMessage={handleSendMessage}
                          onSendSticker={handleSendSticker}
                          onSendEmoji={handleSendEmoji}
                          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-t border-border"
                        />
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-gray-800/50 dark:to-gray-900/50">
                        <div className="text-center p-8">
                          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <MessageCircle className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Messages</h3>
                          <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                            Select a conversation from the sidebar to start chatting
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
