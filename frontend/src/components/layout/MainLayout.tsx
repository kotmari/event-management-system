import { Outlet } from "react-router-dom";
import { AIChatSidebar } from "../AIChatSidebar";

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* <Header /> */}
      
      <main className="container mx-auto px-4 py-8 flex-1 relative">
        <Outlet /> 
      </main>

      <AIChatSidebar />
    </div>
  );
};