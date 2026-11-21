import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import RoleSelectScreen from './components/RoleSelectScreen';
import RecruiterFeed from './components/RecruiterFeed';
import TalentProfile from './components/TalentProfile';
import ProjectsModal from './components/ProjectsModal';
import ChatModal from './components/ChatModal';
import CreateTalentModal from './components/CreateTalentModal';
import ShortlistDrawer from './components/ShortlistDrawer';
import CheckoutEscrowModal from './components/CheckoutEscrowModal';
import OrdersDrawer from './components/OrdersDrawer';
import BeforeAfterProofModal from './components/BeforeAfterProofModal';
import UrgentGigsModal from './components/UrgentGigsModal';
import RateCardInvoiceModal from './components/RateCardInvoiceModal';
import VoiceStudioModal from './components/VoiceStudioModal';
import LiveSkillTestModal from './components/LiveSkillTestModal';
import AuthModal from './components/AuthModal';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { fallbackTalents } from './data/fallbackTalents';

export default function App() {
  // Navigation screen: 'splash' | 'role-select' | 'feed' | 'profile' | 'login' | 'signup'
  const [currentScreen, setCurrentScreen] = useState(() => {
    try {
      const saved = localStorage.getItem('stageup_auth_user');
      const hash = window.location.hash.toLowerCase();
      if (hash === '#login') return 'login';
      if (hash === '#signup') return 'signup';
      if (hash === '#feed') {
        return saved ? 'feed' : 'login';
      }
    } catch (e) {}
    return 'splash';
  });
  const [previousScreen, setPreviousScreen] = useState('splash');
  const [authPageRole, setAuthPageRole] = useState('recruiter');
  
  // Current Authenticated User (Role-Based Access Control)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('stageup_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [userRole, setUserRole] = useState(() => {
    try {
      const saved = localStorage.getItem('stageup_auth_user');
      return saved ? JSON.parse(saved)?.role : null;
    } catch (e) {
      return null;
    }
  }); // 'talent' | 'recruiter'

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialRole, setAuthModalInitialRole] = useState('recruiter');

  // Talent data
  const [talents, setTalents] = useState(fallbackTalents);
  const [selectedTalent, setSelectedTalent] = useState(fallbackTalents[0]);
  const [selectedCity, setSelectedCity] = useState('All');

  // Shortlisted talent IDs
  const [shortlistedIds, setShortlistedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('stageup_shortlists');
      return saved ? new Set(JSON.parse(saved)) : new Set(['talent_1']);
    } catch (e) {
      return new Set(['talent_1']);
    }
  });

  // Escrow Orders
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('stageup_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Initial sample escrow order for realistic demo
    return [
      {
        _id: 'order_seed_1',
        orderId: 'ESC-912048',
        talentId: 'talent_1',
        talentName: 'Priya Sharma',
        talentPhone: '+919811243210',
        talentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        projectTitle: '30-sec High-Retention Reel (DaVinci Color + Hook)',
        amount: 500,
        currency: 'INR',
        paymentMethod: 'UPI - Google Pay',
        brief: 'Raw camera reel of our Delhi rooftop cafe launch. Add punchy Hindi subtitles.',
        driveLink: 'https://drive.google.com/sample-footage',
        status: 'delivered',
        turnaroundTime: '24 hrs',
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
      }
    ];
  });

  // Modal states
  const [projectsModalTalent, setProjectsModalTalent] = useState(null);
  const [chatModalData, setChatModalData] = useState({ talent: null, project: null });
  const [checkoutModalData, setCheckoutModalData] = useState({ talent: null, project: null });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isShortlistDrawerOpen, setIsShortlistDrawerOpen] = useState(false);
  const [isOrdersDrawerOpen, setIsOrdersDrawerOpen] = useState(false);
  const [proofModalTalent, setProofModalTalent] = useState(null);
  const [isUrgentGigsOpen, setIsUrgentGigsOpen] = useState(false);
  const [rateCardModalTalent, setRateCardModalTalent] = useState(null);
  const [voiceStudioModalTalent, setVoiceStudioModalTalent] = useState(null);

  // Live Skill Tested talent IDs (Anti-Fake Portfolio verification)
  const [testedTalentIds, setTestedTalentIds] = useState(() => {
    try {
      const saved = localStorage.getItem('stageup_tested_talents');
      return saved ? new Set(JSON.parse(saved)) : new Set(['talent_1']);
    } catch (e) {
      return new Set(['talent_1']);
    }
  });
  const [skillTestTalent, setSkillTestTalent] = useState(null);

  // Fetch talents and orders from backend API on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/talents');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setTalents(data);
            setSelectedTalent(data[0]);
          }
        }
      } catch (err) {
        console.warn('Backend API unavailable, using rich client-side seed talents:', err);
      }

      try {
        const resOrders = await fetch('/api/orders');
        if (resOrders.ok) {
          const ordData = await resOrders.json();
          if (Array.isArray(ordData) && ordData.length > 0) {
            setOrders(prev => {
              const combined = [...ordData, ...prev.filter(p => !ordData.some(o => o.orderId === p.orderId))];
              return combined;
            });
          }
        }
      } catch (e) {}
    }
    fetchData();
  }, []);

  // Save shortlisted IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('stageup_shortlists', JSON.stringify([...shortlistedIds]));
    } catch (e) {}
  }, [shortlistedIds]);

  // Save orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('stageup_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  // Save tested talent IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('stageup_tested_talents', JSON.stringify([...testedTalentIds]));
    } catch (e) {}
  }, [testedTalentIds]);

  // Handle Live Skill Test Passed
  const handleSkillTestPassed = (talentId) => {
    setTestedTalentIds(prev => {
      const next = new Set(prev);
      next.add(talentId);
      return next;
    });
  };

  // Toggle Shortlist
  const handleToggleShortlist = async (talent) => {
    const id = talent._id;
    setShortlistedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    // Notify backend
    try {
      await fetch(`/api/talents/${id}/shortlist`, { method: 'POST' });
    } catch (e) {}
  };

  const handleRemoveShortlist = (id) => {
    setShortlistedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // Open Chat
  const handleOpenChat = (talent, project = null) => {
    setChatModalData({ talent, project });
  };

  // Open Escrow Checkout
  const handleOpenBookEscrow = (talent, project = null) => {
    const selectedProj = project || talent.projects?.[0] || {
      title: `${talent.name}'s Featured Project`,
      price: talent.price
    };
    setCheckoutModalData({ talent, project: selectedProj });
  };

  // Handle Order Success
  const handleOrderSuccess = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  // Handle Order Status Update (Approve / Revision)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o => (o._id === orderId || o.orderId === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {}
  };

  // Sync URL hash with back/forward buttons & protect main page
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#login') {
        setCurrentScreen('login');
      } else if (hash === '#signup') {
        setCurrentScreen('signup');
      } else if (hash === '#feed') {
        if (!currentUser) {
          window.location.hash = '#login';
          setCurrentScreen('login');
        } else {
          setCurrentScreen('feed');
        }
      } else if (hash === '#splash' || hash === '' || hash === '#') {
        // Only switch to splash if currently in login or signup
        setCurrentScreen(prev => (prev === 'login' || prev === 'signup' ? 'splash' : prev));
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser]);

  // Strict Auth Guard: Nobody can enter the main marketplace feed without logging in or signing up
  useEffect(() => {
    if (!currentUser) {
      if (currentScreen === 'feed' || currentScreen === 'profile' || currentScreen === 'role-select') {
        setAuthPageRole('recruiter');
        window.location.hash = '#login';
        setCurrentScreen('login');
      }
    }
  }, [currentUser, currentScreen]);

  // Auth Handlers
  const handleAuthSuccess = (user, token) => {
    setCurrentUser(user);
    setUserRole(user.role);
    window.location.hash = '#feed';
    setCurrentScreen('feed');
  };

  const handleLogout = () => {
    localStorage.removeItem('stageup_auth_user');
    localStorage.removeItem('stageup_auth_token');
    setCurrentUser(null);
    setUserRole(null);
    window.location.hash = '#login';
    setCurrentScreen('login');
  };

  const handleOpenAuth = (role = 'recruiter') => {
    setAuthModalInitialRole(role);
    setIsAuthModalOpen(true);
  };

  // Dedicated Page Navigators
  const handleNavigateToLogin = (role = 'recruiter') => {
    setPreviousScreen(currentScreen === 'login' || currentScreen === 'signup' ? 'splash' : currentScreen);
    setAuthPageRole(role);
    window.location.hash = '#login';
    setCurrentScreen('login');
  };

  const handleNavigateToSignup = (role = 'recruiter') => {
    setPreviousScreen(currentScreen === 'login' || currentScreen === 'signup' ? 'splash' : currentScreen);
    setAuthPageRole(role);
    window.location.hash = '#signup';
    setCurrentScreen('signup');
  };

  // On Role Select (requires authentication to enter main page)
  const handleSelectRole = (role) => {
    if (!currentUser) {
      if (role === 'talent') {
        handleNavigateToSignup('talent');
      } else {
        handleNavigateToLogin('recruiter');
      }
      return;
    }
    setUserRole(role);
    if (role === 'talent') {
      setIsCreateModalOpen(true);
      setCurrentScreen('feed');
    } else {
      setCurrentScreen('feed');
    }
  };

  // Handle Talent Created
  const handleTalentCreated = (newTalent) => {
    setTalents(prev => [newTalent, ...prev]);
    setSelectedTalent(newTalent);
    setCurrentScreen('profile');
  };

  const shortlistedTalentsList = talents.filter(t => shortlistedIds.has(t._id));

  return (
    <div className="min-h-screen bg-bg text-text font-sans selection:bg-surface-muted selection:text-accent antialiased">
      {/* SCREEN 1: SPLASH SCREEN / LANDING PAGE */}
      {currentScreen === 'splash' && (
        <SplashScreen
          currentUser={currentUser}
          talents={talents}
          onOpenAuth={handleOpenAuth}
          onNavigateToLogin={handleNavigateToLogin}
          onNavigateToSignup={handleNavigateToSignup}
          onLogout={handleLogout}
          onStart={() => {
            if (!currentUser) {
              handleNavigateToLogin('recruiter');
            } else {
              setCurrentScreen('feed');
            }
          }}
          onSelectRole={(role) => {
            if (!currentUser) {
              if (role === 'talent') {
                handleNavigateToSignup('talent');
              } else {
                handleNavigateToLogin('recruiter');
              }
            } else {
              if (role) {
                handleSelectRole(role);
              } else {
                setCurrentScreen('role-select');
              }
            }
          }}
          onViewTalent={(t) => {
            if (!currentUser) {
              handleNavigateToLogin('recruiter');
            } else {
              setSelectedTalent(t);
              setCurrentScreen('profile');
            }
          }}
        />
      )}

      {/* SCREEN 2: ROLE SELECT */}
      {currentScreen === 'role-select' && (
        <RoleSelectScreen
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onNavigateToLogin={handleNavigateToLogin}
          onNavigateToSignup={handleNavigateToSignup}
          onSelectRole={handleSelectRole}
          onBack={() => setCurrentScreen('splash')}
        />
      )}

      {/* SCREEN 3: RECRUITER FEED (Instagram Reels vertical format) */}
      {currentScreen === 'feed' && (
        <RecruiterFeed
          talents={talents}
          currentUser={currentUser}
          userRole={userRole}
          onOpenAuth={handleOpenAuth}
          onNavigateToLogin={handleNavigateToLogin}
          onNavigateToSignup={handleNavigateToSignup}
          onLogout={handleLogout}
          shortlistedIds={shortlistedIds}
          ordersCount={orders.filter(o => o.status !== 'completed').length}
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          onGoHome={() => setCurrentScreen('splash')}
          onToggleShortlist={handleToggleShortlist}
          onOpenProjects={(t) => setProjectsModalTalent(t)}
          onOpenChat={(t) => handleOpenChat(t)}
          onBookEscrow={(t, proj) => handleOpenBookEscrow(t, proj)}
          onViewProfile={(t) => {
            setSelectedTalent(t);
            setCurrentScreen('profile');
          }}
          onOpenCreate={() => setIsCreateModalOpen(true)}
          onOpenShortlistList={() => setIsShortlistDrawerOpen(true)}
          onOpenOrders={() => setIsOrdersDrawerOpen(true)}
          onOpenProof={(t) => setProofModalTalent(t)}
          onOpenUrgentGigs={() => setIsUrgentGigsOpen(true)}
          onOpenRateCard={(t) => setRateCardModalTalent(t)}
          onOpenVoiceStudio={(t) => setVoiceStudioModalTalent(t)}
          testedTalentIds={testedTalentIds}
          onOpenSkillTest={(t) => setSkillTestTalent(t)}
        />
      )}

      {/* SCREEN 4: TALENT PROFILE */}
      {currentScreen === 'profile' && selectedTalent && (
        <TalentProfile
          talent={selectedTalent}
          currentUser={currentUser}
          onLogout={handleLogout}
          isShortlisted={shortlistedIds.has(selectedTalent._id)}
          onToggleShortlist={handleToggleShortlist}
          onBack={() => setCurrentScreen('feed')}
          onOpenChat={(t, proj) => handleOpenChat(t, proj)}
          onBookEscrow={(t, proj) => handleOpenBookEscrow(t, proj)}
          onOpenProof={(t) => setProofModalTalent(t)}
          onOpenRateCard={(t) => setRateCardModalTalent(t)}
          onOpenVoiceStudio={(t) => setVoiceStudioModalTalent(t)}
          isLiveTested={testedTalentIds.has(selectedTalent._id)}
          onOpenSkillTest={(t) => setSkillTestTalent(t)}
        />
      )}

      {/* SCREEN 5: DEDICATED LOGIN PAGE */}
      {currentScreen === 'login' && (
        <LoginPage
          onBack={() => {
            const dest = previousScreen === 'feed' ? 'feed' : 'splash';
            window.location.hash = dest === 'feed' ? '#feed' : '#splash';
            setCurrentScreen(dest);
          }}
          onNavigateToSignup={() => handleNavigateToSignup(authPageRole)}
          onAuthSuccess={handleAuthSuccess}
          defaultRole={authPageRole}
        />
      )}

      {/* SCREEN 6: DEDICATED SIGNUP PAGE */}
      {currentScreen === 'signup' && (
        <SignupPage
          onBack={() => {
            const dest = previousScreen === 'feed' ? 'feed' : 'splash';
            window.location.hash = dest === 'feed' ? '#feed' : '#splash';
            setCurrentScreen(dest);
          }}
          onNavigateToLogin={() => handleNavigateToLogin(authPageRole)}
          onAuthSuccess={handleAuthSuccess}
          defaultRole={authPageRole}
        />
      )}

      {/* MODAL 1: PROJECTS DRAWER (3 Project Packages with Escrow Booking & Chat) */}
      {projectsModalTalent && (
        <ProjectsModal
          talent={projectsModalTalent}
          onClose={() => setProjectsModalTalent(null)}
          onOpenChat={(t, proj) => handleOpenChat(t, proj)}
          onBookEscrow={(t, proj) => handleOpenBookEscrow(t, proj)}
        />
      )}

      {/* MODAL 2: DIRECT CHAT / WHATSAPP MODAL */}
      {chatModalData.talent && (
        <ChatModal
          talent={chatModalData.talent}
          project={chatModalData.project}
          onClose={() => setChatModalData({ talent: null, project: null })}
        />
      )}

      {/* MODAL 3: INSTANT CHECKOUT & ESCROW BOOKING (UPI / GPay / PhonePe / Cards) */}
      {checkoutModalData.talent && (
        <CheckoutEscrowModal
          talent={checkoutModalData.talent}
          project={checkoutModalData.project}
          onClose={() => setCheckoutModalData({ talent: null, project: null })}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {/* MODAL 4: CREATE TALENT ("Mujhe Kaam Chahiye" - Real Video & Image Upload) */}
      {isCreateModalOpen && (
        <CreateTalentModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={handleTalentCreated}
        />
      )}

      {/* MODAL 5: SHORTLIST DRAWER */}
      <ShortlistDrawer
        isOpen={isShortlistDrawerOpen}
        onClose={() => setIsShortlistDrawerOpen(false)}
        shortlistedTalents={shortlistedTalentsList}
        onRemove={handleRemoveShortlist}
        onViewProfile={(t) => {
          setSelectedTalent(t);
          setCurrentScreen('profile');
        }}
        onOpenChat={(t) => handleOpenChat(t)}
      />

      {/* MODAL 6: ESCROW ORDERS TRACKER */}
      <OrdersDrawer
        isOpen={isOrdersDrawerOpen}
        onClose={() => setIsOrdersDrawerOpen(false)}
        orders={orders}
        onUpdateStatus={handleUpdateOrderStatus}
        onOpenChat={(t) => handleOpenChat(t)}
      />

      {/* MODAL 7: PROOF OF WORK RAW VS FINAL TRANSFORMATION */}
      {proofModalTalent && (
        <BeforeAfterProofModal
          talent={proofModalTalent}
          onClose={() => setProofModalTalent(null)}
          onOpenChat={(t) => handleOpenChat(t)}
          onBookEscrow={(t, proj) => handleOpenBookEscrow(t, proj)}
        />
      )}

      {/* MODAL 8: URGENT 24H GIGS & CASTING CALLS */}
      <UrgentGigsModal
        isOpen={isUrgentGigsOpen}
        onClose={() => setIsUrgentGigsOpen(false)}
        talents={talents}
        onApplyGig={(gig) => {
          handleOpenChat({
            _id: 'recruiter_gig',
            name: gig.recruiter,
            phone: '+919876543210',
            city: gig.city,
            skills: [gig.category]
          }, {
            title: gig.title,
            price: gig.budget
          });
        }}
        onOpenEscrow={(gig) => {
          handleOpenBookEscrow(selectedTalent, {
            title: gig.title,
            price: gig.budget
          });
        }}
      />

      {/* MODAL 9: CREATOR RATE CARD & INSTANT UPI INVOICE GENERATOR */}
      {rateCardModalTalent && (
        <RateCardInvoiceModal
          talent={rateCardModalTalent}
          onClose={() => setRateCardModalTalent(null)}
        />
      )}

      {/* MODAL 10: VOICEOVER AUDITION STUDIO */}
      {voiceStudioModalTalent && (
        <VoiceStudioModal
          talent={voiceStudioModalTalent}
          onClose={() => setVoiceStudioModalTalent(null)}
          onOpenChat={(t) => handleOpenChat(t)}
          onBookEscrow={(t, proj) => handleOpenBookEscrow(t, proj)}
        />
      )}

      {/* MODAL 11: LIVE SKILL TEST (Anti-Fake Portfolio) */}
      {skillTestTalent && (
        <LiveSkillTestModal
          talent={skillTestTalent}
          onClose={() => setSkillTestTalent(null)}
          onTestPassed={handleSkillTestPassed}
          isAlreadyPassed={testedTalentIds.has(skillTestTalent._id)}
        />
      )}

      {/* MODAL 12: ROLE-BASED LOGIN & SIGNUP (RECRUITER VS CREATOR) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialRole={authModalInitialRole}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
