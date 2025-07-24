import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { BookOpen, Search, Bell, Menu, X } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Discover", isActive: location === "/" },
    { path: "/books", label: "My Books", isActive: location === "/books" },
    { path: "/reviews", label: "Reviews", isActive: location === "/reviews" },
    { path: "/calendar", label: "Calendar", isActive: location === "/calendar" },
  ];

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/">
                <h1 className="text-2xl font-bold text-gray-900 cursor-pointer">
                  <BookOpen className="inline w-7 h-7 text-red-500 mr-2" />
                  BookTrail
                </h1>
              </Link>
              <nav className="hidden md:flex space-x-6">
                {navItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <a className={`transition-colors font-medium ${
                      item.isActive 
                        ? "text-gray-900" 
                        : "text-gray-600 hover:text-red-500"
                    }`}>
                      {item.label}
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  type="text" 
                  placeholder="Search books, authors..."
                  className="w-64 pl-10 border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <Button
                variant="ghost"
                size="sm" 
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              
              <div className="hidden md:flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" />
                        <AvatarFallback>SM</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">Sarah M.</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search books, authors..."
                className="w-full pl-10 border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <a 
                    className={`block py-2 transition-colors font-medium ${
                      item.isActive 
                        ? "text-gray-900" 
                        : "text-gray-600 hover:text-red-500"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
