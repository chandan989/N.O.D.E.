import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useWalletStore } from "@/stores/wallet-store";
import { useUserStore } from "@/stores/user-store";
import { UserTypeSelector } from "@/components/features/user-type-selector";

// Page Components
import UserDashboard from "./pages/UserDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import Payments from "./pages/Payments";
import Onboarding from "./pages/Onboarding";
import Governance from "./pages/Governance";
import NotFound from "./pages/NotFound";
import BusinessOffersAndCoupons from "./pages/BusinessOffersAndCoupons";
import LocalExchange from "./pages/LocalExchange";
import BusinessFunds from "./pages/BusinessFunds";
import BusinessModules from "./pages/BusinessModules";
import BusinessLoginPage from "./pages/business-login";
import BusinessRegisterPage from "./pages/business-register";
import BusinessVerificationPage from "./pages/BusinessVerificationPage";

// New User Dashboard Components
import UserOffersAndCoupons from "./pages/UserOffersAndCoupons";
import UserLocalExchange from "./pages/UserLocalExchange";
import UserNodeFund from "./pages/UserNodeFund";
import UserDAO from "@/pages/UserDAO.tsx";
import BusinessNodeFund from "@/pages/BusinessNodeFund.tsx";

const queryClient = new QueryClient();

const App = () => {
  const { isConnected, accountId, balance, connect, disconnect } = useWalletStore();
  const { userType } = useUserStore();

  if (!userType) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
              <Routes>
                <Route path="/" element={<UserTypeSelector />} />
                <Route path="/business-login" element={<BusinessLoginPage />} />
                <Route path="/business-signup" element={<BusinessRegisterPage />} />
                <Route path="*" element={<UserTypeSelector />} />
              </Routes>
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
          <div className="min-h-screen flex flex-col p-4 md:p-8">
            <Header
              isConnected={isConnected}
              accountId={accountId || undefined}
              balance={balance || undefined}
              onConnect={connect}
              onDisconnect={disconnect}
            />
            <main className="w-full max-w-screen-xl mx-auto flex-grow mt-8">
              <Routes>
                {/* Conditional Root Redirect */}
                <Route path="/" element={<Navigate to={userType === 'user' ? "/dashboard" : "/business/dashboard"} replace />} />

                {/* User Routes */}
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/dashboard/offers-and-coupons" element={<UserOffersAndCoupons />} />
                <Route path="/dashboard/local-exchange" element={<UserLocalExchange />} />
                <Route path="/dashboard/payments" element={<Payments />} />
                <Route path="/dashboard/node-fund" element={<UserNodeFund />} />
                <Route path="/dashboard/dao" element={<UserDAO />} />


                {/* Business Routes */}
                <Route path="/business/dashboard" element={<BusinessDashboard />} />
                <Route path="/business/offers-and-coupons" element={<BusinessOffersAndCoupons />} />
                <Route path="/business/local-exchange" element={<LocalExchange />} />
                <Route path="/business/funds" element={<BusinessFunds />} />
                  <Route path="/business/node-funds" element={<BusinessNodeFund />} />
                <Route path="/business/modules" element={<BusinessModules />} />
                <Route path="/business/verify" element={<BusinessVerificationPage />} />

                {/* Other Routes */}
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/governance" element={<Governance />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
