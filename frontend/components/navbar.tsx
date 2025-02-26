import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Syllabus App</h1>
      <div className="space-x-4">
        <Link href="/">
          <span className="text-gray-700 hover:underline cursor-pointer">Home</span>
        </Link>
        <Link href="/upload">
          <span className="text-gray-700 hover:underline cursor-pointer">Upload</span>
        </Link>
        <Link href="/about">
          <span className="text-gray-700 hover:underline cursor-pointer">About</span>
        </Link>
      </div>
    </nav>
  );
}
