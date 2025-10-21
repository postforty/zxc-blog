import VisitorCounter from "@/components/common/analytics/VisitorCounter";

export default function Footer() {
  return (
    <footer className="py-4 mt-8 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
        <VisitorCounter />
        <p className="mt-2">© 2025 My Blog. All rights reserved.</p>
      </div>
    </footer>
  );
}
