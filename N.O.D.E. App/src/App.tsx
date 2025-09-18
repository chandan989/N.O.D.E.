import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Navigation } from "@/components/layout/navigation";
import { useWalletStore } from "@/stores/wallet-store";
import { useUserStore } from "@/stores/user-store";
import { UserTypeSelector } from "@/components/features/user-type-selector";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import Payments from "./pages/Payments";
import Onboarding from "./pages/Onboarding";
import Governance from "./pages/Governance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { isConnected, accountId, balance, connect, disconnect } = useWalletStore();
  const { userType } = useUserStore();

  // Show user type selector if no user type is selected
  if (!userType) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background p-8"> {/* Increased padding */}
              <UserTypeSelector />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background p-8"> {/* Increased padding */}
            <Header
              isConnected={isConnected}
              accountId={accountId || undefined}
              balance={balance || undefined}
              onConnect={connect}
              onDisconnect={disconnect}
            />
            <Navigation />
            <main className="mt-8"> {/* Added margin-top to main content */}
              <Routes>
                <Route path="/" element={userType === 'business' ? <BusinessDashboard /> : <UserDashboard />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/business" element={<BusinessDashboard />} />
                <Route path="/dashboard/payments" element={<Payments />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/governance" element={<Governance />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
