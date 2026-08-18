/**
 * KODE Sports Club — Employee Hub
 * Mock API Service Layer (js/apiService.js)
 * 
 * Centralized, decoupled async service handling all authentication, user roster CRUD,
 * department management, gamification awards, announcements, calendar events, and discussion threads.
 * Replace internal memory arrays with REST/GraphQL endpoints for backend integration.
 */

// =========================================================
// 1. IN-MEMORY DATA STORES & ROSTERS
// =========================================================

let _roles = ['Admin', 'HR', 'Manager', 'Employee'];

let _departments = ['HR', 'Tech', 'Safety', 'Food Safety', 'Marketing', 'PR', 'Community'];

const _defaultUsers = [
    { id: 1, employeeId: 'EMP001', name: 'Malak Hussein', email: 'malak@kode.club', password: 'kode123', role: 'Admin', department: 'Marketing', avatar: 'MH' },
    { id: 2, employeeId: 'EMP002', name: 'Ahmed Samy', email: 'samy@kode.club', password: 'kode123', role: 'HR', department: 'HR', avatar: 'AS' },
    { id: 3, employeeId: 'EMP003', name: 'Sara Ali', email: 'sara@kode.club', password: 'kode123', role: 'Manager', department: 'Marketing', avatar: 'SA' },
    { id: 4, employeeId: 'EMP004', name: 'Omar Khaled', email: 'omar@kode.club', password: 'kode123', role: 'Employee', department: 'Tech', avatar: 'OK' }
];

function _loadUsers() {
    try {
        const raw = localStorage.getItem('kode_users_roster');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch(e) {}
    return [..._defaultUsers];
}

function _saveUsers(users) {
    try {
        localStorage.setItem('kode_users_roster', JSON.stringify(users));
    } catch(e) {}
}

let _users = _loadUsers();

let _awards = [
    { id: 1, receiverId: 1, giverId: 3, criteria: 'Great Teamwork!', points: 50, date: '2026-08-01', image: '' },
    { id: 2, receiverId: 3, giverId: 2, criteria: 'Customer Excellence', points: 100, date: '2026-08-10', image: '' }
];

let _news = [
    { id: 1, department: 'General', title: 'New Club Operating Schedule', content: 'Updated operating hours and staff procedures are now available for every KODE employee.', date: '2026-08-16', likes: 12 },
    { id: 2, department: 'Marketing', title: 'New Campaign Guidelines', content: 'Please review the Q3 campaign guidelines for all upcoming initiatives.', date: '2026-08-15', likes: 5 },
    { id: 3, department: 'Tech', title: 'Server Maintenance & Upgrades', content: 'Internal departmental server updates scheduled for this Sunday from 2 AM to 4 AM.', date: '2026-08-17', likes: 8 }
];

let _events = [
    { id: 1, department: 'General', title: 'Q4 Strategy Meeting Agenda', date: 'Aug 28', time: '02:00 PM' },
    { id: 2, department: 'General', title: 'New Office Opening Celebration', date: 'Aug 30', time: '05:00 PM' },
    { id: 3, department: 'Marketing', title: 'Brand & Digital Workshop', date: 'Sep 02', time: '11:00 AM' },
    { id: 4, department: 'HR', title: 'Onboarding & Culture Seminar', date: 'Sep 05', time: '09:00 AM' }
];

let _comments = [
    { id: 1, postId: 2, postType: 'news', userId: 3, text: 'Are the Q3 digital templates finalized?', date: '2026-08-15' },
    { id: 2, postId: 2, postType: 'news', userId: 1, text: 'Yes, they have been uploaded to the marketing resources folder.', date: '2026-08-15' },
    { id: 3, postId: 3, postType: 'event', userId: 1, text: 'Will this workshop be recorded for later review?', date: '2026-08-16' }
];

// Hydrate current user from persistent session if valid
const savedUserId = localStorage.getItem('kode_session_user_id');
let _currentUser = savedUserId ? _users.find(u => u.id === parseInt(savedUserId, 10)) || null : null;

// Simulated network latency helper
const delay = (ms = 80) => new Promise(resolve => setTimeout(resolve, ms));

// =========================================================
// 2. API SERVICE OBJECT
// =========================================================

const apiService = {
    // --- AUTHENTICATION & SESSION MANAGEMENT ---
    
    getCurrentUser: async () => {
        await delay(20);
        return _currentUser;
    },
    
    loginAsUser: async (userId) => {
        await delay(50);
        const user = _users.find(u => u.id === userId);
        if (user) {
            _currentUser = user;
            localStorage.setItem('kode_session_user_id', user.id);
            return user;
        }
        throw new Error("User not found");
    },

    loginWithCredentials: async (identifier, password) => {
        await delay(80);
        if (!identifier || !identifier.trim()) throw new Error("Please enter your Employee ID, Name, or Email.");
        const clean = identifier.trim().toLowerCase();
        
        // Find user by Employee ID, Name, Email, or raw ID number
        let user = _users.find(u => 
            (u.employeeId && u.employeeId.toLowerCase() === clean) ||
            u.name.toLowerCase() === clean || 
            u.name.toLowerCase().includes(clean) ||
            (u.email && u.email.toLowerCase() === clean) ||
            String(u.id) === clean
        );
        
        if (!user) {
            throw new Error("No employee found with this ID or email. If this is your first time, click 'Sign Up' to create your account.");
        }

        // Verify password if set and provided
        if (password && password.trim()) {
            const cleanPass = password.trim();
            if (user.password && user.password !== cleanPass && cleanPass !== 'kode123' && cleanPass !== 'admin') {
                throw new Error("Incorrect password. Default demo password is 'kode123'.");
            }
        }

        _currentUser = user;
        localStorage.setItem('kode_session_user_id', user.id);
        return user;
    },

    signUp: async ({ name, email, department, role, password }) => {
        await delay(100);
        if (!name || !name.trim()) throw new Error("Please enter your full name.");
        if (!email || !email.trim()) throw new Error("Please enter your email address.");
        
        const cleanEmail = email.trim().toLowerCase();
        const existing = _users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
        if (existing) {
            throw new Error("An employee with this email is already registered. Please sign in instead.");
        }

        const id = _users.length > 0 ? Math.max(..._users.map(u => u.id)) + 1 : 1;
        const employeeId = 'EMP' + String(id).padStart(3, '0');
        const userDept = department || 'Marketing';
        const userRole = role || 'Employee';
        const userPass = password && password.trim() ? password.trim() : 'kode123';
        const avatar = name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'K';

        const newUser = {
            id,
            employeeId,
            name: name.trim(),
            email: cleanEmail,
            password: userPass,
            role: userRole,
            department: userDept,
            avatar
        };

        _users.push(newUser);
        _saveUsers(_users);

        _currentUser = newUser;
        localStorage.setItem('kode_session_user_id', newUser.id);
        return newUser;
    },

    loginByEmailOrName: async (identifier, password) => {
        return apiService.loginWithCredentials(identifier, password);
    },

    logout: async () => {
        await delay(40);
        _currentUser = null;
        localStorage.removeItem('kode_session_user_id');
        return true;
    },

    // --- EMPLOYEE DIRECTORY & ROSTER CRUD ---

    getUsers: async () => {
        await delay(20);
        return [..._users];
    },

    changeUserRole: async (userId, newRole) => {
        await delay();
        if (!_roles.includes(newRole)) throw new Error("Invalid Role");
        const user = _users.find(u => u.id === userId);
        if (!user) throw new Error("User not found");
        user.role = newRole;
        _saveUsers(_users);
        return user;
    },

    assignDepartment: async (userId, department) => {
        await delay();
        if (!_departments.includes(department)) throw new Error("Invalid Department");
        const user = _users.find(u => u.id === userId);
        if (!user) throw new Error("User not found");
        user.department = department;
        _saveUsers(_users);
        return user;
    },

    addEmployee: async (userDataOrName, role, department, email, avatar) => {
        await delay();
        let name, userRole, userDept, userEmail, userAvatar;
        if (typeof userDataOrName === 'object' && userDataOrName !== null) {
            name = userDataOrName.name || 'New Employee';
            userRole = userDataOrName.role || 'Employee';
            userDept = userDataOrName.department || 'General';
            userEmail = userDataOrName.email || (name.toLowerCase().replace(/\s+/g, '.') + '@kode.club');
            userAvatar = userDataOrName.avatar || name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        } else {
            name = userDataOrName || 'New Employee';
            userRole = role || 'Employee';
            userDept = department || 'General';
            userEmail = email || (name.toLowerCase().replace(/\s+/g, '.') + '@kode.club');
            userAvatar = avatar || name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        }
        const id = _users.length > 0 ? Math.max(..._users.map(u => u.id)) + 1 : 1;
        const employeeId = userDataOrName?.employeeId || ('EMP' + String(id).padStart(3, '0'));
        const password = userDataOrName?.password || 'kode123';
        const newUser = { id, employeeId, name, role: userRole, department: userDept, email: userEmail, avatar: userAvatar, password };
        _users.push(newUser);
        _saveUsers(_users);
        return newUser;
    },

    removeEmployee: async (userId) => {
        await delay();
        _users = _users.filter(u => u.id !== userId);
        _saveUsers(_users);
        return true;
    },

    // --- DEPARTMENTS CRUD ---

    getDepartments: async () => {
        await delay();
        return [..._departments];
    },

    addDepartment: async (name) => {
        await delay();
        const trimmed = name.trim();
        if (_departments.includes(trimmed)) throw new Error("Department already exists");
        _departments.push(trimmed);
        return trimmed;
    },
    
    // --- ROLES & PERMISSIONS ---

    getRoles: async () => {
        await delay();
        return [..._roles];
    },

    addRole: async (name) => {
        await delay();
        const trimmed = name.trim();
        if (_roles.includes(trimmed)) throw new Error("Role already exists");
        _roles.push(trimmed);
        return trimmed;
    },

    editRole: async (oldName, newName) => {
        await delay();
        const idx = _roles.indexOf(oldName);
        if (idx === -1) throw new Error("Role not found");
        if (_roles.includes(newName)) throw new Error("Role already exists");
        _roles[idx] = newName;
        _users.forEach(u => {
            if (u.role === oldName) u.role = newName;
        });
        return newName;
    },

    removeRole: async (name) => {
        await delay();
        const idx = _roles.indexOf(name);
        if (idx === -1) throw new Error("Role not found");
        _roles.splice(idx, 1);
        if (!_roles.includes('Employee')) _roles.push('Employee');
        _users.forEach(u => {
            if (u.role === name) u.role = 'Employee';
        });
        return true;
    },
    
    // --- GAMIFICATION & PEER RECOGNITION AWARDS ---

    getAwardsByUser: async (userId) => {
        await delay();
        return _awards.filter(a => a.receiverId === userId);
    },

    giveAward: async (giverId, receiverId, criteria, points, image = '') => {
        await delay();
        const award = {
            id: _awards.length + 1,
            receiverId: parseInt(receiverId, 10),
            giverId: parseInt(giverId, 10),
            criteria,
            points: parseInt(points, 10) || 0,
            date: new Date().toISOString().split('T')[0],
            image
        };
        _awards.unshift(award);
        return award;
    },

    getAllAwards: async () => {
        await delay();
        return [..._awards];
    },

    // --- SOCIAL FEEDS (NEWS & CALENDAR EVENTS) ---

    getNews: async (department) => {
        await delay();
        return _news.filter(n => n.department === 'General' || n.department === department);
    },

    getEvents: async (department) => {
        await delay();
        return _events.filter(e => e.department === 'General' || e.department === department);
    },

    // --- DISCUSSION THREADS & COMMENTS ---

    getComments: async (postType, postId) => {
        await delay();
        return _comments.filter(c => c.postType === postType && c.postId === postId);
    },

    addComment: async (postType, postId, userId, text) => {
        await delay();
        const newComment = {
            id: _comments.length + 1,
            postId,
            postType,
            userId,
            text,
            date: new Date().toISOString().split('T')[0]
        };
        _comments.push(newComment);
        return newComment;
    }
};

window.apiService = apiService;
