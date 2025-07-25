import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { RequireAuth } from '@/components/RequireAuth';
import { AppSkeleton } from '@/components/loaders/AppSkeleton';
import { MarketplaceSkeleton } from '@/components/loaders/MarketplaceSkeleton';

// import { Hero } from '@/components/Hero';
// import { Dashboard } from '@/components/Dashboard';
// import { Marketplace } from '@/components/Marketplace';
// import { CreateJob } from '@/components/CreateJob';
// import { HowItWorks } from '@/components/HowItWorks';
// import { JobDetail } from '@/components/JobDetail';

const Hero = lazy(() => 
  import('@/components/Hero').then(module => ({ default: module.Hero}))
);
const Dashboard = lazy(() =>
  import('@/components/Dashboard').then(module => ({ default: module.Dashboard }))
);
const Marketplace = lazy(() =>  
  import('@/components/Marketplace').then(module => ({ default: module.Marketplace }))
);
const CreateJob = lazy(() => 
  import('@/components/CreateJob').then(module => ({ default: module.CreateJob }))
);
const HowItWorks = lazy(() => 
  import('@/components/HowItWorks').then(module => ({ default: module.HowItWorks }))
);
const JobDetail = lazy(() => 
  import('@/components/JobDetail').then(module => ({ default: module.JobDetail }))
);

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-950">
          <Header />
            <Routes>
              <Route path="/" element={
                  <Suspense fallback={<AppSkeleton />}>
                    <Hero />
                  </Suspense>
                }
              />
              <Route path="/marketplace" element={
                <Suspense fallback={<MarketplaceSkeleton />}>
                  <Marketplace />
                </Suspense>
              } />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <Dashboard onViewChange={() => {}} />
                  </RequireAuth>
                }
              />
              <Route path="/create-job" element={<CreateJob />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/job/:id" element={<JobDetail />} />
            </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;