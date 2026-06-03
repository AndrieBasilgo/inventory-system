(function(){
	const users = {
		admin: { password: 'admin', role: 'admin' },
		user:  { password: 'user',  role: 'user' }
	};

	function saveCurrent(user){ localStorage.setItem('it_user', JSON.stringify(user)); notifyChange(); }
	function clearCurrent(){ localStorage.removeItem('it_user'); notifyChange(); }
	function getCurrent(){ try{return JSON.parse(localStorage.getItem('it_user'));}catch(e){return null} }

	const listeners = [];
	function notifyChange(){ listeners.forEach(cb=>{try{cb(getCurrent())}catch(e){}}) }

	function login(username, password){
		username = (username||'').toString();
		const record = users[username];
		if(record && record.password === password){
			saveCurrent({username, role: record.role});
			return { ok:true, user: getCurrent() };
		}
		return { ok:false };
	}

	function logout(){ clearCurrent(); }

	function onChange(cb){ if(typeof cb==='function') listeners.push(cb); }

	window.Auth = { login, logout, getCurrent, onChange };

	document.addEventListener('DOMContentLoaded', ()=>{
		const form = document.getElementById('loginForm');
		if(form){
			form.addEventListener('submit', (e)=>{
				e.preventDefault();
				const u = document.getElementById('username').value.trim();
				const p = document.getElementById('password').value;
				const res = login(u,p);
				if(res.ok){ location.href = 'dashboard.html'; }
				else { alert('Invalid credentials. Use admin/admin or user/user'); }
			});
		}
	});

})();