const content=document.getElementById('content'), toast=document.getElementById('toast'), drawer=document.getElementById('drawer'), modal=document.getElementById('modal');
let page='home', dark=localStorage.getItem('kode-mode') !== 'light', arabic=false, filter='All Club';
document.body.classList.toggle('dark', dark);
let feedIndex=0;

const feedItems=[
  {type:'Club news',icon:'◫',title:'New Club Operating Schedule',dept:'All Club',time:'Posted 10 minutes ago',summary:'Updated operating hours and staff procedures are now available for every KODE employee.',details:'From Sunday, May 17, the club will open at 7:00 AM and close at 11:00 PM. Please review the updated handover, attendance and guest-support procedures before your next shift.',action:'Read announcement'},
  {type:'Department update',icon:'◌',title:'New Campaign Guidelines',dept:'Marketing Department',time:'Posted 1 hour ago',summary:'Please review the Q3 campaign guidelines and share your feedback with the Marketing team.',details:'The refreshed guidelines include audience segments, brand voice examples, the campaign calendar and the approval process. Your feedback is requested by Thursday at 3:00 PM.',action:'Open department update'},
  {type:'Event',icon:'◷',title:'KODE Staff Event',dept:'All Club',time:'Wednesday, May 20 · 3:00 PM',summary:'An afternoon for the full club team at the Main Stadium.',details:'Join the staff event at the Main Stadium from 3:00 PM to 6:00 PM. Light refreshments and team activities will be provided. Please confirm your attendance with your manager.',action:'View event'},
  {type:'Department event',icon:'◷',title:'Digital Marketing Training',dept:'Marketing Department',time:'Wednesday, May 27 · 11:00 AM',summary:'A practical workshop on the new digital campaign toolkit in Training Room 2.',details:'This Marketing-only session covers asset workflows, reporting dashboards and campaign handoff. Bring your laptop and the current campaign brief.',action:'View event'},
  {type:'Club update',icon:'▣',title:'Employee Handbook v2.1',dept:'All Club',time:'Updated 3 hours ago',summary:'The latest handbook includes updated safety and leave guidance.',details:'Version 2.1 clarifies the annual leave request process, emergency response roles and staff benefits. Please acknowledge the revised handbook by the end of the month.',action:'Open handbook'}
];

const notifications=[
 ['purple','◈','New announcement','Company-wide meeting on May 20 at 10:00 AM.','10m ago'],
 ['purple','◌','Marketing Department','New update posted in your department.','1h ago'],
 ['green','✓','Question answered','Your question has been answered by Ahmed Samy.','2h ago'],
 ['yellow','▣','Document updated','Employee Handbook was updated to v2.1.','3h ago']
];

function toastMsg(t,duration=2200){toast.textContent=t;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),duration)}
function go(p){page=p;document.querySelectorAll('.nav[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page===p));render()}
function stat(icon,n,label,cls){return `<div class="stat ${cls}"><div class="s-icon">${icon}</div><strong>${n}</strong><label>${label}</label><a href="#" onclick="event.preventDefault();toastMsg('Opening ${label}')">View ${label.toLowerCase()} →</a></div>`}
function head(k,sub){return `<div class="page-title">${k}</div><div class="sub">${sub}</div>`}
function newsCard(title,dept,desc,tag='New'){return `<div class="news-item"><div class="news-img"></div><div class="news-copy"><span class="pill ${dept==='Marketing'?'primary':''}">${dept}</span><h3>${title}</h3><p>${desc}</p><div class="meta">Marketing Department · 1h ago ${tag?`· <span class="pill new">${tag}</span>`:''}</div></div></div>`}
function eventRow(date,title,time,place,type){let [m,d]=date.split(' ');return `<div class="event"><div class="datebox"><small>${m}</small><b>${d}</b></div><div class="event-main"><b>${title}</b><span>◷ ${time} · ⌖ ${place}</span></div><span class="pill ${type==='Department'?'primary':''}">${type}</span></div>`}
function notificationHtml(){return notifications.map(n=>`<div class="notif"><div class="nicon ${n[0]}">${n[1]}</div><div><b>${n[2]}</b><p>${n[3]}</p><time>${n[4]}</time></div></div>`).join('')}
function feedDeck(){
 const item=feedItems[feedIndex], dots=feedItems.map((_,i)=>`<span class="feed-dot ${i===feedIndex?'active':''}"></span>`).join('');
 return `<section class="feed-section">
 <div class="section-head feed-heading" style="margin-bottom:16px;">
    <div>
        <span class="eyebrow" style="font-size:11px; font-weight:800; letter-spacing:0.18em; color:#ccc3d7; text-transform:uppercase;">YOUR DAILY FEED</span>
        <h2 class="glow-text" style="font-size:38px; font-weight:900; letter-spacing:-0.02em; margin:4px 0 0; color:#fff;">Today at KODE</h2>
    </div>
    <span class="feed-count" style="font-size:12px; color:#ccc3d7; font-weight:600;">${feedIndex+1} of ${feedItems.length}</span>
 </div>
 <div class="feed-stage" id="feedStage" aria-label="Swipeable updates feed">
    <article class="feed-card glass-panel" id="feedCard" tabindex="0" style="padding:28px; display:flex; flex-direction:column;">
        <div class="feed-inner-banner glow-box">
            <h3>KODE</h3>
            <span class="badge">${item.type}</span>
        </div>
        <div class="feed-body" style="padding:0; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
                <h3 style="font-size:24px; font-weight:700; margin-bottom:12px; line-height:1.3; color:var(--ink);">${item.title}</h3>
                <p style="font-size:15px; color:var(--muted); line-height:1.55;">${item.summary}</p>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:28px; flex-wrap:wrap; gap:10px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span class="pill ${item.dept.includes('Marketing')?'primary':''}" style="font-weight:bold; letter-spacing:0.05em; text-transform:uppercase;">${item.dept}</span>
                    <time style="color:var(--muted); font-size:13px; font-weight:600;">${item.time}</time>
                </div>
                <div style="display:flex; align-items:center; gap:12px;">
                    <button class="feed-action-btn" onclick="advanceFeed()" title="Next update">Next <span style="font-size:14px;">→</span></button>
                    <button class="feed-action-btn primary" onclick="openFeedDetails()" title="View details"><span>ℹ</span> Details</button>
                </div>
            </div>
        </div>
    </article>
 </div>
 <div class="feed-dots" aria-label="${feedItems.length} feed items">${dots}</div><p class="feed-instructions">Swipe left for the next update · Swipe right to open details</p>
 </section>`;
}
function advanceFeed(){feedIndex=(feedIndex+1)%feedItems.length;render()}
function previousFeed(){feedIndex=(feedIndex-1+feedItems.length)%feedItems.length;render()}
function openFeedDetails(){const item=feedItems[feedIndex],action=item.dept.includes('Marketing')?"go('department')":`toastMsg('Opening ${item.action}')`;modal.classList.add('show');document.getElementById('modalBody').innerHTML=`<span class="pill ${item.dept.includes('Marketing')?'primary':''}">${item.dept}</span><h2 class="feed-modal-title">${item.title}</h2><p class="feed-modal-meta">${item.type} · ${item.time}</p><p class="feed-modal-copy">${item.details}</p><button class="btn" onclick="document.getElementById('closeModal').click();${action}">${item.action}</button>`}
function bindFeedSwipe(){const card=document.getElementById('feedCard');if(!card)return;let startX=0,deltaX=0,dragging=false;const reset=()=>{card.style.transform='';card.style.opacity='';card.classList.remove('dragging','leaving-left','leaving-right')};const move=e=>{if(!dragging)return;deltaX=e.clientX-startX;card.style.transform=`translateX(${deltaX}px) rotate(${deltaX/28}deg)`};const finish=()=>{if(!dragging)return;dragging=false;window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',finish);window.removeEventListener('pointercancel',cancel);if(deltaX<=-55){card.classList.add('leaving-left');setTimeout(advanceFeed,180)}else if(deltaX>=55){card.classList.add('leaving-right');setTimeout(openFeedDetails,180);setTimeout(reset,190)}else reset()};const cancel=()=>{dragging=false;window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',finish);window.removeEventListener('pointercancel',cancel);reset()};card.addEventListener('pointerdown',e=>{startX=e.clientX;deltaX=0;dragging=true;card.classList.add('dragging');window.addEventListener('pointermove',move);window.addEventListener('pointerup',finish);window.addEventListener('pointercancel',cancel)});card.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')advanceFeed();if(e.key==='ArrowRight')openFeedDetails()});let isSwiping=false;card.addEventListener('wheel',e=>{if(isSwiping)return;if(Math.abs(e.deltaX)>Math.abs(e.deltaY)&&Math.abs(e.deltaX)>15){e.preventDefault();isSwiping=true;if(e.deltaX>0){card.classList.add('leaving-left');setTimeout(()=>{advanceFeed();isSwiping=false},180)}else{card.classList.add('leaving-right');setTimeout(()=>{openFeedDetails();isSwiping=false;reset()},180)}}else if(Math.abs(e.deltaY)>Math.abs(e.deltaX)&&Math.abs(e.deltaY)>15){e.preventDefault();isSwiping=true;if(e.deltaY<0){card.style.transform='translateY(120%) rotate(-5deg)';card.style.opacity='0';setTimeout(()=>{previousFeed();isSwiping=false},180)}else{card.style.transform='translateY(-120%) rotate(5deg)';card.style.opacity='0';setTimeout(()=>{advanceFeed();isSwiping=false},180)}}},{passive:false})}
async function home(){
    const news = await window.apiService.getNews(currentUser.department);
    const recentItems = news.slice(0, 2).map(n => `
        <a class="glass-panel recent-news-item" href="#" onclick="event.preventDefault();go('news')">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                <span style="font-size:12px;color:var(--muted);font-weight:600">${n.date}</span>
                <span class="badge" style="font-size:10px;padding:3px 10px;background:rgba(211,187,255,0.14);border:1px solid rgba(211,187,255,0.25);border-radius:99px;color:var(--primary);font-weight:700">${n.department === 'General' ? 'Club news' : n.department}</span>
            </div>
            <h4 style="margin:0 0 6px;font-size:15px;font-weight:700;color:var(--ink);line-height:1.35">${n.title}</h4>
            <p style="margin:0;font-size:13px;color:var(--muted);line-height:1.55">${n.content}</p>
        </a>
    `).join('');

    return `${feedDeck()}
    <section style="margin-top:32px;max-width:820px;margin-left:auto;margin-right:auto;padding-bottom:40px">
        <h3 style="font-size:18px;font-weight:700;color:var(--ink);margin:0 0 16px;letter-spacing:-.01em">Recent News &amp; Events</h3>
        <div style="display:flex;flex-direction:column;gap:12px">${recentItems}</div>
    </section>`;
}
function doc(i,t,s){return `<div class="doc"><div class="doc-icon">${i}</div><div class="doc-main"><b>${t}</b><span>${s}</span></div><span>›</span></div>`}
function quick(t,i){return `<button class="quick" onclick="toastMsg('Opening ${t}')"><div class="qicon">${i}</div><b>${t}</b><span>Open →</span></button>`}

async function newsPage() {
    const news = await window.apiService.getNews(currentUser.department);
    const html = news.map(n => `
        <div class="card large-card">
            <span class="pill ${n.department !== 'General' ? 'primary' : ''}">${n.department}</span>
            <h3>${n.title}</h3>
            <p>${n.content}</p>
            <div style="margin-top:15px;display:flex;justify-content:space-between;align-items:center">
                <small style="color:var(--muted)">${n.date} · ${n.likes} likes</small>
                <button class="btn light" onclick="openComments('news', ${n.id}, '${n.title.replace(/'/g, "\\'")}')">💬 Comments</button>
            </div>
        </div>
    `).join('');

    return `${head('News','Stay up to date with official club announcements and information relevant to your department.')}
    <div class="page-grid">${html}</div>`;
}

async function eventsPage() {
    const events = await window.apiService.getEvents(currentUser.department);
    const html = events.map(e => `
        <div class="event" style="padding:15px">
            <div class="datebox"><b>${e.date.split(' ')[1]}</b><small>${e.date.split(' ')[0]}</small></div>
            <div class="event-main">
                <b>${e.title}</b>
                <span>${e.time} · <span class="pill">${e.department}</span></span>
            </div>
            <button class="btn light" onclick="openComments('event', ${e.id}, '${e.title.replace(/'/g, "\\'")}')">💬 Discuss</button>
        </div>
    `).join('');

    return `${head('Events','Your personalized calendar combines club events with events from your department.')}
    <div class="page-grid">
        <div class="card event-list">${html}</div>
        <div class="card calendar">${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div class="day"><b>${d}</b></div>`).join('')}${Array.from({length:31},(_,i)=>`<div class="day"><b>${i+1}</b>${[16,20,27].includes(i+1)?'<small>● event</small>':''}</div>`).join('')}</div>
    </div>`;
}

async function departmentPage() {
    const dept = currentUser.department;
    const allUsers = await window.apiService.getUsers();
    
    // Org Chart Logic
    const deptUsers = allUsers.filter(u => u.department === dept);
    const managers = deptUsers.filter(u => u.role === 'Manager');
    const teamLeads = deptUsers.filter(u => u.role !== 'Manager' && u.role !== 'Employee');
    const employees = deptUsers.filter(u => u.role === 'Employee');

    const renderOrgLevel = (users, title) => {
        if(users.length === 0) return '';
        return `
            <h3 style="margin-top:15px;font-size:11px;color:var(--muted)">${title}</h3>
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px">
                ${users.map(u => `<div class="card" style="padding:10px;display:flex;gap:10px;align-items:center;min-width:180px">
                    <div class="avatar sm">${u.avatar}</div>
                    <div><b>${u.name}</b><br><small style="color:var(--muted)">${u.role}</small></div>
                </div>`).join('')}
            </div>
        `;
    };

    const orgChartHtml = `
        <div class="card" style="padding:20px;margin-bottom:20px;background:var(--card)">
            <h2>Organization Hierarchy</h2>
            <p style="font-size:11px;color:var(--muted)">Reporting lines for ${dept} Department</p>
            ${renderOrgLevel(managers, 'Department Managers')}
            ${renderOrgLevel(teamLeads, 'Team Leads & Specialists')}
            ${renderOrgLevel(employees, 'Colleagues')}
        </div>
    `;

    const news = await window.apiService.getNews(dept);
    const deptNews = news.filter(n => n.department === dept);
    const newsHtml = deptNews.length ? deptNews.map(n => `
        <div class="news-item" style="display:block">
            <h3>${n.title}</h3>
            <p style="margin-bottom:8px">${n.content}</p>
            <button class="btn light" onclick="openComments('news', ${n.id}, '${n.title.replace(/'/g, "\\'")}')">Comments</button>
        </div>
    `).join('') : '<p style="color:var(--muted);padding:10px">No department specific news.</p>';

    return `<div class="welcome"><div><div class="eyebrow">PRIVATE WORKSPACE</div><h1 class="page-title">${dept} Department</h1><p class="sub">Private content for employees assigned to ${dept}. Other departments are not visible here.</p></div></div>
    ${orgChartHtml}
    <div class="two-col section">
        <div>
            <div class="section-head"><h2>Department News</h2></div>
            <div class="card news-list">${newsHtml}</div>
        </div>
        <div>
            <div class="section-head"><h2>Ask Your Department</h2></div>
            <div class="card form"><input id="q" placeholder="What do you need help with?"><textarea placeholder="Add more details (optional)"></textarea><button class="btn" onclick="ask()">Submit Question</button><small style="color:var(--muted)">Your question is visible only to ${dept} employees and department admins.</small></div>
        </div>
    </div>`;
}

function resourcesPage(){return `${head('Resources','Policies, procedures, forms and department resources — filtered by your permissions.')}<div class="toolbar"><button class="filter active">All</button><button class="filter">Policies</button><button class="filter">Procedures</button><button class="filter">Forms</button><button class="filter">Marketing</button></div><div class="page-grid">${[['PDF','Employee Handbook v2.1','Policy','Updated 2h ago'],['DOC','Marketing Guidelines v3.0','Department','Updated 1d ago'],['PDF','Safety Procedures v2.4','Training','Updated 2d ago'],['FORM','Leave Request Form','Forms','Updated Aug 10'],['DOC','Brand Request Template','Marketing','Updated Aug 8'],['PDF','Emergency Procedure','Safety','Updated Aug 1']].map(x=>`<div class="card large-card"><div class="doc" style="border:0"><div class="doc-icon">${x[0]}</div><div class="doc-main"><b>${x[1]}</b><span>${x[2]} · ${x[3]}</span></div></div><button class="btn light" onclick="toastMsg('Document opened')">Open resource</button></div>`).join('')}</div>`}

function contactsPage(){return `${head('Who do I contact?','Find the right person without searching through the whole organization.')}<div class="card form" style="margin-bottom:14px"><input id="contactSearch" placeholder="Search by team, service or person..." oninput="contactFilter()"></div><div class="contact-grid" id="contacts">${[['HR','Payroll','Payroll Team'],['Tech','IT Support','IT Helpdesk'],['Operations','Operations Support','Operations Team'],['Security','Security Desk','Security Team'],['Food Safety','Food Safety','Food Safety Team'],['Marketing','Marketing Manager','Marketing Team']].map(c=>`<div class="card contact" data-key="${c.join(' ').toLowerCase()}"><span class="pill">${c[0]}</span><h3>${c[1]}</h3><p>${c[2]}</p><small style="color:var(--muted)">Available · Internal contact</small><br><br><button class="btn light" onclick="toastMsg('Contact options opened')">Contact</button></div>`).join('')}</div>`}
function faqsPage(){return `${head('FAQs','General answers plus questions relevant to your Marketing Department.')}<div class="page-grid">${[['General','How do I request annual leave?','Use the Leave Request Form in Resources.'],['General','Where can I find the employee handbook?','Open Resources → Policies.'],['Marketing','How do I request marketing materials?','Use the Marketing Request Form.'],['Marketing','Where are the brand guidelines?','Open My Department → Resources.']].map(f=>`<div class="card large-card"><span class="pill ${f[0]==='Marketing'?'primary':''}">${f[0]}</span><h3>${f[1]}</h3><p>${f[2]}</p><button class="view" onclick="toastMsg('Answer opened')">Read answer →</button></div>`).join('')}</div>`}
function feedbackPage(){return `${head('Employee Feedback','Your voice matters. Submit a suggestion, problem or improvement idea.')}<div class="two-col"><div class="card form"><select><option>Suggestion</option><option>Problem</option><option>Improvement idea</option><option>General feedback</option></select><textarea id="feedback" placeholder="Tell us what you think..."></textarea><label style="font-size:9px;color:var(--muted)"><input type="checkbox"> Submit anonymously</label><button class="btn" onclick="submitFeedback()">Submit Feedback</button></div><div class="card qa"><div class="qa-row"><span class="pill status">Under Review</span><h4>Improve staff event reminders</h4><p>Submitted Aug 12</p></div><div class="qa-row"><span class="pill primary status">In Progress</span><h4>More department templates</h4><p>Submitted Aug 5</p></div></div></div>`}
async function recognitionPage() {
    const awards = await window.apiService.getAllAwards();
    const users = await window.apiService.getUsers();
    
    const myAwards = awards.filter(a => a.receiverId === currentUser.id);
    const myPoints = myAwards.reduce((sum, a) => sum + a.points, 0);

    const awardCards = awards.map(a => {
        const receiver = users.find(u => u.id === a.receiverId);
        const giver = users.find(u => u.id === a.giverId);
        return `<div class="card large-card">
            <div style="display:flex;gap:10px;align-items:center">
                <div class="avatar">${receiver?.avatar || '??'}</div>
                <div>
                    <b style="font-size:11px">${receiver?.name || 'Unknown'}</b>
                    <div><span class="pill primary">★ ${a.points} pts</span></div>
                </div>
            </div>
            <p style="margin-top:10px;font-size:14px"><b>${a.criteria}</b></p>
            <small style="color:var(--muted)">Awarded by ${giver?.name || 'Admin'} on ${a.date}</small>
        </div>`;
    }).join('');

    const canAward = ['Admin', 'HR', 'Manager'].includes(currentUser.role);
    const awardBtn = canAward ? `<button class="btn" onclick="openAwardModal()">+ Grant an Award</button>` : '';

    return `${head('KODE Recognition', 'Celebrate colleagues who make a difference.')}
    <div class="two-col" style="margin-bottom:20px;gap:15px">
        <div class="card" style="background:var(--primary);color:#fff">
            <h3 style="color:#fff;opacity:0.8">Your Trophy Room</h3>
            <h1 style="font-size:32px;margin:5px 0">★ ${myPoints}</h1>
            <p style="color:#fff;font-size:11px">Total Points Earned</p>
        </div>
        <div style="display:flex;align-items:center;justify-content:flex-start">
            ${awardBtn}
        </div>
    </div>
    <div class="page-grid">${awardCards}</div>`;
}

async function adminPage() {
    const users = await window.apiService.getUsers();
    const depts = await window.apiService.getDepartments();
    const roles = await window.apiService.getRoles();

    let userRows = users.map(u => {
        return `<div class="card contact" style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
            <div><b>${u.name}</b><br><small>${u.role} · ${u.department}</small></div>
            <div style="display:flex;gap:5px;align-items:center">
                <select class="kode-select" onchange="updateRole(${u.id}, this.value)">
                    ${roles.map(r => `<option ${r===u.role?'selected':''}>${r}</option>`).join('')}
                </select>
                <select class="kode-select" onchange="updateDept(${u.id}, this.value)">
                    ${depts.map(d => `<option ${d===u.department?'selected':''}>${d}</option>`).join('')}
                </select>
                <button class="btn" style="background:#e74c3c;padding:6px;min-width:32px" onclick="removeEmp(${u.id})" title="Remove Employee">🗑️</button>
            </div>
        </div>`;
    }).join('');
    
    let roleRows = roles.map(r => {
        return `<div style="display:flex;justify-content:space-between;margin-bottom:5px">
            <span class="pill">${r}</span>
            <div style="display:flex;gap:5px">
                <button class="btn light" style="padding:4px 8px" onclick="editR('${r}')">Edit</button>
                <button class="btn light" style="padding:4px 8px;color:#e74c3c" onclick="removeR('${r}')">Del</button>
            </div>
        </div>`;
    }).join('');

    return `${head('Admin Panel', 'Manage users, roles, and departments.')}
    <div class="two-col">
        <div>
            <div class="section-head" style="display:flex;justify-content:space-between;align-items:center">
                <h2 style="margin:0">All Employees</h2>
                <button class="btn" onclick="openAddEmpModal()">+ Add Employee</button>
            </div>
            <div id="adminUserList">${userRows}</div>
        </div>
        <div>
            <div class="card form" style="margin-bottom:15px">
                <h3>Add Department</h3>
                <input id="newDeptName" placeholder="Department Name">
                <button class="btn" onclick="addNewDept()">Add Department</button>
            </div>
            <div class="card form" style="margin-bottom:15px">
                <h3>Manage Roles</h3>
                ${roleRows}
                <hr style="margin:10px 0;border:0;border-top:1px solid var(--line)">
                <input id="newRoleName" placeholder="New Role Name">
                <button class="btn light" onclick="addNewRole()">Add Role</button>
            </div>
            <div class="card qa">
                <h3>Current Departments</h3>
                <div style="display:flex;gap:5px;flex-wrap:wrap">
                    ${depts.map(d => `<span class="pill">${d}</span>`).join('')}
                </div>
            </div>
        </div>
    </div>`;
}

async function render(){
  const pages={home:()=>home(),news:newsPage,events:eventsPage,department:departmentPage,resources:resourcesPage,contacts:contactsPage,faqs:faqsPage,feedback:feedbackPage,recognition:recognitionPage,admin:adminPage};
  let html = pages[page]();
  if (html instanceof Promise) {
      html = await html;
  }
  content.innerHTML=html;
  if(page==='home')bindFeedSwipe();
}
function contactFilter(){let q=document.getElementById('contactSearch').value.toLowerCase();document.querySelectorAll('.contact').forEach(x=>x.style.display=x.dataset.key.includes(q)?'block':'none')}
function ask(){let q=document.getElementById('q').value.trim();if(!q)return toastMsg('Please write your question first');toastMsg('Question submitted to Marketing')}
function submitFeedback(){if(!document.getElementById('feedback').value.trim())return toastMsg('Please add your feedback');toastMsg('Feedback submitted successfully')}
function openAsk(){go('department');setTimeout(()=>document.getElementById('q')?.focus(),50)}
function openNotifications(){document.getElementById('notificationList').innerHTML=notificationHtml();drawer.classList.add('show')}
document.querySelectorAll('.nav[data-page]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.page)));
document.getElementById('notifications').onclick=openNotifications;
document.getElementById('closeDrawer').onclick=()=>drawer.classList.remove('show');
function toggleAppearance(){dark=!dark;document.body.classList.toggle('dark',dark);localStorage.setItem('kode-mode',dark?'dark':'light');toastMsg(dark?'Dark mode enabled':'Light mode enabled',800)}
document.getElementById('theme').onclick=toggleAppearance;
document.getElementById('language').onclick=()=>{arabic=!arabic;document.documentElement.dir=arabic?'rtl':'ltr';document.body.classList.toggle('rtl',arabic);document.getElementById('language').innerHTML=arabic?'◉ AR ⌄':'◉ EN ⌄';toastMsg(arabic?'تم تفعيل العربية':'English enabled')};
document.getElementById('settings').onclick=()=>{modal.classList.add('show');document.getElementById('modalBody').innerHTML=`<h2 style="font-size:18px">Settings</h2><p style="color:var(--muted);font-size:11px">Personalize your KODE experience.</p><div class="form"><button class="btn light" onclick="document.getElementById('language').click();document.getElementById('closeModal').click()">Language · English / العربية</button><button class="btn light" onclick="document.getElementById('theme').click();document.getElementById('closeModal').click()">Appearance · Light / Dark</button><button class="btn light" onclick="toastMsg('Notification preferences opened');document.getElementById('closeModal').click()">Notification preferences</button></div>`};
document.getElementById('closeModal').onclick=()=>modal.classList.remove('show');
document.getElementById('logout').onclick = () => handleLogout();
document.getElementById('mobileMenu').onclick=()=>document.querySelector('.sidebar').classList.toggle('mobile-open');
document.getElementById('search').addEventListener('keydown',e=>{if(e.key==='Enter'){go('news');toastMsg('Showing searchable content')}})
document.addEventListener('keydown',e=>{if(e.key==='Escape'){modal.classList.remove('show');drawer.classList.remove('show')}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();document.getElementById('search').focus()}})

let currentUser = null;

async function showLogin() {
    const mainApp = document.getElementById('mainApp');
    const loginScreen = document.getElementById('loginScreen');
    if (mainApp) mainApp.style.display = 'none';
    if (loginScreen) {
        loginScreen.style.display = 'flex';
        document.getElementById('loginError').style.display = 'none';
        const loginInput = document.getElementById('loginInput');
        loginInput.value = '';
        setTimeout(() => loginInput.focus(), 100);
    }
    
    // Hide pet companion on login page
    const buddy = document.getElementById('petCompanion');
    const controls = document.getElementById('petControls');
    const pill = document.getElementById('petShowPill');
    if(buddy) buddy.style.display = 'none';
    if(controls) controls.style.display = 'none';
    if(pill) pill.style.display = 'none';
}

async function showApp() {
    const loginScreen = document.getElementById('loginScreen');
    const mainApp = document.getElementById('mainApp');
    if (loginScreen) loginScreen.style.display = 'none';
    if (mainApp) mainApp.style.display = 'flex';
    
    // Restore pet companion
    const buddy = document.getElementById('petCompanion');
    const controls = document.getElementById('petControls');
    const pill = document.getElementById('petShowPill');
    if(buddy) buddy.style.display = '';
    if(controls) controls.style.display = '';
    if(pill) pill.style.display = '';
    
    updateUserUI();
    render();
}

window.handleLoginSubmit = async () => {
    const input = document.getElementById('loginInput').value.trim();
    const errEl = document.getElementById('loginError');
    const btn = document.getElementById('loginBtn');
    
    if(!input) {
        errEl.innerText = "Please enter your name or email.";
        errEl.style.display = 'block';
        return;
    }
    
    btn.disabled = true;
    btn.innerHTML = `<span>Verifying...</span>`;
    
    try {
        currentUser = await window.apiService.loginByEmailOrName(input);
        errEl.style.display = 'none';
        toastMsg('Welcome back, ' + currentUser.name + '!');
        showApp();
    } catch(err) {
        errEl.innerText = err.message || "User not recognized.";
        errEl.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<span>Enter Employee Hub</span><span class="material-symbols-outlined">arrow_forward</span>`;
    }
};

window.loginQuickUser = async (userId) => {
    try {
        currentUser = await window.apiService.loginAsUser(userId);
        toastMsg('Signed in as ' + currentUser.name);
        showApp();
    } catch(err) {
        toastMsg(err.message);
    }
};

window.handleLogout = async () => {
    if(!confirm("Are you sure you want to log out of KODE Hub?")) return;
    await window.apiService.logout();
    currentUser = null;
    toastMsg('Logged out successfully');
    showLogin();
};

async function initApp() {
    currentUser = await window.apiService.getCurrentUser();
    if(currentUser) {
        showApp();
    } else {
        showLogin();
    }
}

function updateUserUI() {
    document.getElementById('userName').innerText = currentUser.name;
    document.getElementById('userAvatar').innerText = currentUser.avatar;
    document.getElementById('userRoleBadge').innerText = currentUser.role + ' · ' + currentUser.department;
    
    document.getElementById('sidebarName').innerText = currentUser.name;
    document.getElementById('sidebarAvatar').innerText = currentUser.avatar;
    document.getElementById('sidebarJobTitle').innerText = currentUser.role;
    document.getElementById('sidebarDept').innerText = currentUser.department + ' Department';

    if (currentUser.role === 'Admin' || currentUser.role === 'HR') {
        document.getElementById('navAdmin').style.display = 'flex';
    } else {
        document.getElementById('navAdmin').style.display = 'none';
        if(page === 'admin') go('home');
    }
}

document.getElementById('roleSwitcher').onclick = async () => {
    const users = await window.apiService.getUsers();
    let buttons = users.map(u => `<button class="btn light" style="margin-bottom:5px;width:100%" onclick="switchRole(${u.id})">${u.name} (${u.role} - ${u.department})</button>`).join('');
    modal.classList.add('show');
    document.getElementById('modalBody').innerHTML = `<h2>Switch Role (Dev Tool)</h2><div class="form">${buttons}</div>`;
};

window.switchRole = async (id) => {
    await window.apiService.loginAsUser(id);
    currentUser = await window.apiService.getCurrentUser();
    updateUserUI();
    document.getElementById('closeModal').click();
    toastMsg('Switched to ' + currentUser.name);
    render();
};

window.updateRole = async (userId, role) => {
    await window.apiService.changeUserRole(userId, role);
    toastMsg('Role updated');
    render();
};
window.updateDept = async (userId, dept) => {
    await window.apiService.assignDepartment(userId, dept);
    toastMsg('Department updated');
    render();
};
window.addNewDept = async () => {
    const val = document.getElementById('newDeptName').value.trim();
    if(!val) return;
    await window.apiService.addDepartment(val);
    toastMsg('Department added');
    render();
};

window.removeEmp = async (id) => {
    if(!confirm("Remove this employee?")) return;
    await window.apiService.removeEmployee(id);
    toastMsg("Employee removed");
    render();
};

window.openAddEmpModal = async () => {
    const depts = await window.apiService.getDepartments();
    const roles = await window.apiService.getRoles();
    modal.classList.add('show');
    document.getElementById('modalBody').innerHTML = `
        <h2 style="margin-bottom:10px">Add Employee</h2>
        <div class="form">
            <input id="newEmpName" placeholder="Employee Name" style="width:100%">
            <select id="newEmpRole" class="kode-select" style="width:100%">
                ${roles.map(r => `<option>${r}</option>`).join('')}
            </select>
            <select id="newEmpDept" class="kode-select" style="width:100%">
                ${depts.map(d => `<option>${d}</option>`).join('')}
            </select>
            <button class="btn" onclick="submitAddEmp()">Add Employee</button>
        </div>
    `;
};

window.submitAddEmp = async () => {
    const name = document.getElementById('newEmpName').value.trim();
    const role = document.getElementById('newEmpRole').value;
    const dept = document.getElementById('newEmpDept').value;
    if(!name) return toastMsg("Name required");
    await window.apiService.addEmployee(name, role, dept);
    document.getElementById('closeModal').click();
    toastMsg("Employee added");
    render();
};

window.addNewRole = async () => {
    const val = document.getElementById('newRoleName').value.trim();
    if(!val) return;
    try {
        await window.apiService.addRole(val);
        toastMsg('Role added');
        render();
    } catch(e) { toastMsg(e.message); }
};
window.editR = async (oldName) => {
    const newName = prompt("Enter new name for role '" + oldName + "':", oldName);
    if(!newName || newName.trim() === oldName) return;
    try {
        await window.apiService.editRole(oldName, newName.trim());
        toastMsg('Role updated');
        render();
    } catch(e) { toastMsg(e.message); }
};
window.removeR = async (name) => {
    if(name === 'Employee') return toastMsg("Cannot delete base Employee role");
    if(!confirm("Delete role '" + name + "'? Users will be reset to Employee.")) return;
    try {
        await window.apiService.removeRole(name);
        toastMsg('Role removed');
        render();
    } catch(e) { toastMsg(e.message); }
};

window.openAwardModal = async () => {
    const users = await window.apiService.getUsers();
    const userOpts = users.map(u => `<option value="${u.id}">${u.name} (${u.department})</option>`).join('');
    
    modal.classList.add('show');
    document.getElementById('modalBody').innerHTML = `
        <h2 style="margin-bottom:10px">Grant an Award</h2>
        <div class="form">
            <select id="awardReceiver" class="kode-select" style="width:100%">${userOpts}</select>
            <input id="awardCriteria" placeholder="Criteria (e.g., Great Teamwork)" style="width:100%">
            <input type="number" id="awardPoints" placeholder="Points (e.g., 50)" style="width:100%">
            <button class="btn" onclick="submitAward()">Grant Award</button>
        </div>
    `;
};

window.submitAward = async () => {
    const recId = parseInt(document.getElementById('awardReceiver').value);
    const crit = document.getElementById('awardCriteria').value.trim();
    const pts = document.getElementById('awardPoints').value.trim();
    
    if(!crit || !pts) return toastMsg('Please fill out criteria and points');
    
    await window.apiService.giveAward(currentUser.id, recId, crit, pts, '');
    document.getElementById('closeModal').click();
    toastMsg('Award granted successfully!');
    render();
};

window.openComments = async (postType, postId, title) => {
    const comments = await window.apiService.getComments(postType, postId);
    const users = await window.apiService.getUsers();
    
    let commentsHtml = comments.map(c => {
        const u = users.find(user => user.id === c.userId);
        return `<div style="border-bottom:1px solid var(--line);padding:10px 0">
            <div style="display:flex;gap:8px;align-items:center;margin-bottom:5px">
                <div class="avatar sm" style="width:24px;height:24px;font-size:8px">${u?.avatar||'?'}</div>
                <b>${u?.name||'Unknown'}</b> <small style="color:var(--muted)">${c.date}</small>
            </div>
            <p style="margin:0;font-size:12px;color:var(--ink)">${c.text}</p>
        </div>`;
    }).join('');
    
    if(!commentsHtml) commentsHtml = `<p style="color:var(--muted);font-size:12px;padding:10px 0">No comments yet. Be the first to ask a question!</p>`;

    modal.classList.add('show');
    document.getElementById('modalBody').innerHTML = `
        <h2 style="font-size:16px;margin-bottom:5px">${title}</h2>
        <p style="color:var(--muted);font-size:11px;margin-bottom:15px">Discussion Thread</p>
        <div style="max-height:300px;overflow-y:auto;margin-bottom:15px;padding-right:10px">
            ${commentsHtml}
        </div>
        <div style="display:flex;gap:10px">
            <input id="newCommentText" placeholder="Write a comment..." style="flex:1;padding:8px;border-radius:6px;border:1px solid var(--line);background:var(--card);color:var(--ink)">
            <button class="btn" onclick="submitComment('${postType}', ${postId}, '${title.replace(/'/g, "\\'")}')">Post</button>
        </div>
    `;
};

window.submitComment = async (postType, postId, title) => {
    const txt = document.getElementById('newCommentText').value.trim();
    if(!txt) return;
    await window.apiService.addComment(postType, postId, currentUser.id, txt);
    openComments(postType, postId, title);
};

initApp();


/* =========================================================
   KODE THEME SELECTOR
   ========================================================= */
const themeNames={
  default:'KODE Blue / Purple', ocean:'Ocean', emerald:'Emerald',
  sunset:'Sunset', rose:'Rose', indigo:'Indigo'
};
function setTheme(name){
  document.body.dataset.theme=name==='default'?'':name;
  localStorage.setItem('kode-theme',name);
  document.querySelectorAll('.theme-choice').forEach(x=>x.classList.toggle('active',x.dataset.theme===name));
  toastMsg(themeNames[name]+' theme enabled',800);
}
function openThemes(){
  modal.classList.add('show');
  const current=document.body.getAttribute('data-theme')||'default';
  document.getElementById('modalBody').innerHTML=`
    <h2 style="font-size:18px;margin:0">Appearance & Themes</h2>
    <p style="color:var(--muted);font-size:11px">Choose a palette, then choose its light or dark version.</p>
    <div class="theme-mode"><button class="theme-mode-choice ${!dark?'active':''}" onclick="if(dark)toggleAppearance()">☼ Light</button><button class="theme-mode-choice ${dark?'active':''}" onclick="if(!dark)toggleAppearance()">☾ Dark</button></div>
    <div class="theme-picker">
      <button class="theme-choice ${current==='default'?'active':''}" data-theme="default" onclick="setTheme('default')"><span class="theme-dot dot-default"></span>KODE Blue / Purple</button>
      <button class="theme-choice ${current==='ocean'?'active':''}" data-theme="ocean" onclick="setTheme('ocean')"><span class="theme-dot dot-ocean"></span>Ocean</button>
      <button class="theme-choice ${current==='emerald'?'active':''}" data-theme="emerald" onclick="setTheme('emerald')"><span class="theme-dot dot-emerald"></span>Emerald</button>
      <button class="theme-choice ${current==='sunset'?'active':''}" data-theme="sunset" onclick="setTheme('sunset')"><span class="theme-dot dot-sunset"></span>Sunset</button>
      <button class="theme-choice ${current==='rose'?'active':''}" data-theme="rose" onclick="setTheme('rose')"><span class="theme-dot dot-rose"></span>Rose</button>
      <button class="theme-choice ${current==='indigo'?'active':''}" data-theme="indigo" onclick="setTheme('indigo')"><span class="theme-dot dot-indigo"></span>Indigo</button>
    </div>
    <div style="margin-top:14px"><button class="btn light" onclick="document.getElementById('closeModal').click()">Done</button></div>`;
}
document.getElementById('themes').onclick=openThemes;
const savedTheme=localStorage.getItem('kode-theme')||'default';
if(savedTheme!=='default')document.body.setAttribute('data-theme',savedTheme);
dark=localStorage.getItem('kode-mode')==='dark';
document.body.classList.toggle('dark',dark);

/* =========================================================
   KODE BUDDY
   ========================================================= */
const petData={
  fox:{file:'fox.svg',name:'KODE Fox'},
  cat:{file:'cat.svg',name:'KODE Cat'},
  dog:{file:'dog.svg',name:'KODE Dog'},
  bull:{file:'bull.svg',name:'KODE Bull'},
  panda:{file:'panda.svg',name:'KODE Panda'},
  bunny:{file:'bunny.svg',name:'KODE Bunny'},
  penguin:{file:'penguin.svg',name:'KODE Penguin'},
  bear:{file:'bear.svg',name:'KODE Bear'}
};
let petKey=localStorage.getItem('kode-pet')||'dog';
let petPaused=false;

function applyPet(){
  const p=petData[petKey]||petData.dog;
  const img=document.getElementById('petImage');
  img.src='assets/mascots/'+p.file;
  img.alt=p.name;
  document.getElementById('petName').textContent=p.name;
}
function openPetPicker(){
  modal.classList.add('show');
  const current=petKey;
  document.getElementById('modalBody').innerHTML=`
    <h2 style="font-size:18px;margin:0">Choose your KODE Buddy</h2>
    <p style="color:var(--muted);font-size:11px">Pick a cute illustrated companion. It can wander from the edges, move between the top and bottom, and stay out of the way of your work.</p>
    <div class="pet-picker">
      ${Object.entries(petData).map(([k,p])=>`
        <button class="pet-option ${current===k?'active':''}" data-pet="${k}" onclick="choosePet('${k}')">
          <img src="assets/mascots/${p.file}" alt="${p.name}">
          ${p.name.replace('KODE ','')}
        </button>`).join('')}
    </div>
    <div style="margin-top:14px;display:flex;gap:7px;align-items:center">
      <button class="btn light" onclick="togglePetVisibilityExplicit()">Show / hide buddy</button>
      <button class="btn" onclick="document.getElementById('closeModal').click()">Done</button>
    </div>`;
}
function choosePet(k){
  petKey=k;
  localStorage.setItem('kode-pet',k);
  applyPet();
  document.querySelectorAll('.pet-option').forEach(x=>x.classList.toggle('active',x.dataset.pet===k));
  const el=document.querySelector('.pet-character');
  if(el){el.classList.remove('pet-bounce'); void el.offsetWidth; el.classList.add('pet-bounce')}
  toastMsg(petData[k].name+' selected');
}
function togglePet(){
  petPaused=!petPaused;
  const el=document.getElementById('petCompanion');
  el.classList.toggle('moving',!petPaused);
  document.getElementById('petPlay').textContent=petPaused?'▶':'Ⅱ';
  toastMsg(petPaused?'KODE Buddy paused':'KODE Buddy is wandering');
}
function togglePetVisibility(){
  const el=document.getElementById('petCompanion');
  el.classList.toggle('pet-hidden');
  localStorage.setItem('kode-pet-visible',el.classList.contains('pet-hidden')?'0':'1');
}
document.getElementById('petCustomize').onclick=openPetPicker;
document.getElementById('petPlay').onclick=togglePet;
applyPet();


/* =========================================================
   OPTIONAL BUDDY VISIBILITY
   ========================================================= */
function setPetVisibility(show){
  const buddy=document.getElementById('petCompanion');
  const controls=document.getElementById('petControls');
  const pill=document.getElementById('petShowPill');
  if(!buddy || !controls || !pill) return;
  buddy.classList.toggle('pet-hidden',!show);
  controls.classList.toggle('pet-hidden',!show);
  pill.classList.toggle('pet-hidden',show);
  localStorage.setItem('kode-pet-visible',show?'1':'0');
}
function togglePetVisibilityExplicit(){
  const buddy=document.getElementById('petCompanion');
  setPetVisibility(buddy.classList.contains('pet-hidden'));
  toastMsg(buddy.classList.contains('pet-hidden')?'KODE Buddy hidden':'KODE Buddy enabled');
}
const petToggle=document.getElementById('petToggle');
const petShowButton=document.getElementById('petShowButton');
if(petToggle) petToggle.onclick=togglePetVisibilityExplicit;
if(petShowButton) petShowButton.onclick=()=>setPetVisibility(true);

/* If the user has never made a choice, show the Buddy.
   If they previously hid it, respect that choice. */
const petVisibility=localStorage.getItem('kode-pet-visible');
setPetVisibility(petVisibility!=='0');
