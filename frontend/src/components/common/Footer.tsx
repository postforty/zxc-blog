"use client";

import VisitorCounter from "./analytics/VisitorCounter"; // Adjusted path

export default function Footer() {
  return (
    <footer className="py-4 mt-8 border-t">
      <div className="container px-4 mx-auto text-sm text-center text-gray-500 sm:px-6 lg:px-8">
        <VisitorCounter />
        <p className="mt-2">© 2025 ZXCVB Blog. All rights reserved.</p>
      </div>
    </footer>
  );
}
