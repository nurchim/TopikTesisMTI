// Klasifikasi lokal berbasis aturan dan bobot istilah. Tidak ada pemanggilan LLM/API.
const stopwords = new Set('dan atau yang untuk dengan pada dari dalam terhadap sebuah suatu tentang terhadap menggunakan berbasis melalui terhadap guna sebagai dapat mampu agar bagaimana penelitian tesis kajian studi analisis pengembangan implementasi perancangan pembuatan sistem aplikasi metode pendekatan model evaluasi optimisasi optimalisasi peningkatan meningkatkan efektivitas performa kinerja teknologi informasi mahasiswa magister universitas kasus data di ke ini itu adalah serta secara antara oleh menurut'.split(' '));
const alias = [
  [/\b(machine learning|pembelajaran mesin)\b/g,'machine learning'],
  [/\b(kecerdasan buatan|artificial intelligence)\b/g,'ai'],
  [/\b(internet of things|internet benda|iot)\b/g,'iot'],
  [/\b(enterprise information technology|teknologi informasi perusahaan)\b/g,'enterprise'],
  [/\b(peramalan|ramalan|memprediksi|meramalkan)\b/g,'forecasting'],
  [/\b(klasifikasi|mengklasifikasikan)\b/g,'klasifikasi'],
  [/\b(sensor nirkabel|jaringan sensor nirkabel)\b/g,'wireless sensor network'],
  [/\b(pemrosesan bahasa alami|pengolahan bahasa alami)\b/g,'nlp'],
  [/\b(pemeliharaan prediktif)\b/g,'predictive maintenance'],
  [/\b(tata kelola teknologi informasi|tata kelola tik)\b/g,'tata kelola ti'],
  [/\b(usaha mikro kecil dan menengah)\b/g,'umkm'],
  [/\b(komputasi tepi)\b/g,'edge computing'],
  [/\b(kembar digital)\b/g,'digital twin'],
  [/\b(pengenalan entitas bernama)\b/g,'named entity recognition'],
  [/\b(jaringan saraf tiruan)\b/g,'neural network'],
  [/\b(visi komputer)\b/g,'computer vision'],
  [/\b(keamanan siber)\b/g,'cybersecurity'],
  [/\b(sistem pendukung keputusan)\b/g,'decision support'],
];
export function normalize(input) {
  let s=String(input||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,' ').replace(/[-_]+/g,' ').replace(/\s+/g,' ').trim();
  for(const [re,to] of alias) s=s.replace(re,to);
  return s.replace(/\s+/g,' ').trim();
}
export const tokens = s => normalize(s).split(' ').filter(w=>w.length>=3&&!stopwords.has(w));
const containsPhrase=(hay,needle)=>(' '+hay+' ').includes(' '+needle+' ');
function coverage(query, terms){
  const q=new Set(tokens(query));
  const t=new Set(tokens(terms.join(' ')));
  let overlap=0;
  for(const word of q) if(t.has(word))overlap++;
  return overlap;
}
export function rankTopics(text, catalog, restrict='all') {
  const query=normalize(text);
  if(tokens(query).length<2) return [];
  const filtered=catalog.filter(x=>restrict==='all'||x.rumpun===restrict);
  const ranked=filtered.map(entry=>{
    let score=0;
    const matched=[];
    for(const raw of entry.keywords){
      const kw=normalize(raw);
      if(!kw)continue;
      if(containsPhrase(query,kw)) {
        score+=(kw.includes(' ')?10:6);
        matched.push(raw);
      }
    }
    // Kesamaan kata dengan deskripsi dan nama bidang fokus: bobot moderat.
    score += Math.min(coverage(query,[entry.label,entry.description]),5)*1.6;
    // Hindari judul contoh secara otomatis mendominasi akibat istilah umum.
    score += Math.min(coverage(query,entry.examples),5)*0.35;
    if (containsPhrase(query,normalize(entry.label))) score+=5;
    return {...entry,score:Math.round(score*10)/10,matched:[...new Set(matched)].slice(0,6)};
  }).sort((a,b)=>b.score-a.score||a.code.localeCompare(b.code));
  if(!ranked.length||ranked[0].score<3)return [];
  return ranked.slice(0,3).filter(x=>x.score>=Math.max(2.8,ranked[0].score*0.26));
}
export function strength(results){
  if(!results.length)return 'Belum cukup informasi';
  let a=results[0].score,b=results[1]?.score||0;
  if(a>=14 && a>=b*1.45)return 'Kecocokan kata kunci kuat';
  if(a>=7)return 'Kecocokan kata kunci sedang';
  return 'Kecocokan kata kunci awal';
}
