"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useUser();

  const getImageUrl = (url: string | undefined) => {
    if (!url) return "/images/1.jpg";
    if (url.startsWith("http") || url.startsWith("/")) return url;
    if (url.includes("public/uploads/")) return "/" + url.split("public/")[1];
    return "/uploads/" + url.split("/").pop();
  };

  const isAdmin = user?.primaryEmailAddress?.emailAddress === "admin@skyscale.com";

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Search failed:", error);
      }
    };
    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCartCount = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCartCount(data.items?.length || 0);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  useEffect(() => {
    fetchCartCount();
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 relative">
        {/* ✅ Logo (Top Left, aligned perfectly) */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/images/logo1.png"
            alt="SkyScale"
            width={150}
            height={45}
            priority
            className="object-contain hover:opacity-90 transition"
          />
        </Link>

        {/* ✅ Navigation Links (center on desktop) */}
        <div
          className={`${
            menuOpen
              ? "flex flex-col absolute top-full left-0 w-full bg-white border-t border-gray-200 md:hidden"
              : "hidden"
          } md:flex md:flex-row md:items-center md:gap-6 text-gray-700 font-medium`}
        >
          {["Store", "Preorder", "About Us", "Contact"].map((link) => (
            <Link
              key={link}
              href={`/${link.toLowerCase().replace(" ", "")}`}
              className="px-3 py-2 hover:text-sky-600 transition"
            >
              {link}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sky-700 font-semibold hover:text-sky-800 px-3 py-2 transition"
            >
              Admin Panel
            </Link>
          )}
        </div>

        {/* ✅ Right: Search + Cart + Auth */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden sm:block" ref={searchRef}>
            <input
              type="text"
              placeholder="Search products..."
              className="pl-4 pr-9 py-2 text-sm border border-gray-300 rounded-full focus:ring-2 focus:ring-sky-500 focus:outline-none w-56 placeholder-gray-400 bg-gray-50 hover:bg-white transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <Image src="/images/search-icon.svg" alt="Search" width={18} height={18} />
            </button>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-80 overflow-y-auto z-50">
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      router.push(`/products/${product.slug}`);
                      setSearchQuery("");
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition"
                  >
                    <Image
                      src={getImageUrl(product.product_images?.[0]?.image_url)}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-800">{product.name}</div>
                      <div className="text-xs text-gray-500">
                        ₹{(product.price_cents / 100).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link href="/cart" className="relative hover:scale-110 transition-transform">
            <Image src="/images/cart-icon.svg" alt="Cart" width={26} height={26} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-sky-600 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center text-[10px] font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          <SignedOut>
            <div className="flex items-center gap-2">
              <SignInButton>
                <button className="text-xs font-semibold border border-gray-300 text-gray-700 rounded-full px-3 py-1.5 hover:bg-gray-100 transition">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-sky-600 text-white font-semibold rounded-full px-4 py-1.5 text-xs hover:bg-sky-700 transition">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/">
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Orders"
                  labelIcon={<Image src="/images/cart-icon.svg" alt="Orders" width={16} height={16} />}
                  href="/orders"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
