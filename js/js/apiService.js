// js/apiService.js

/**
 * Mock API Service Layer
 * Stores all data in memory and simulates backend delays with Promises.
 */

// Initial Data Stores
let _roles = ['Admin', 'HR', 'Manager', 'Employee'];
let _departments = ['HR', 'Tech', 'Safety', 'Food Safety', 'Marketing', 'PR', 'Community'];

let _users = [
    { id: 1, name: 'Malak Hussein', role: 'Employee', department: 'Marketing', avatar: 'MH' },
    { id: 2, name: 'Ahmed Samy', role: 'HR', department: 'HR', avatar: 'AS' },
    { id: 3, name: 'Sara Ali', role: 'Manager', department: 'Marketing', avatar: 'SA' },
    { id: 4, name: 'Omar Khaled', role: 'Employee', department: 'Tech', avatar: 'OK' }
];

let _awards = [
    { id: 1, receiverId: 1, giverId: 3, criteria: 'Great Teamwork!', points: 50, date: '2026-08-01', image: '' },
    { id: 2, receiverId: 3, giverId: 2, criteria: 'Customer Excellence', points: 100, date: '2026-08-10', image: '' }
];

let _news = [
    { id: 1, department: 'General', title: 'New Leave Policy', content: 'We are updating our annual leave request process.', date: '2026-08-16', likes: 12 },
    { id: 2, department: 'Marketing', title: 'Q3 Campaign Guidelines', content: 'Please review the attached brand guidelines for Q3.', date: '2026-08-15', likes: 5 },
    { id: 3, department: 'Tech', title: 'Server Maintenance', content: 'Servers will be down for 2 hours this Sunday.', date: '2026-08-17', likes: 8 }
];

let _events = [
    { id: 1, department: 'General', title: 'Town Hall Meeting', date: 'Aug 20', time: '10:00 AM' },
    { id: 2, department: 'Marketing', title: 'Brand Workshop', date: 'Aug 22', time: '02:00 PM' },
    { id: 3, department: 'HR', title: 'Onboarding Seminar', date: 'Aug 25', time: '09:00 AM' }
];

let _comments = [
    { id: 1, postId: 1, postType: 'news', userId: 1, text: 'Does this apply to part-time staff?', date: '2026-08-16' }
];

// Mock Current User (Hydrated from session if available)
const savedUserId = localStorage.getItem('kode_session_user_id');
let _currentUser = savedUserId ? _users.find(u => u.id === parseInt(savedUserId, 10)) || null : null;

// Helper to simulate network latency
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

const apiService = {
    // --- AUTH / CURRENT USER ---
    getCurrentUser: async () => {
        await delay(50);
        return _currentUser;
    },
    
    loginAsUser: async (userId) => {
        await delay(150);
        const user = _users.find(u => u.id === userId);
        if (user) {
            _currentUser = user;
            localStorage.setItem('kode_session_user_id', user.id);
            return user;
        }
        throw new Error("User not found");
    },

    loginByEmailOrName: async (identifier) => {
        await delay(200);
        if (!identifier || !identifier.trim()) throw new Error("Please enter your name or email.");
        const clean = identifier.trim().toLowerCase();
        const user = _users.find(u => 
            u.name.toLowerCase() === clean || 
            u.name.toLowerCase().includes(clean) ||
            (u.email && u.email.toLowerCase() === clean)
        );
        if (user) {
            _currentUser = user;
            localStorage.setItem('kode_session_user_id', user.id);
            return user;
        }
        throw new Error("No registered employee found with this name. Please contact HR.");
    },

    logout: async () => {
        await delay(100);
        _currentUser = null;
        localStorage.removeItem('kode_session_user_id');
        return true;
    },

    // --- USERS ---
    getUsers: async () => {
        await delay();
        return [..._users];
    },

    changeUserRole: async (userId, newRole) => {
        await delay();
        if (!_roles.includes(newRole)) throw new Error("Invalid Role");
        const user = _users.find(u => u.id === userId);
        if (!user) throw new Error("User not found");
        user.role = newRole;
        return user;
    },

    assignDepartment: async (userId, department) => {
        await delay();
        if (!_departments.includes(department)) throw new Error("Invalid Department");
        const user = _users.find(u => u.id === userId);
        if (!user) throw new Error("User not found");
        user.department = department;
        return user;
    },

    addEmployee: async (name, role, department) => {
        await delay();
        const id = _users.length > 0 ? Math.max(..._users.map(u => u.id)) + 1 : 1;
        const avatar = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const newUser = { id, name, role, department, avatar };
        _users.push(newUser);
        return newUser;
    },

    removeEmployee: async (userId) => {
        await delay();
        _users = _users.filter(u => u.id !== userId);
        return true;
    },

    // --- DEPARTMENTS ---
    getDepartments: async () => {
        await delay();
        return [..._departments];
    },

    addDepartment: async (name) => {
        await delay();
        if (_departments.includes(name)) throw new Error("Department already exists");
        _departments.push(name);
        return name;
    },
    
    // --- ROLES ---
    getRoles: async () => {
        await delay();
        return [..._roles];
    },

    addRole: async (name) => {
        await delay();
        if (_roles.includes(name)) throw new Error("Role already exists");
        _roles.push(name);
        return name;
    },

    editRole: async (oldName, newName) => {
        await delay();
        const idx = _roles.indexOf(oldName);
        if (idx === -1) throw new Error("Role not found");
        if (_roles.includes(newName)) throw new Error("Role already exists");
        _roles[idx] = newName;
        // Update all users who had the old role
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
        // Fallback for users: reset to 'Employee'
        if (!_roles.includes('Employee')) _roles.push('Employee');
        _users.forEach(u => {
            if (u.role === name) u.role = 'Employee';
        });
        return true;
    },
    
    // --- GAMIFICATION ---
    getAwardsByUser: async (userId) => {
        await delay();
        return _awards.filter(a => a.receiverId === userId);
    },

    giveAward: async (giverId, receiverId, criteria, points, image) => {
        await delay();
        const award = {
            id: _awards.length + 1,
            receiverId,
            giverId,
            criteria,
            points: parseInt(points),
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

    // --- SOCIAL FEEDS (NEWS & EVENTS) ---
    getNews: async (department) => {
        await delay();
        return _news.filter(n => n.department === 'General' || n.department === department);
    },
    getEvents: async (department) => {
        await delay();
        return _events.filter(e => e.department === 'General' || e.department === department);
    },

    // --- COMMENTS ---
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

// Export to window globally for the Vanilla JS app to use
window.apiService = apiService;
