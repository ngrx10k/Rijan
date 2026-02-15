/**
 * Admin Dashboard - Management Engine
 */

const firebaseConfig = {
    apiKey: "AIzaSyDcosGTi0MeCOkXFq4DURJeLs9lbLa-cq0",
    authDomain: "com3-564ad.firebaseapp.com",
    projectId: "com3-564ad",
    storageBucket: "com3-564ad.firebasestorage.app",
    messagingSenderId: "788919726183",
    appId: "1:788919726183:web:3bccd28a1ed0fe484a24c2",
    databaseURL: "https://com3-564ad-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

const ADMIN_MAIL = "rijanjoshi66@gmail.com";
let editRefKey = null;

document.addEventListener('DOMContentLoaded', () => {
    // Security Guard
    auth.onAuthStateChanged(user => {
        if (!user || user.email !== ADMIN_MAIL) {
            window.location.href = 'login.html';
        }
    });

    document.getElementById('logout').onclick = () => auth.signOut().then(() => window.location.href = 'login.html');

    // Load Data
    const tableBody = document.getElementById('user-table-body');
    const userCount = document.getElementById('user-count');

    db.ref('users').on('value', (snap) => {
        tableBody.innerHTML = "";
        let count = 0;
        snap.forEach(child => {
            const user = child.val();
            const key = child.key;
            count++;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.displayId || user.email}</td>
                <td><code class="pass-chip">${user.password}</code></td>
                <td><span class="role-tag ${user.role}">${user.role}</span></td>
                <td>
                    <button class="btn-micro edit" onclick="editUser('${key}', '${user.password}')">Edit</button>
                    ${user.email !== ADMIN_MAIL ? `<button class="btn-micro del" onclick="delUser('${key}')">Delete</button>` : 'Master'}
                </td>
            `;
            tableBody.appendChild(row);
        });
        userCount.innerText = count;
    });

    // Logging
    const logs = document.getElementById('log-list');
    db.ref('notifications').limitToLast(5).on('child_added', (snap) => {
        const item = snap.val();
        const div = document.createElement('div');
        div.className = 'log-item';
        div.innerText = `${new Date(item.timestamp).toLocaleTimeString()}: ${item.msg || 'Action recorded'}`;
        logs.prepend(div);
    });

    // Create User
    document.getElementById('create-btn').onclick = async () => {
        const id = document.getElementById('new-id').value.trim();
        const pass = document.getElementById('new-pass').value.trim();

        if (id.length === 0 || pass.length < 6) return alert("ID required. Password must be 6+ characters for security.");

        const ident = id.includes('@') ? id : `${id}@rijan.code`;
        const safe = ident.replace(/\./g, ',');

        try {
            await db.ref('users/' + safe).set({
                email: ident,
                displayId: id,
                password: pass,
                role: 'user',
                timestamp: Date.now()
            });
            await db.ref('notifications').push({ msg: `Admin created user: ${id}`, timestamp: Date.now() });
            alert("Account Authorized! User can now login with this ID/Pass.");
            document.getElementById('new-id').value = "";
            document.getElementById('new-pass').value = "";
        } catch (e) { alert(e.message); }
    };
});

// Modal Logic
window.editUser = (key, pass) => {
    editRefKey = key;
    document.getElementById('edit-pass-val').value = pass;
    document.getElementById('edit-overlay').classList.add('active');
};

window.delUser = async (key) => {
    if (confirm("Permanently delete this user record?")) {
        await db.ref('users/' + key).remove();
        await db.ref('notifications').push({ msg: `Admin deleted record: ${key}`, timestamp: Date.now() });
    }
};

document.getElementById('cancel-edit').onclick = () => document.getElementById('edit-overlay').classList.remove('active');

document.getElementById('save-change').onclick = async () => {
    const newP = document.getElementById('edit-pass-val').value.trim();
    if (newP.length < 6) return alert("Password must be 6+ characters.");

    if (editRefKey) {
        await db.ref('users/' + editRefKey).update({ password: newP });
        await db.ref('notifications').push({ msg: `Updated password for: ${editRefKey}`, timestamp: Date.now() });
        document.getElementById('edit-overlay').classList.remove('active');
        alert("Password updated in database!");
    }
};
