/**
 * Login Logic - Final Stable Version
 * Supports: Account IDs (Numeric/Text), Auto-Provisioning, and Admin Mastery.
 */

const firebaseConfig = {
    apiKey: "AIzaSyDcosGTi0MeCOkXFq4DURJeLs9lbLa-cq0",
    authDomain: "com3-564ad.firebaseapp.com",
    databaseURL: "https://com3-564ad-default-rtdb.firebaseio.com",
    projectId: "com3-564ad",
    storageBucket: "com3-564ad.firebasestorage.app",
    messagingSenderId: "788919726183",
    appId: "1:788919726183:web:3bccd28a1ed0fe484a24c2"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.database();

const ADMIN_EMAIL = "rijanjoshi66@gmail.com";
let isLoginMode = true;

document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('auth-form');
    const emailInput = document.getElementById('email');
    const passInput = document.getElementById('password');
    const adminBox = document.getElementById('admin-secure-box');
    const adminTrigger = document.getElementById('admin-trigger');
    const statusMsg = document.getElementById('auth-status');
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');

    // Tab Toggles
    document.getElementById('tab-login').onclick = () => setMode(true);
    document.getElementById('tab-register').onclick = () => setMode(false);
    document.getElementById('switch-tab').onclick = () => setMode(!isLoginMode);

    function setMode(login) {
        isLoginMode = login;
        document.getElementById('tab-login').classList.toggle('active', login);
        document.getElementById('tab-register').classList.toggle('active', !login);
        formTitle.innerText = login ? "Welcome Back" : "Security Shield";
        submitBtn.innerText = login ? "Sign In" : "Register ID";
        document.getElementById('switch-text').innerHTML = login ?
            'New to Rijan.Code? <span id="switch-tab">Register Here</span>' :
            'Already have an account? <span id="switch-tab">Login Here</span>';

        document.getElementById('switch-tab').onclick = () => setMode(!isLoginMode);
    }

    // Admin Recognition (Secret UI)
    emailInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase().trim();
        if (val === ADMIN_EMAIL) {
            adminTrigger.classList.add('visible');
            adminBox.style.display = 'block';
        } else {
            adminTrigger.classList.remove('visible');
            adminBox.style.display = 'none';
        }
    });

    authForm.onsubmit = async (e) => {
        e.preventDefault();
        const rawId = emailInput.value.trim();
        const pass = passInput.value;
        const adminID = document.getElementById('admin-id').value;

        // Map ID to Email format
        let ident = rawId.includes('@') ? rawId : `${rawId}@rijan.code`;

        try {
            authStatus("Verifying Security Level...", "info");

            if (isLoginMode) {
                try {
                    // Try to Login
                    const cred = await auth.signInWithEmailAndPassword(ident, pass);
                    validateProcess(cred.user, adminID);
                } catch (e) {
                    // Fail over to DB check for Admin-Created Users (Numeric/Custom)
                    console.log("Checking Admin Records...");
                    const safe = ident.replace(/\./g, ',');
                    const snap = await db.ref('users/' + safe).once('value');
                    const data = snap.val();

                    if (data && data.password === pass) {
                        // LAZY REGISTRATION: Create Auth Account if matches DB
                        if (pass.length < 6) {
                            throw new Error("Security Error: Admin-created passwords must be at least 6 characters.");
                        }
                        const newUser = await auth.createUserWithEmailAndPassword(ident, pass);
                        validateProcess(newUser.user, adminID);
                    } else {
                        throw new Error("Invalid Credentials or Unregistered ID");
                    }
                }
            } else {
                // REGISTER
                if (pass.length < 6) throw new Error("Password must be at least 6 characters.");

                await auth.createUserWithEmailAndPassword(ident, pass);
                const safe = ident.replace(/\./g, ',');
                await db.ref('users/' + safe).set({
                    email: ident,
                    displayId: rawId,
                    password: pass,
                    role: (ident.toLowerCase() === ADMIN_EMAIL) ? 'admin' : 'user',
                    timestamp: Date.now()
                });

                authStatus("Registration Successful!", "success");
                setTimeout(() => setMode(true), 1500);
            }
        } catch (err) {
            authStatus(err.message, "error");
        }
    };

    async function validateProcess(user, adminInput) {
        if (user.email === ADMIN_EMAIL) {
            if (adminInput === "5656") {
                authStatus("Administrative Access Granted", "success");
                setTimeout(() => window.location.href = 'admindashboard.html', 800);
            } else {
                await auth.signOut();
                authStatus("Master Security Key Incorrect (5656)", "error");
            }
        } else {
            authStatus("Identity Verified", "success");
            setTimeout(() => window.location.href = 'index.html', 800);
        }
    }

    function authStatus(msg, type) {
        statusMsg.innerText = msg;
        statusMsg.style.display = 'block';
        statusMsg.className = `status-msg ${type}`;
    }
});
