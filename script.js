// ======================================================
// 1. DATABASE INITIALIZATION (DATA UTAMA)
// ======================================================
const defaultDB = {
    // A. DATA PROFIL DESA
    profile: {
        moto: "BERBENAH (Bersama Membangun Amanah)",
        sejarah: "Desa Pasir Ampo berdiri sejak tahun 1980...",
        visi: "Terwujudnya Desa Mandiri yang Sejahtera.",
        misi: "1. SDM Unggul.\n2. Infrastruktur Maju."
    },
    // B. STRUKTUR ORGANISASI
    structure: [
        { id: 1, name: "Bpk. Kades", role: "Kepala Desa", img: "img/kades.jpg" },
        { id: 2, name: "Ibu Sekdes", role: "Sekretaris Desa", img: "img/sekdes.jpg" }
    ],
    programs: [ { id: 1, nama: "Betonisasi Jalan", status: "Berjalan" } ],
    
    // C. BERITA DESA
    news: [ 
        { id: 1, title: "Penyaluran BLT Tahap 3", date: "2025-12-10", img: "img/news1.jpg", content: "Kegiatan berjalan lancar..." },
        { id: 2, title: "Musyawarah Desa", date: "2025-11-20", img: "img/news2.jpg", content: "Pembahasan RKPDes..." }
    ],
    
    // D. KEUANGAN (APBDES & BELANJA)
    apbdes: [
        { uraian: "Dana Desa (DD)", target: 1200000000, realisasi: 1200000000, color: "bg-purple" },
        { uraian: "Pendapatan Asli Desa", target: 50000000, realisasi: 50000000, color: "bg-success" },
        { uraian: "Bantuan Provinsi", target: 150000000, realisasi: 100000000, color: "bg-pink" }
    ],
    spending: [ { id: 1, date: "2025-01-10", program: "Jalan Desa", item: "Semen 50 Sak", nominal: 3500000 } ],
    
    // E. DATA UMKM
    products: [
        { id: 1, name: "Keripik Singkong", price: 15000, seller: "Ibu Ani", address: "RT 01", desc: "Gurih renyah", img: "img/product1.jpg" },
        { id: 2, name: "Anyaman Bambu", price: 45000, seller: "Pak Budi", address: "RT 02", desc: "Kuat awet", img: "img/product2.jpg" }
    ],
    umkm_regs: [],
    trainings: [ { id: 1, title: "Digital Marketing", date: "2025-12-20", loc: "Aula Desa", img: "img/training.jpg" } ],
    
    // F. DATA STATISTIK (BIG DATA)
    stats: {
        gender: { pria: 3250, wanita: 3100 },
        usia: { anak: 1200, produktif: 4200, lansia: 950 },
        kb: { pil: 450, suntik: 600, iud: 120, implant: 80 },
        ekonomi: { petani: 1500, pedagang: 800, pns: 150, buruh: 1200 },
        bansos: { pkh: 250, blt: 300, bpnt: 400 }
    },
    
    // G. PERMOHONAN WARGA (SURAT)
    requests: []
};

// LOAD DATABASE DARI LOCAL STORAGE
let db = JSON.parse(localStorage.getItem('smartDesaMasterDB_Final')) || defaultDB;
function saveDB() { localStorage.setItem('smartDesaMasterDB_Final', JSON.stringify(db)); }

// ======================================================
// 2. INITIALIZATION (ROUTER HALAMAN)
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // A. HALAMAN ADMIN DASHBOARD
    if(document.getElementById('admin-stats')) {
        renderAdminRequests(); 
        renderAdminStats();
        renderAdminSpending(); 
        renderAdminApbdes(); 
        renderAdminNews();
        renderAdminProfile(); 
        renderAdminStructure(); 
        renderAdminUmkmRegs(); 
        renderAdminProducts();
    }
    
    // B. HALAMAN DEPAN (INDEX)
    if(document.getElementById('news-container')) {
        renderNews(); 
        renderApbdes(); 
        renderSpendingPublic(); 
        if(document.getElementById('chartGender')) initCharts();
    }
    
    // C. HALAMAN PROFIL
    if(document.getElementById('profile-content')) { renderProfilePage(); }
    
    // D. HALAMAN UMKM (PUBLIC)
    if(document.getElementById('marketplace-container')) { 
        renderMarketplace(); 
        renderTrainings(); 
    }
    
    // E. HALAMAN REGISTER UMKM (FORM)
    if(document.getElementById('umkm-reg-form')) {
        // Cek input spesifik untuk membedakan form
        if(document.getElementById('u-nama')) {
             document.getElementById('umkm-reg-form').addEventListener('submit', handleUmkmReg);
        }
    }
    
    // F. HALAMAN USER DASHBOARD (LAYANAN MANDIRI)
    if(document.getElementById('form-request')) {
        renderUserHistory();
        document.getElementById('form-request').addEventListener('submit', handleUserRequest);
    }
});

// ======================================================
// 3. FUNGSI USER (LAYANAN MANDIRI)
// ======================================================
function handleUserRequest(e) { 
    e.preventDefault(); 
    
    // Ambil Nama File (Simulasi)
    const ktpFile = document.getElementById('file_ktp').value.split('\\').pop();
    const kkFile = document.getElementById('file_kk').value.split('\\').pop();
    const docInput = document.getElementById('file_doc');
    let docInfo = '-';
    if(docInput.files.length > 0) docInfo = docInput.files.length + " File Lain";

    const newReq = {
        id: Date.now(),
        nik: document.getElementById('nik').value,
        nama: document.getElementById('nama').value,
        wa: document.getElementById('wa').value,         // DATA WA
        alamat: document.getElementById('alamat').value, // DATA ALAMAT
        kategori: document.getElementById('kategori').value,
        tipe: document.getElementById('tipe').value,
        ket: document.getElementById('ket').value,
        ktp: ktpFile, // FILE
        kk: kkFile,   // FILE
        doc: docInfo, // FILE
        status: 'Menunggu',
        tanggal: new Date().toLocaleDateString('id-ID')
    };

    db.requests.unshift(newReq); 
    saveDB(); 
    alert('Permohonan Berhasil Dikirim! Admin akan memverifikasi berkas Anda.'); 
    e.target.reset(); 
    renderUserHistory(); 
}

function renderUserHistory(){ 
    const tbody = document.getElementById('history-table');
    if(db.requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Belum ada riwayat</td></tr>';
        return;
    }
    tbody.innerHTML = db.requests.map(r=>`
        <tr>
            <td><small>${r.tanggal}</small></td>
            <td>${r.tipe}</td>
            <td><span class="badge ${r.status==='Selesai'?'bg-success':(r.status==='Ditolak'?'bg-danger':'bg-warning')}">${r.status}</span></td>
        </tr>`).join(''); 
}

// ======================================================
// 4. FUNGSI ADMIN (DASHBOARD)
// ======================================================

// A. REQUEST SURAT (DENGAN WA & ALAMAT)
function renderAdminRequests() {
    const tbody = document.getElementById('admin-request-table');
    if (db.requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center p-3 text-muted">Belum ada permohonan masuk</td></tr>';
        return;
    }
    tbody.innerHTML = db.requests.map((r, i) => {
        // Format WA
        let waLink = r.wa ? `https://wa.me/${r.wa.replace(/^0/, '62')}` : '#';
        
        return `
        <tr>
            <td>${r.tanggal}</td>
            <td>
                <b>${r.nama}</b><br>
                <small class="text-muted">NIK: ${r.nik}</small><br>
                <small><i class="fas fa-map-marker-alt text-danger"></i> ${r.alamat}</small><br>
                <a href="${waLink}" target="_blank" class="btn btn-sm btn-success py-0 px-2 mt-1" style="font-size:10px">
                    <i class="fab fa-whatsapp"></i> Chat WA
                </a>
            </td>
            <td>
                <span class="badge bg-info text-dark mb-1">${r.kategori}</span><br>
                ${r.tipe}<br>
                <small class="fst-italic text-muted">"${r.ket}"</small>
            </td>
            <td>
                <ul class="list-unstyled small mb-0 bg-white p-1 border rounded">
                    <li><i class="fas fa-check text-success"></i> KTP: ${r.ktp}</li>
                    <li><i class="fas fa-check text-success"></i> KK: ${r.kk}</li>
                    <li class="text-muted"><i class="fas fa-paperclip"></i> ${r.doc}</li>
                </ul>
            </td>
            <td>
                <select class="form-select form-select-sm" onchange="updStat(${i},this.value)" 
                    style="border-color: ${r.status === 'Selesai' ? '#198754' : '#ffc107'}">
                    <option value="Menunggu" ${r.status==='Menunggu'?'selected':''}>Menunggu</option>
                    <option value="Diproses" ${r.status==='Diproses'?'selected':''}>Diproses</option>
                    <option value="Selesai" ${r.status==='Selesai'?'selected':''}>Selesai</option>
                    <option value="Ditolak" ${r.status==='Ditolak'?'selected':''}>Ditolak</option>
                </select>
            </td>
        </tr>`;
    }).join('');
}
function updStat(i,v){ db.requests[i].status=v; saveDB(); }

// B. STATISTIK ADMIN
function renderAdminStats() {
    if(!document.getElementById('st-pria')) return;
    document.getElementById('st-pria').value = db.stats.gender.pria;
    document.getElementById('st-wanita').value = db.stats.gender.wanita;
    document.getElementById('st-anak').value = db.stats.usia.anak;
    document.getElementById('st-prod').value = db.stats.usia.produktif;
    document.getElementById('st-lansia').value = db.stats.usia.lansia;
    document.getElementById('st-pil').value = db.stats.kb.pil;
    document.getElementById('st-suntik').value = db.stats.kb.suntik;
    document.getElementById('st-iud').value = db.stats.kb.iud;
    document.getElementById('st-implant').value = db.stats.kb.implant;
    document.getElementById('st-tani').value = db.stats.ekonomi.petani;
    document.getElementById('st-dagang').value = db.stats.ekonomi.pedagang;
    document.getElementById('st-pns').value = db.stats.ekonomi.pns;
    document.getElementById('st-buruh').value = db.stats.ekonomi.buruh;
    document.getElementById('st-pkh').value = db.stats.bansos.pkh;
    document.getElementById('st-blt').value = db.stats.bansos.blt;
    document.getElementById('st-bpnt').value = db.stats.bansos.bpnt;
}
function saveAdminStats() {
    db.stats.gender.pria = parseInt(document.getElementById('st-pria').value);
    db.stats.gender.wanita = parseInt(document.getElementById('st-wanita').value);
    db.stats.usia.anak = parseInt(document.getElementById('st-anak').value);
    db.stats.usia.produktif = parseInt(document.getElementById('st-prod').value);
    db.stats.usia.lansia = parseInt(document.getElementById('st-lansia').value);
    db.stats.kb.pil = parseInt(document.getElementById('st-pil').value);
    db.stats.kb.suntik = parseInt(document.getElementById('st-suntik').value);
    db.stats.kb.iud = parseInt(document.getElementById('st-iud').value);
    db.stats.kb.implant = parseInt(document.getElementById('st-implant').value);
    db.stats.ekonomi.petani = parseInt(document.getElementById('st-tani').value);
    db.stats.ekonomi.pedagang = parseInt(document.getElementById('st-dagang').value);
    db.stats.ekonomi.pns = parseInt(document.getElementById('st-pns').value);
    db.stats.ekonomi.buruh = parseInt(document.getElementById('st-buruh').value);
    db.stats.bansos.pkh = parseInt(document.getElementById('st-pkh').value);
    db.stats.bansos.blt = parseInt(document.getElementById('st-blt').value);
    db.stats.bansos.bpnt = parseInt(document.getElementById('st-bpnt').value);
    saveDB(); alert('Statistik Tersimpan!');
}

// C. UMKM ADMIN
function renderAdminUmkmRegs(){ 
    document.getElementById('table-umkm-regs').innerHTML = db.umkm_regs.map((r,i)=>`
        <tr>
            <td>${r.tanggal}</td>
            <td><b>${r.nama}</b><br>NIK: ${r.nik}<br><small class="text-success"><i class="fab fa-whatsapp"></i> ${r.wa}</small></td>
            <td>${r.usaha}<br><small>${r.alamat}</small></td>
            <td>KTP: ${r.ktp}<br>Prod: ${r.prod}</td>
            <td>${r.status}</td>
            <td>
                <button class="btn btn-sm btn-success" onclick="updUmkm(${i},'Disetujui')">v</button>
                <button class="btn btn-sm btn-danger" onclick="updUmkm(${i},'Ditolak')">x</button>
            </td>
        </tr>`).join(''); 
}
function updUmkm(i,s){ db.umkm_regs[i].status=s; saveDB(); renderAdminUmkmRegs(); }
function renderAdminProducts(){ document.getElementById('table-products').innerHTML = db.products.map((p,i)=>`<tr><td>${p.name}</td><td>Rp ${p.price}</td><td><button class="btn btn-sm btn-danger" onclick="delProd(${i})">x</button></td></tr>`).join(''); }
function addProduct(){ const n=document.getElementById('pr-name').value, p=document.getElementById('pr-price').value; if(n){db.products.push({id:Date.now(),name:n,price:parseInt(p),seller:"Admin",img:"img/product1.jpg"});saveDB();renderAdminProducts();} }
function delProd(i){db.products.splice(i,1);saveDB();renderAdminProducts();}

// D. APBDES & BELANJA ADMIN
function renderAdminSpending(){ document.getElementById('admin-spending-table').innerHTML = db.spending.map((s,i)=>`<tr><td>${s.date}</td><td>${s.program}</td><td>Rp ${s.nominal.toLocaleString()}</td><td><button class="btn btn-sm btn-danger" onclick="delSpend(${i})">x</button></td></tr>`).join(''); }
function addSpending(){ const d=document.getElementById('sp-date').value, p=document.getElementById('sp-prog').value, i=document.getElementById('sp-item').value, n=document.getElementById('sp-nom').value; if(d&&n){db.spending.unshift({id:Date.now(),date:d,program:p,item:i,nominal:parseInt(n)});saveDB();renderAdminSpending();} }
function delSpend(i){db.spending.splice(i,1);saveDB();renderAdminSpending();}
function renderAdminApbdes(){ document.getElementById('admin-apbdes-edit').innerHTML = db.apbdes.map((a,i)=>`<div class="row g-1 mb-2"><div class="col-4"><input class="form-control form-control-sm" value="${a.uraian}" readonly></div><div class="col-3"><input type="number" class="form-control form-control-sm" value="${a.target}" id="tar-${i}"></div><div class="col-3"><input type="number" class="form-control form-control-sm" value="${a.realisasi}" id="real-${i}"></div><div class="col-2"><button class="btn btn-success btn-sm w-100" onclick="savApb(${i})">Ok</button></div></div>`).join(''); }
function savApb(i){ db.apbdes[i].target=parseInt(document.getElementById(`tar-${i}`).value); db.apbdes[i].realisasi=parseInt(document.getElementById(`real-${i}`).value); saveDB(); alert('Saved'); }

// E. BERITA & PROFIL ADMIN
function renderAdminNews(){ document.getElementById('admin-news-list').innerHTML = db.news.map((n,i)=>`<li class="list-group-item d-flex justify-content-between">${n.title} <button class="btn btn-sm btn-danger" onclick="delNews(${i})">x</button></li>`).join(''); }
function addNews(){ const t=prompt("Judul"), c=prompt("Isi"); if(t){db.news.unshift({id:Date.now(),title:t,content:c,date:'2025-12-12',img:'img/news3.jpg'});saveDB();renderAdminNews();} }
function delNews(i){db.news.splice(i,1);saveDB();renderAdminNews();}
function renderAdminProfile(){ document.getElementById('edit-moto').value=db.profile.moto; document.getElementById('edit-sejarah').value=db.profile.sejarah; }
function saveAdminProfile(){ db.profile.moto=document.getElementById('edit-moto').value; db.profile.sejarah=document.getElementById('edit-sejarah').value; saveDB(); alert('Saved'); }
function renderAdminStructure(){ document.getElementById('admin-struct-table').innerHTML=db.structure.map((s,i)=>`<tr><td>${s.name}</td><td>${s.role}</td><td><button class="btn btn-sm btn-danger" onclick="delStruct(${i})">x</button></td></tr>`).join(''); }
function addStructure(){ const n=document.getElementById('st-name').value, r=document.getElementById('st-role').value; if(n){db.structure.push({id:Date.now(),name:n,role:r,img:'img/user.png'});saveDB();renderAdminStructure();} }
function delStruct(i){db.structure.splice(i,1);saveDB();renderAdminStructure();}
function renderAdminPrograms() {/* Placeholder */}

// ======================================================
// 5. FUNGSI PUBLIC (FRONTEND)
// ======================================================
function initCharts(){ 
    new Chart(document.getElementById('chartGender'),{type:'pie',data:{labels:['Pria','Wanita'],datasets:[{data:[db.stats.gender.pria,db.stats.gender.wanita],backgroundColor:['#36A2EB','#FF6384']}]}});
    new Chart(document.getElementById('chartUsia'),{type:'doughnut',data:{labels:['Anak','Produktif','Lansia'],datasets:[{data:[db.stats.usia.anak,db.stats.usia.produktif,db.stats.usia.lansia],backgroundColor:['#FFCE56','#4BC0C0','#FF9F40']}]}});
    new Chart(document.getElementById('chartKB'),{type:'polarArea',data:{labels:['Pil','Suntik','IUD','Implant'],datasets:[{data:[db.stats.kb.pil,db.stats.kb.suntik,db.stats.kb.iud,db.stats.kb.implant],backgroundColor:['#FF6384','#36A2EB','#FFCE56','#4BC0C0']}]}});
    new Chart(document.getElementById('chartEkonomi'),{type:'bar',data:{labels:['Tani','Dagang','PNS','Buruh'],datasets:[{label:'Warga',data:[db.stats.ekonomi.petani,db.stats.ekonomi.pedagang,db.stats.ekonomi.pns,db.stats.ekonomi.buruh],backgroundColor:'#9966FF'}]}});
    new Chart(document.getElementById('chartBansos'),{type:'bar',data:{labels:['PKH','BLT','BPNT'],datasets:[{label:'Penerima',data:[db.stats.bansos.pkh,db.stats.bansos.blt,db.stats.bansos.bpnt],backgroundColor:'#FF9F40'}]},options:{indexAxis:'y'}});
    document.getElementById('total-penduduk').innerText = (db.stats.gender.pria + db.stats.gender.wanita).toLocaleString();
}

function renderNews(){ document.getElementById('news-container').innerHTML = db.news.map(n=>`<div class="col-md-4 mb-3"><div class="clean-card h-100 overflow-hidden"><img src="${n.img}" class="w-100" style="height:180px;object-fit:cover"><div class="p-3"><small>${n.date}</small><h6 class="fw-bold">${n.title}</h6><a href="#" class="btn btn-sm btn-outline-primary">Baca</a></div></div></div>`).join(''); }
function renderApbdes(){ document.getElementById('apbdes-container').innerHTML = db.apbdes.map(a=>{ let p=Math.round((a.realisasi/a.target)*100); return `<div class="mb-3"><div class="d-flex justify-content-between small fw-bold"><span>${a.uraian}</span><span>${p}%</span></div><div class="progress" style="height:10px"><div class="progress-bar ${a.color}" style="width:${p}%"></div></div></div>` }).join(''); }
function renderSpendingPublic(){ document.getElementById('spending-public-body').innerHTML = db.spending.map(s=>`<tr><td>${s.date}</td><td>${s.program}</td><td>${s.item}</td><td class="text-end">Rp ${s.nominal.toLocaleString()}</td></tr>`).join(''); }
function renderProfilePage(){ document.getElementById('view-moto').innerText=db.profile.moto; document.getElementById('view-sejarah').innerText=db.profile.sejarah; document.getElementById('view-structure').innerHTML=db.structure.map(s=>`<div class="col-6 col-md-3 mb-3"><div class="clean-card text-center p-2"><img src="${s.img}" class="w-100 rounded"><h6>${s.name}</h6><small>${s.role}</small></div></div>`).join(''); }
function renderMarketplace(){ document.getElementById('marketplace-container').innerHTML = db.products.map(p=>`<div class="col-md-3 mb-3"><div class="clean-card h-100"><img src="${p.img}" class="w-100" style="height:150px;object-fit:cover"><div class="p-3"><h6>${p.name}</h6><h5 class="text-primary">Rp ${p.price.toLocaleString()}</h5></div></div></div>`).join(''); }
function renderTrainings(){ document.getElementById('training-container').innerHTML = db.trainings.map(t=>`<div class="col-md-6 mb-3"><div class="clean-card p-3 d-flex"><img src="${t.img}" width="80" class="rounded me-3"><div><h6>${t.title}</h6><small>${t.date}</small></div></div></div>`).join(''); }

// FUNGSI UMKM REGISTER
function handleUmkmReg(e){ 
    e.preventDefault(); 
    const ktpFile = document.getElementById('u-ktp').value.split('\\').pop();
    const prodFile = document.getElementById('u-prod').value.split('\\').pop();
    const newReg = {
        id: Date.now(),
        nama: document.getElementById('u-nama').value,
        nik: document.getElementById('u-nik').value,
        wa: document.getElementById('u-wa').value,
        alamat: document.getElementById('u-alamat').value,
        usaha: document.getElementById('u-usaha').value,
        ktp: ktpFile, prod: prodFile, status: 'Menunggu',
        tanggal: new Date().toLocaleDateString('id-ID')
    };
    db.umkm_regs.unshift(newReg); 
    saveDB(); 
    alert('Pendaftaran Berhasil! Data Anda telah masuk ke Admin.'); 
    window.location.href = 'umkm.html';
}