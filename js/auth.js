/* ============================================
   SIMORA - AUTHENTICATION SYSTEM
   ============================================ */

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
let sessionTimeoutTimer = null;

// ============================================
// LOGIN FUNCTION
// ============================================

async function login(username, pin) {
    try {
        if (!isValidUsername(username)) {
            return { success: false, message: 'Nama pengguna tidak valid' };
        }
        
        // Find user
        const user = await getUserByUsername(username);
        if (!user) {
            return { success: false, message: 'Nama pengguna tidak ditemukan' };
        }
        
        // Super Admin login can skip PIN
        if (user.role !== 'superadmin') {
            if (!isValidPIN(pin)) {
                return { success: false, message: 'PIN harus 4-6 digit angka' };
            }
            if (user.pin !== pin) {
                return { success: false, message: 'PIN salah' };
            }
        } else {
            if (pin && user.pin !== pin) {
                return { success: false, message: 'PIN salah' };
            }
        }
        
        // Check if this is first login and PIN needs to be changed
        if (!user.pinChanged) {
            setCurrentSession(user);
            return { 
                success: true, 
                firstLogin: true, 
                message: 'Login berhasil. Silakan ubah PIN Anda.',
                user: user 
            };
        }
        
        // Normal login
        setCurrentSession(user);
        await logActivity('login', { username: username });
        
        startSessionTimeout();
        
        return { 
            success: true, 
            firstLogin: false, 
            message: 'Login berhasil',
            user: user 
        };
        
    } catch (err) {
        error('Login error:', err);
        return { success: false, message: 'Terjadi kesalahan saat login' };
    }
}

// ============================================
// LOGOUT FUNCTION
// ============================================

async function logout() {
    try {
        const currentUser = getCurrentUserName();
        
        clearSession();
        stopSessionTimeout();
        
        if (currentUser) {
            await logActivity('logout', { username: currentUser });
        }
        
        return { success: true, message: 'Logout berhasil' };
    } catch (err) {
        error('Logout error:', err);
        clearSession();
        return { success: false, message: 'Logout selesai (dengan peringatan)' };
    }
}

// ============================================
// CHANGE PASSWORD FUNCTION
// ============================================

async function changePin(username, oldPin, newPin, confirmPin) {
    try {
        if (!isValidPIN(newPin)) {
            return { success: false, message: 'PIN baru harus 4-6 digit angka' };
        }
        
        if (newPin !== confirmPin) {
            return { success: false, message: 'PIN konfirmasi tidak cocok' };
        }
        
        if (oldPin === newPin) {
            return { success: false, message: 'PIN baru harus berbeda dengan PIN lama' };
        }
        
        const user = await getUserByUsername(username);
        if (!user) {
            return { success: false, message: 'Pengguna tidak ditemukan' };
        }
        
        if (user.pin !== oldPin) {
            return { success: false, message: 'PIN lama tidak sesuai' };
        }
        
        // Update user PIN
        user.pin = newPin;
        user.pinChanged = true;
        user.lastPinChange = getISOTimestamp();
        
        await updateUser(user);
        
        // Update session if user is logged in
        if (getCurrentUserName() === username) {
            setCurrentSession(user);
        }
        
        await logActivity('change_pin', { username: username });
        
        return { success: true, message: 'PIN berhasil diubah' };
        
    } catch (err) {
        error('Change PIN error:', err);
        return { success: false, message: 'Terjadi kesalahan saat mengubah PIN' };
    }
}

// ============================================
// RESET PASSWORD (SUPER ADMIN ONLY)
// ============================================

async function resetUserPin(username, newPin) {
    try {
        // Check if user is Super Admin
        if (getCurrentUserRole() !== 'superadmin') {
            return { success: false, message: 'Hanya Super Admin yang bisa mereset PIN pengguna' };
        }
        
        if (!isValidPIN(newPin)) {
            return { success: false, message: 'PIN harus 4-6 digit angka' };
        }
        
        const user = await getUserByUsername(username);
        if (!user) {
            return { success: false, message: 'Pengguna tidak ditemukan' };
        }
        
        user.pin = newPin;
        user.pinChanged = false; // Force change on next login
        user.lastPinReset = getISOTimestamp();
        
        await updateUser(user);
        await logActivity('reset_pin', { target_username: username, by: getCurrentUserName() });
        
        return { success: true, message: `PIN pengguna ${username} berhasil direset ke ${newPin}` };
        
    } catch (err) {
        error('Reset PIN error:', err);
        return { success: false, message: 'Terjadi kesalahan saat mereset PIN' };
    }
}

// ============================================
// AUTHORIZATION CHECKS
// ============================================

function isSuperAdmin() {
    return getCurrentUserRole() === 'superadmin';
}

function canEdit() {
    return isSuperAdmin();
}

function canDelete() {
    return isSuperAdmin();
}

function canUpload() {
    return isSuperAdmin();
}

function canManageUsers() {
    return isSuperAdmin();
}

function canManagePhotos() {
    return isSuperAdmin();
}

function canManageLocks() {
    return isSuperAdmin();
}

function canViewLogs() {
    return isSuperAdmin();
}

function canExportData() {
    return true; // All users can export data
}

function canImportData() {
    return isSuperAdmin();
}

function isAuthenticated() {
    return isUserLoggedIn();
}

// ============================================
// SESSION TIMEOUT MANAGEMENT
// ============================================

function startSessionTimeout() {
    clearSessionTimeout();
    
    sessionTimeoutTimer = setInterval(() => {
        const lastActivity = getLastActivity();
        const now = new Date();
        
        if (lastActivity && (now.getTime() - lastActivity.getTime() > SESSION_TIMEOUT)) {
            handleSessionTimeout();
        }
    }, 60000); // Check every minute
}

function stopSessionTimeout() {
    clearSessionTimeout();
}

function clearSessionTimeout() {
    if (sessionTimeoutTimer) {
        clearInterval(sessionTimeoutTimer);
        sessionTimeoutTimer = null;
    }
}

function handleSessionTimeout() {
    stopSessionTimeout();
    clearSession();
    showToast('Sesi Anda berakhir karena tidak ada aktivitas', 'warning', 5000);
    showLoginPage();
}

// ============================================
// ACTIVITY TRACKING
// ============================================

function trackUserActivity() {
    if (isAuthenticated()) {
        updateLastActivity();
    }
}

// Add global activity tracking
document.addEventListener('click', trackUserActivity);
document.addEventListener('keypress', trackUserActivity);
document.addEventListener('mousemove', () => {
    // Debounce to avoid too frequent updates
    if (Math.random() < 0.1) trackUserActivity();
});

// ============================================
// PASSWORD VALIDATION RULES
// ============================================

function validatePasswordStrength(pin) {
    const strength = {
        score: 0,
        feedback: []
    };
    
    if (pin.length >= 4) strength.score++;
    if (pin.length >= 6) strength.score++;
    if (/\d/.test(pin)) strength.score++;
    
    if (pin.length < 4) {
        strength.feedback.push('PIN minimal 4 digit');
    }
    if (!/\d/.test(pin)) {
        strength.feedback.push('PIN harus berisi angka');
    }
    
    return strength;
}

// ============================================
// TWO-FACTOR AUTHENTICATION (Future Enhancement)
// ============================================

// Placeholder for future 2FA implementation
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function verifyOTP(otp, expectedOtp) {
    return otp === expectedOtp;
}
