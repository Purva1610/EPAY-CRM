/**
 * Unified Firebase Integration Script for ePay CRM
 * Add this script to any page to enable Firebase features
 * Replaces dummy data with real-time Firestore data
 */

(function() {
    'use strict';
    
    console.log('[Firebase Integration] Loading unified Firebase integration...');
    
    // Check if required scripts are loaded
    function checkDependencies() {
        var requiredScripts = [
            'firebase-config.js',
            'session-manager.js', 
            'realtime-data-service.js'
        ];
        
        var missingScripts = requiredScripts.filter(function(script) {
            return !document.querySelector('script[src*="' + script + '"]');
        });
        
        if (missingScripts.length > 0) {
            console.warn('[Firebase Integration] Missing required scripts:', missingScripts);
            return false;
        }
        
        return true;
    }
    
    // Auto-load Firebase integration when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFirebaseIntegration);
    } else {
        initializeFirebaseIntegration();
    }
    
    function initializeFirebaseIntegration() {
        if (!checkDependencies()) {
            console.warn('[Firebase Integration] Dependencies not loaded, skipping initialization');
            return;
        }
        
        console.log('[Firebase Integration] All dependencies loaded, initializing...');
        
        // Initialize SessionManager
        if (window.SessionManager) {
            SessionManager.init().then(function(session) {
                console.log('[Firebase Integration] Session initialized:', session.sessionId);
                
                // Set up page-specific listeners based on current page
                setupPageSpecificListeners();
                
                // Initialize real-time data for current page
                initializePageData();
            }).catch(function(error) {
                console.error('[Firebase Integration] Session initialization failed:', error);
            });
        }
        
        // Set up global error handler for Firebase operations
        setupFirebaseErrorHandler();
        
        // Set up cleanup on page unload
        window.addEventListener('beforeunload', cleanupFirebaseIntegration);
    }
    
    function setupPageSpecificListeners() {
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        console.log('[Firebase Integration] Setting up listeners for:', currentPage);
        
        // Page-specific real-time listeners
        switch(currentPage) {
            case 'index.html':
                setupLandingPageListeners();
                break;
            case 'admin.html':
            case 'superadmin.html':
                setupAdminDashboardListeners();
                break;
            case 'hr.html':
                setupHRDashboardListeners();
                break;
            case 'telecalling.html':
                setupTelecallingListeners();
                break;
            case 'socialmediamanager.html':
                setupSocialMediaListeners();
                break;
            case 'digital marketing.html':
                setupMarketingListeners();
                break;
            default:
                setupGenericPageListeners();
        }
    }
    
    function setupLandingPageListeners() {
        console.log('[Firebase Integration] Setting up landing page listeners');
        
        // Listen for leads in real-time
        if (window.RealtimeDataService) {
            RealtimeDataService.listenToLeads(function(leads) {
                console.log('[Firebase Integration] Leads updated:', leads.length);
                // Update any lead counters or displays
                updateLeadCounters(leads.length);
            });
            
            // Listen for travel leads
            RealtimeDataService.listenToTravelLeads(function(travelLeads) {
                console.log('[Firebase Integration] Travel leads updated:', travelLeads.length);
                updateTravelLeadCounters(travelLeads.length);
            });
        }
    }
    
    function setupAdminDashboardListeners() {
        console.log('[Firebase Integration] Setting up admin dashboard listeners');
        
        if (window.RealtimeDataService) {
            // Listen to all leads for admin
            RealtimeDataService.listenToLeads(function(leads) {
                updateAdminDashboard(leads);
            }, {}); // No filters for admin
            
            // Listen to all users
            RealtimeDataService.getCollectionData('users', function(users) {
                updateUserList(users);
            });
            
            // Listen to presence
            RealtimeDataService.listenToPresence(function(presence) {
                updatePresenceDisplay(presence);
            });
        }
    }
    
    function setupHRDashboardListeners() {
        console.log('[Firebase Integration] Setting up HR dashboard listeners');
        
        if (window.RealtimeDataService) {
            // Listen to user activities
            RealtimeDataService.listenToSessions(function(sessions) {
                updateHRDashboard(sessions);
            });
        }
    }
    
    function setupTelecallingListeners() {
        console.log('[Firebase Integration] Setting up telecalling listeners');
        
        if (window.RealtimeDataService) {
            // Listen to new leads for telecalling
            RealtimeDataService.listenToLeads(function(leads) {
                updateTelecallingDashboard(leads);
            }, { status: 'new' });
        }
    }
    
    function setupSocialMediaListeners() {
        console.log('[Firebase Integration] Setting up social media listeners');
        
        if (window.RealtimeDataService) {
            // Listen to all leads for social media tracking
            RealtimeDataService.listenToLeads(function(leads) {
                updateSocialMediaDashboard(leads);
            });
        }
    }
    
    function setupMarketingListeners() {
        console.log('[Firebase Integration] Setting up marketing listeners');
        
        if (window.RealtimeDataService) {
            // Listen to campaign data
            RealtimeDataService.getCollectionData('campaigns', function(campaigns) {
                updateMarketingDashboard(campaigns);
            });
        }
    }
    
    function setupGenericPageListeners() {
        console.log('[Firebase Integration] Setting up generic page listeners');
        
        // Generic session tracking for all pages
        if (window.SessionManager) {
            SessionManager.addActivity('page_visit', {
                page: window.location.pathname,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    function initializePageData() {
        console.log('[Firebase Integration] Initializing page data');
        
        // Load page-specific data from Firebase
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        switch(currentPage) {
            case 'index.html':
                loadLandingPageData();
                break;
            case 'admin.html':
            case 'superadmin.html':
                loadAdminDashboardData();
                break;
            default:
                loadGenericPageData();
        }
    }
    
    function loadLandingPageData() {
        console.log('[Firebase Integration] Loading landing page data');
        
        // Load travel packages, destinations, franchise data from Firebase
        // These are already handled by the specific functions in index.html
    }
    
    function loadAdminDashboardData() {
        console.log('[Firebase Integration] Loading admin dashboard data');
        
        if (window.RealtimeDataService) {
            // Load initial dashboard data
            RealtimeDataService.getAllLeads(50).then(function(leads) {
                updateAdminDashboard(leads);
            });
            
            RealtimeDataService.getAllUsers().then(function(users) {
                updateUserList(users);
            });
        }
    }
    
    function loadGenericPageData() {
        console.log('[Firebase Integration] Loading generic page data');
        
        // Load session-specific data for any page
        if (window.RealtimeDataService && window.SessionManager) {
            var sessionInfo = SessionManager.getCurrentSession();
            if (sessionInfo) {
                RealtimeDataService.getLeadsData(10).then(function(leads) {
                    console.log('[Firebase Integration] Loaded', leads.length, 'leads for current session');
                });
            }
        }
    }
    
    // UI Update Functions
    function updateLeadCounters(count) {
        var counters = document.querySelectorAll('[data-leads-count]');
        counters.forEach(function(counter) {
            counter.textContent = count;
        });
    }
    
    function updateTravelLeadCounters(count) {
        var counters = document.querySelectorAll('[data-travel-leads-count]');
        counters.forEach(function(counter) {
            counter.textContent = count;
        });
    }
    
    function updateAdminDashboard(leads) {
        var adminLeadsContainer = document.getElementById('admin-leads-container');
        if (adminLeadsContainer) {
            // Update admin leads display
            var html = leads.map(function(lead) {
                return '<div class="lead-item">' +
                    '<strong>' + (lead.first || lead.name || 'Unknown') + '</strong>' +
                    '<span>' + (lead.phone || 'No phone') + '</span>' +
                    '<span>' + (lead.city || 'No city') + '</span>' +
                    '</div>';
            }).join('');
            adminLeadsContainer.innerHTML = html || '<p>No leads yet</p>';
        }
    }
    
    function updateUserList(users) {
        var usersContainer = document.getElementById('users-container');
        if (usersContainer) {
            var html = users.map(function(user) {
                return '<div class="user-item">' +
                    '<strong>' + (user.displayName || user.email) + '</strong>' +
                    '<span>' + (user.role || 'user') + '</span>' +
                    '</div>';
            }).join('');
            usersContainer.innerHTML = html || '<p>No users yet</p>';
        }
    }
    
    function updatePresenceDisplay(presence) {
        var presenceContainer = document.getElementById('presence-container');
        if (presenceContainer) {
            var html = presence.map(function(p) {
                var statusClass = p.online ? 'online' : 'offline';
                return '<div class="presence-item ' + statusClass + '">' +
                    '<strong>' + (p.displayName || p.userId) + '</strong>' +
                    '<span>' + (p.role || 'user') + '</span>' +
                    '<span class="status">' + (p.online ? '🟢 Online' : '⚫ Offline') + '</span>' +
                    '</div>';
            }).join('');
            presenceContainer.innerHTML = html || '<p>No users online</p>';
        }
    }
    
    function updateHRDashboard(sessions) {
        var hrContainer = document.getElementById('hr-dashboard-container');
        if (hrContainer) {
            var html = sessions.map(function(session) {
                return '<div class="session-item">' +
                    '<strong>' + (session.displayName || session.userId) + '</strong>' +
                    '<span>' + (session.role || 'guest') + '</span>' +
                    '<span>' + (session.activities?.length || 0) + ' activities</span>' +
                    '</div>';
            }).join('');
            hrContainer.innerHTML = html || '<p No session data yet</p>';
        }
    }
    
    function updateTelecallingDashboard(leads) {
        var teleContainer = document.getElementById('telecalling-leads-container');
        if (teleContainer) {
            var html = leads.map(function(lead) {
                return '<div class="tele-lead-item">' +
                    '<strong>' + (lead.first || lead.name || 'Unknown') + '</strong>' +
                    '<span>' + (lead.phone || 'No phone') + '</span>' +
                    '<button onclick="callLead(\'' + lead.phone + '\')">Call</button>' +
                    '</div>';
            }).join('');
            teleContainer.innerHTML = html || '<p>No new leads to call</p>';
        }
    }
    
    function updateSocialMediaDashboard(leads) {
        var socialContainer = document.getElementById('social-leads-container');
        if (socialContainer) {
            var html = leads.map(function(lead) {
                return '<div class="social-lead-item">' +
                    '<strong>' + (lead.first || lead.name || 'Unknown') + '</strong>' +
                    '<span>' + (lead.city || 'Unknown location') + '</span>' +
                    '<span>' + (lead.interest || 'General') + '</span>' +
                    '</div>';
            }).join('');
            socialContainer.innerHTML = html || '<p No leads yet</p>';
        }
    }
    
    function updateMarketingDashboard(campaigns) {
        var marketingContainer = document.getElementById('marketing-dashboard-container');
        if (marketingContainer) {
            var html = campaigns.map(function(campaign) {
                return '<div class="campaign-item">' +
                    '<strong>' + (campaign.name || 'Unnamed Campaign') + '</strong>' +
                    '<span>' + (campaign.status || 'Active') + '</span>' +
                    '<span>' + (campaign.leads || 0) + ' leads</span>' +
                    '</div>';
            }).join('');
            marketingContainer.innerHTML = html || '<p>No campaigns yet</p>';
        }
    }
    
    function setupFirebaseErrorHandler() {
        window.addEventListener('error', function(event) {
            if (event.message && event.message.includes('Firebase')) {
                console.error('[Firebase Integration] Firebase error:', event.message);
                // Could send error to Firebase Crashlytics here
            }
        });
    }
    
    function cleanupFirebaseIntegration() {
        console.log('[Firebase Integration] Cleaning up Firebase integration');
        
        // Clean up real-time listeners
        if (window.RealtimeDataService) {
            RealtimeDataService.cleanupListeners();
        }
        
        // End session properly
        if (window.SessionManager) {
            SessionManager.endSession().catch(function(error) {
                console.error('[Firebase Integration] Error ending session:', error);
            });
        }
    }
    
    // Expose utility functions globally
    window.FirebaseIntegration = {
        updateLeadCounters: updateLeadCounters,
        updateTravelLeadCounters: updateTravelLeadCounters,
        refreshPageData: initializePageData,
        cleanup: cleanupFirebaseIntegration
    };
    
    console.log('[Firebase Integration] Unified Firebase integration loaded successfully');
    
})();