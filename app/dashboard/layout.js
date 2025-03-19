
import { Geist, Geist_Mono } from "next/font/google";
import './style.css'
import DashboardNavbar from "../components/dashboardNavbar";
import Footer from "../components/Footer";




const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata = {
  title: "SmartCart",
  description: "Developed by Chinmay Mk",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <main className="pt-16">
        {children}
      </main>
      <footer className="relative top-0"><Footer/></footer>
    </div>
  );
}
