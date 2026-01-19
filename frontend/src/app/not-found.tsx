import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-heading font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-heading text-white/80 mb-6">
          Page Not Found
        </h2>
        <p className="text-white/60 font-body mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Return Home
        </Link>
      </div>
    </div>
  );
}
