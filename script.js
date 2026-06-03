(function(){
	const STORAGE_KEY = 'it_equipments';
	let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
	let editId = null;
	let equipModal = null;

	function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

	function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

	function render(){
		const tbody = document.querySelector('#equipTable tbody');
		if(!tbody) return;
		tbody.innerHTML = '';
		items.forEach(it=>{
			const tr = document.createElement('tr');
			tr.innerHTML = `<td>${escapeHtml(it.name)}</td><td>${escapeHtml(it.model||'')}</td><td>${escapeHtml(it.serial||'')}</td><td>${escapeHtml(it.type||'')}</td><td>${escapeHtml(it.user||'')}</td><td>${escapeHtml(it.status||'')}</td><td></td>`;
			const actions = tr.querySelector('td:last-child');
			const user = (window.Auth && Auth.getCurrent && Auth.getCurrent()) || null;
			const role = user? user.role : null;

			if(role==='admin'){
				const edit = createBtn('Edit', ()=>openEdit(it.id));
				const del  = createBtn('Delete', ()=>{ if(confirm('Delete item?')){ removeItem(it.id); } });
				actions.appendChild(edit); actions.appendChild(del);
			} else {
				actions.textContent = '-';
			}

			tbody.appendChild(tr);
		});
		// update total count
		const totalEl = document.getElementById('total'); if(totalEl) totalEl.textContent = items.length;
	}

	function createBtn(label, cb){ const b=document.createElement('button'); b.className = label==='Edit' ? 'btn-edit' : 'btn-delete'; b.textContent=label; b.addEventListener('click', cb); b.type='button'; return b; }

	function openAdd(){ editId = null; document.getElementById('modalTitle').innerText='Add Equipment'; document.getElementById('equipForm').reset(); showModal(true); }
	function openEdit(id){ const it = items.find(x=>x.id===id); if(!it) return; editId = id; document.getElementById('modalTitle').innerText='Edit Equipment'; document.getElementById('name').value = it.name||''; document.getElementById('model').value = it.model||''; document.getElementById('serial').value = it.serial||''; document.getElementById('type').value = it.type||''; document.getElementById('user').value = it.user||''; document.getElementById('status').value = it.status||'Available'; showModal(true); }

	function showModal(visible){ 
		if(!equipModal) return;
		if(visible) equipModal.show();
		else equipModal.hide();
	}

	function addOrSave(e){ e.preventDefault(); const name=document.getElementById('name').value.trim(); const model=document.getElementById('model').value.trim(); const serial=document.getElementById('serial').value.trim(); const type=document.getElementById('type').value.trim(); const userVal=document.getElementById('user').value.trim(); const status=document.getElementById('status').value;
		if(!name||!type){ alert('Name and Type required'); return; }
		if(editId){ const it = items.find(x=>x.id===editId); if(it){ it.name=name; it.model=model; it.serial=serial; it.type=type; it.user=userVal; it.status=status; } }
		else { items.push({ id: uid(), name, model, serial, type, user: userVal, status }); }
		save(); render(); showModal(false);
	}

	function removeItem(id){ items = items.filter(x=>x.id!==id); save(); render(); }

	function escapeHtml(s){ return String(s||'').replace(/[&<>"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }

	function applyRoleUI(){ const user = (window.Auth && Auth.getCurrent && Auth.getCurrent()) || null; const role = user? user.role : null; document.getElementById('roleBadge').textContent = user? (user.username + ' ('+user.role+')') : 'User'; document.getElementById('loginBtn').classList.toggle('hidden', !!user); document.getElementById('logoutBtn').classList.toggle('hidden', !user);
		const addBtn = document.getElementById('addBtn'); if(addBtn) addBtn.disabled = role !== 'admin'; if(addBtn) addBtn.classList.toggle('hidden', role!=='admin');
		const importBtn = document.getElementById('importCsvBtn'); if(importBtn) importBtn.classList.toggle('hidden', role!=='admin');
		const exportBtn = document.getElementById('exportCsvBtn'); if(exportBtn) exportBtn.classList.remove('hidden');
	}

	function loadDark(){ const d = localStorage.getItem('darkMode') === '1'; document.body.classList.toggle('dark', d); }
	function toggleDark(){ const d = !document.body.classList.contains('dark'); document.body.classList.toggle('dark', d); localStorage.setItem('darkMode', d? '1':'0'); }

	// CSV export
	function exportCSV(){
		if(!items || !items.length){ alert('No items to export'); return; }
		const cols = ['id','name','model','serial','type','user','status'];
		const rows = items.map(it=>cols.map(c=>csvEscape(it[c]||'')).join(','));
		const csv = cols.join(',') + '\n' + rows.join('\n');
		const blob = new Blob([csv], {type:'text/csv'});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a'); a.href = url; a.download = 'it-equipments.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
	}

	function csvEscape(v){ if(typeof v !== 'string') v = String(v||''); if(v.includes(',')||v.includes('\n')||v.includes('"')){ return '"'+v.replace(/"/g,'""')+'"'; } return v; }

	// CSV import (basic parsing, supports quoted fields)
	function importCSVText(text){
		const lines = text.split(/\r?\n/).map(l=>l.trim()).filter(l=>l.length>0);
		if(lines.length < 1) return 0;
		const splitLine = (line) => line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(s=>s.replace(/^"|"$/g,'').replace(/""/g,'"'));
		const headers = splitLine(lines[0]).map(h=>h.trim().toLowerCase());
		let added = 0;
		for(let i=1;i<lines.length;i++){
			const cols = splitLine(lines[i]);
			if(cols.length===0) continue;
			const obj = {};
			headers.forEach((h,idx)=>{ obj[h]= (cols[idx]||'').trim(); });
			// require name and type
			if(!obj.name || !obj.type) continue;
			obj.id = obj.id || uid();
			obj.status = obj.status || 'Available';
			// normalize keys to match new schema
			const entry = { id: obj.id, name: obj.name, model: obj.model||'', serial: obj.serial||'', type: obj.type, user: obj.user||obj.owner||'', status: obj.status };
			items.push(entry); added++;
		}
		save(); render(); return added;
	}

	document.addEventListener('DOMContentLoaded', ()=>{
		// require login: redirect to login page if not authenticated
		if(window.Auth && Auth.getCurrent && !Auth.getCurrent()){
			window.location.href = 'index.html';
			return;
		}

		// Initialize Bootstrap modal
		const modalEl = document.getElementById('equipModal');
		if(modalEl && window.bootstrap && window.bootstrap.Modal){
			equipModal = new bootstrap.Modal(modalEl, { backdrop: 'static', keyboard: true });
		}

		// elements
		const addBtn = document.getElementById('addBtn'); if(addBtn) addBtn.addEventListener('click', openAdd);
		const form = document.getElementById('equipForm'); if(form) form.addEventListener('submit', addOrSave);
		const darkToggle = document.getElementById('darkToggle'); if(darkToggle) darkToggle.addEventListener('click', toggleDark);
		const loginBtn = document.getElementById('loginBtn'); if(loginBtn) loginBtn.addEventListener('click', ()=> location.href='index.html');
		const logoutBtn = document.getElementById('logoutBtn'); if(logoutBtn) logoutBtn.addEventListener('click', ()=>{ if(window.Auth){ Auth.logout(); applyRoleUI(); } });

		const exportBtn = document.getElementById('exportCsvBtn'); if(exportBtn) exportBtn.addEventListener('click', exportCSV);
		const importBtn = document.getElementById('importCsvBtn'); const csvFile = document.getElementById('csvFile');
		if(importBtn && csvFile){ importBtn.addEventListener('click', ()=> csvFile.click()); csvFile.addEventListener('change', (ev)=>{
			const f = ev.target.files && ev.target.files[0]; if(!f) return; const r = new FileReader(); r.onload = ()=>{ const added = importCSVText(r.result || ''); alert('Imported '+added+' items'); }; r.readAsText(f);
		}); }

		loadDark();
		render();
		applyRoleUI();

		if(window.Auth && Auth.onChange) Auth.onChange(()=>{ applyRoleUI(); render(); });
	});

	// expose for debugging
	window._it = { items, save, render };

})();