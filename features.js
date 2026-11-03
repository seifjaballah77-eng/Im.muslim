(function(){
'use strict';
const $=s=>document.querySelector(s), all=s=>document.querySelectorAll(s), api='https://api.alquran.cloud/v1';
const nav=$('.side-nav');
const items=[['prayer','الصلاة والأذان','◷'],['library','المكتبة الإسلامية','▤'],['favorites','المفضلة','♡'],['tools','أدوات المسلم','✧'],['seasons','المواسم الإسلامية','☾'],['stats','إنجازاتي','▥']];
items.forEach(x=>nav.insertAdjacentHTML('beforeend','<button class="side-link" data-open="'+x[0]+'"><span>'+x[2]+'</span>'+x[1]+'</button>'));
const pages=`
<section id="prayer" class="section feature-page"><button class="smallbtn back" data-open="home">← الرئيسية</button><div class="section-head"><div><h2>الصلاة والأذان</h2><p class="muted">مواقيت قابلة لاختيار المدينة وطريقة الحساب.</p></div></div><div class="feature-grid">
<div class="feature-card"><h3>الصلاة القادمة</h3><div class="countdown-box"><div><div id="nextPrayerName" class="muted">بانتظار المواقيت</div><div id="prayerCountdown" class="countdown-time">--:--:--</div></div><span id="prayerMethodLabel" class="feature-pill">تونس</span></div><p id="prayerPageStatus" class="feature-note">اسمح بالموقع أو اختر مدينة يدوياً.</p></div>
<div class="feature-card"><h3>المدينة وطريقة الحساب</h3><label>المدينة</label><select id="citySelect" class="feature-select"><option value="Tunis">تونس العاصمة</option><option value="Sfax">صفاقس</option><option value="Sousse">سوسة</option><option value="Kairouan">القيروان</option><option value="Bizerte">بنزرت</option><option value="Gabes">قابس</option><option value="Gafsa">قفصة</option><option value="Medenine">مدنين</option><option value="manual">إحداثيات يدوية</option></select><label>طريقة الحساب</label><select id="prayerMethod" class="feature-select"><option value="18">تونس (18)</option><option value="3">رابطة العالم الإسلامي (3)</option><option value="2">أمريكا الشمالية (2)</option><option value="4">أم القرى – مكة (4)</option><option value="5">الهيئة المصرية (5)</option><option value="13">ديانت – تركيا (13)</option></select><div class="feature-row"><input id="manualLat" class="feature-input" type="number" step="any" placeholder="خط العرض"><input id="manualLon" class="feature-input" type="number" step="any" placeholder="خط الطول"></div><button id="applyPrayerLocation" class="feature-btn primary">تحديث المواقيت</button><p class="feature-note">قد تختلف النتائج دقائق عن توقيت المسجد أو الجهة الرسمية.</p></div>
<div class="feature-card"><h3>تذكير قبل الصلاة</h3><label>التنبيه قبل الصلاة</label><select id="reminderMinutes" class="feature-select"><option value="0">عند دخول الوقت</option><option value="5" selected>5 دقائق</option><option value="10">10 دقائق</option><option value="15">15 دقيقة</option><option value="20">20 دقيقة</option></select><div class="feature-actions"><button id="enablePrayerNotices" class="feature-btn primary">تفعيل الإشعارات</button><button id="testPrayerNotice" class="feature-btn">اختبار التنبيه</button></div><p id="noticeStatus" class="feature-note">التنبيه المحلي يعمل أثناء بقاء التطبيق مفتوحاً، ولا نضمنه بعد إغلاق المتصفح.</p></div>
<div class="feature-card"><h3>صوت الأذان</h3><p class="muted">أضف ملف الأذان الذي تفضله ليُشغّل عند التذكير المحلي أثناء فتح التطبيق.</p><input id="adhanFile" class="feature-input" type="file" accept="audio/*"><audio id="adhanPreview" class="reader-audio" controls></audio><div class="feature-actions"><button id="testAdhan" class="feature-btn">تجربة الصوت</button><button id="clearAdhan" class="feature-btn">إزالة الملف</button></div><p class="feature-note">الأذان الكامل عند إغلاق الشاشة يحتاج تطبيق Android أصلياً وجدولة نظامية.</p></div></div></section>
<section id="library" class="section feature-page"><button class="smallbtn back" data-open="home">← الرئيسية</button><div class="section-head"><div><h2>المكتبة الإسلامية</h2><p class="muted">مداخل مرتبة للقراءة والتعلم.</p></div></div><div class="feature-grid">
<article class="feature-card"><h3>القرآن وعلومه</h3><p>المصحف، البحث الموضوعي، التلاوة والتفسير الميسر.</p><button class="feature-btn primary" data-open="quran">افتح المصحف</button></article>
<article class="feature-card"><h3>حصن المسلم والأذكار</h3><p>أذكار الصباح والمساء والنوم وبعد الصلاة والسفر.</p><button class="feature-btn primary" data-open="adhkar">افتح الأذكار</button></article>
<article class="feature-card"><h3>الحديث النبوي</h3><p>أحاديث مختارة من الصحيحين مع المصدر ورقم الحديث.</p><button class="feature-btn primary" data-open="hadith">تصفح الأحاديث</button></article>
<article class="feature-card"><h3>فقه العبادات</h3><p>أدلة مبسطة للطهارة والصلاة والصيام والزكاة، مع التنبيه لاختلاف بعض الأحكام.</p><button class="feature-btn primary" data-open="learn">ابدأ التعلم</button></article>
<article class="feature-card"><h3>مسار السيرة النبوية</h3><p>مكة قبل البعثة، نزول الوحي، الهجرة، بناء المدينة، ثم الحج والوفاة.</p><textarea id="seerahNotes" class="feature-input" rows="3" placeholder="ملاحظات القراءة..."></textarea><button id="saveSeerahNotes" class="feature-btn">حفظ ملاحظاتي</button></article>
<article class="feature-card"><h3>مراجع إلكترونية</h3><p><a href="https://alquran.cloud/api" target="_blank" rel="noopener">توثيق واجهة القرآن</a></p><p><a href="https://sunnah.com/" target="_blank" rel="noopener">موسوعة السنة – Sunnah.com</a></p><p><a href="https://qurancomplex.gov.sa/" target="_blank" rel="noopener">مجمع الملك فهد لطباعة المصحف</a></p></article></div></section>
<section id="favorites" class="section feature-page"><button class="smallbtn back" data-open="home">← الرئيسية</button><div class="section-head"><div><h2>المفضلة وآخر قراءة</h2><p class="muted">محفوظة على هذا الجهاز.</p></div></div><div class="feature-card"><h3>متابعة القراءة</h3><div id="lastReadCard" class="feature-item">لم تحفظ موضع قراءة بعد.</div></div><div class="feature-card" style="margin-top:12px"><div class="feature-row"><h3>الآيات المحفوظة</h3><button id="refreshFavorites" class="feature-btn">تحديث</button></div><div id="favoriteList" class="feature-list"></div></div></section>
<section id="tools" class="section feature-page"><button class="smallbtn back" data-open="home">← الرئيسية</button><div class="section-head"><div><h2>أدوات المسلم</h2><p class="muted">حسابات وتذكيرات مساعدة وليست فتوى.</p></div></div><div class="feature-grid">
<div class="feature-card"><h3>حاسبة الزكاة – تقديرية</h3><label>إجمالي المال الزكوي</label><input id="zakatWealth" class="feature-input" type="number" min="0" step=".01" placeholder="المبلغ"><label>قيمة النصاب بعملتك</label><input id="zakatNisab" class="feature-input" type="number" min="0" step=".01" placeholder="أدخل قيمة النصاب"><label><input id="zakatYear" type="checkbox"> حال عليه الحول</label><button id="calculateZakat" class="feature-btn primary">احسب 2.5%</button><div id="zakatResult" class="zakat-result" hidden></div><p class="feature-note">على فرض اكتمال شروط الزكاة وبلوغ النصاب وحولان الحول. راجع تفاصيل أموالك مع جهة علمية موثوقة.</p></div>
<div class="feature-card"><h3>دعاء السفر</h3><p class="arabic">الله أكبر، الله أكبر، الله أكبر، سبحان الذي سخّر لنا هذا وما كنا له مقرنين، وإنا إلى ربنا لمنقلبون.</p><small>سورة الزخرف 13–14</small><button class="feature-btn" data-copy-text="الله أكبر، الله أكبر، الله أكبر، سبحان الذي سخّر لنا هذا وما كنا له مقرنين، وإنا إلى ربنا لمنقلبون.">نسخ الدعاء</button></div>
<div class="feature-card"><h3>أذكار الجمعة</h3><p>أكثر من الصلاة على النبي ﷺ، واقرأ سورة الكهف، وأكثر من الدعاء.</p><button class="feature-btn" data-open="adhkar">افتح الأذكار</button></div>
<div class="feature-card"><h3>الجمع والقصر للمسافر</h3><p>المسافة والمدة وأحكام الجمع والقصر تختلف تفاصيلها بين المذاهب والظروف. ارجع لفتوى موثوقة لحالتك.</p></div>
<div class="feature-card"><h3>بحث موضوعي في القرآن</h3><p>ابحث عن الصبر أو الرحمة أو الوالدين أو أي لفظ في المصحف.</p><button class="feature-btn" data-open="quran">افتح البحث القرآني</button></div>
<div class="feature-card"><h3>القبلة والبوصلة</h3><p>احسب الاتجاه من موقعك وفعّل مستشعر الهاتف إن كان مدعوماً.</p><button class="feature-btn" data-open="qibla">افتح القبلة</button></div></div></section>
<section id="seasons" class="section feature-page"><button class="smallbtn back" data-open="home">← الرئيسية</button><div class="section-head"><div><h2>المواسم الإسلامية</h2><p class="muted">رمضان والحج والعشر والأيام الفاضلة.</p></div></div><div class="feature-grid">
<article class="feature-card"><h3>رمضان المبارك</h3><p>خطة يومية: ورد قرآن، أذكار، صدقة، صلة رحم، ودعاء قبل الإفطار.</p><button class="feature-btn" data-open="quran">ختمة القرآن</button> <button class="feature-btn" data-open="adhkar">أذكار اليوم</button></article>
<article class="feature-card"><h3>العشر الأواخر وليلة القدر</h3><p>اجتهد في القيام والذكر والدعاء، وتحَرَّ ليلة القدر في أوتار العشر دون الجزم بليلة بعينها.</p><p class="arabic">اللهم إنك عفو تحب العفو فاعف عني.</p></article>
<article class="feature-card"><h3>الحج ويوم عرفة</h3><p>تذكير بأعمال الحج وأيام العشر من ذي الحجة، وصيام عرفة لغير الحاج وفق الحكم المعروف، مع الرجوع للتقويم الرسمي.</p><button class="feature-btn" data-open="learn">تعلم المناسك</button></article>
<article class="feature-card"><h3>الأشهر الحرم والأعياد</h3><p>المحرّم، رجب، ذو القعدة، وذو الحجة. قد يختلف ثبوت الهلال حسب البلد.</p><button class="feature-btn" data-open="calendar">التقويم الهجري</button></article>
<article class="feature-card"><h3>خطة ختمة شخصية</h3><label>عدد الأيام</label><input id="khatmaDays" class="feature-input" type="number" min="1" max="365" value="30"><button id="makeKhatma" class="feature-btn primary">احسب الورد</button><p id="khatmaResult" class="feature-note"></p></article>
<article class="feature-card"><h3>الإمساك والإفطار</h3><p>تعرض صفحة الصلاة الفجر والمغرب بحسب موقعك وطريقة الحساب. راجع إمساكية الجهة الرسمية في منطقتك.</p><button class="feature-btn" data-open="prayer">مواقيت الصلاة</button></article></div></section>
<section id="stats" class="section feature-page"><button class="smallbtn back" data-open="home">← الرئيسية</button><div class="section-head"><div><h2>إنجازاتي ووردي</h2><p class="muted">إحصائيات على هذا الجهاز فقط؛ ليست عداداً عالمياً.</p></div><button class="feature-btn" id="refreshStats">تحديث</button></div><div class="feature-grid">
<div class="feature-card"><h3>آيات اليوم</h3><div class="feature-kpi" id="statsVerses">0</div></div><div class="feature-card"><h3>التسبيح اليوم</h3><div class="feature-kpi" id="statsTasbih">0</div></div><div class="feature-card"><h3>الأذكار المكتملة اليوم</h3><div class="feature-kpi" id="statsAdhkar">0</div></div><div class="feature-card"><h3>أيام متتالية</h3><div class="feature-kpi" id="statsStreak">0</div></div></div><div class="feature-card" style="margin-top:12px"><h3>نشاط آخر 7 أيام</h3><div id="weekBars" class="week-bars"></div><h3 style="margin-top:20px">خريطة النشاط – 30 يوماً</h3><div id="activityHeatmap" class="heatmap"></div><p class="feature-note">البيانات محلية ولا تتم مزامنتها عبر الأجهزة.</p></div></section>`;
$('.app').insertAdjacentHTML('beforeend',pages);
const extraNav=all('.side-link').length>10?[...all('.side-link')].slice(10):[];
extraNav.forEach(b=>b.addEventListener('click',()=>window.openSection(b.dataset.open)));
all('.feature-page [data-open]').forEach(b=>b.addEventListener('click',()=>window.openSection(b.dataset.open)));
const homeTiles=$('.tiles');
if(homeTiles)homeTiles.insertAdjacentHTML('beforeend','<button class="tile" data-go="prayer"><span class="ico">◷</span><span>الصلاة والأذان</span></button><button class="tile" data-go="library"><span class="ico">▤</span><span>المكتبة</span></button><button class="tile" data-go="favorites"><span class="ico">♡</span><span>المفضلة</span></button><button class="tile" data-go="tools"><span class="ico">✧</span><span>الأدوات</span></button>');
const homePrayer=$('#prayerTimes')?.closest('.card');
if(homePrayer)homePrayer.insertAdjacentHTML('beforeend','<div class="countdown-box"><div><div class="muted" id="homeNextLabel">الصلاة القادمة</div><div class="countdown-time" id="prayerCountdownHome">--:--:--</div></div><button class="feature-btn" data-go="prayer">إعدادات الصلاة</button></div>');
all('[data-go]').forEach(b=>b.addEventListener('click',()=>window.openSection(b.dataset.go)));
/* Core navigation translations. */
const dict={
ar:{home:'الرئيسية',quran:'القرآن الكريم',adhkar:'الأذكار والأدعية',qibla:'اتجاه القبلة',tasbih:'المسبحة الإلكترونية',hadith:'الحديث الشريف',learn:'تعلم العبادات',names:'أسماء الله الحسنى',calendar:'التقويم الهجري',settings:'الإعدادات',prayer:'الصلاة والأذان',library:'المكتبة الإسلامية',favorites:'المفضلة',tools:'أدوات المسلم',seasons:'المواسم الإسلامية',stats:'إنجازاتي'},
fr:{home:'Accueil',quran:'Coran',adhkar:'Invocations',qibla:'Direction Qibla',tasbih:'Chapelet',hadith:'Hadith',learn:'Rites',names:'Noms d’Allah',calendar:'Calendrier hégirien',settings:'Paramètres',prayer:'Prière et Adhan',library:'Bibliothèque',favorites:'Favoris',tools:'Outils',seasons:'Saisons islamiques',stats:'Mes progrès'},
en:{home:'Home',quran:'The Quran',adhkar:'Dhikr & Duas',qibla:'Qibla direction',tasbih:'Tasbih',hadith:'Hadith',learn:'Worship guide',names:'Names of Allah',calendar:'Hijri calendar',settings:'Settings',prayer:'Prayer & Adhan',library:'Islamic library',favorites:'Favourites',tools:'Muslim tools',seasons:'Islamic seasons',stats:'My progress'},
es:{home:'Inicio',quran:'Corán',adhkar:'Recuerdos y súplicas',qibla:'Dirección de la Qibla',tasbih:'Rosario',hadith:'Hadiz',learn:'Ritos',names:'Nombres de Allah',calendar:'Calendario hijri',settings:'Ajustes',prayer:'Oración y Adhan',library:'Biblioteca islámica',favorites:'Favoritos',tools:'Herramientas',seasons:'Temporadas islámicas',stats:'Mi progreso'},
it:{home:'Home',quran:'Corano',adhkar:'Dhikr e suppliche',qibla:'Direzione Qibla',tasbih:'Rosario',hadith:'Hadith',learn:'Guida al culto',names:'Nomi di Allah',calendar:'Calendario egiriano',settings:'Impostazioni',prayer:'Preghiera e Adhan',library:'Biblioteca islamica',favorites:'Preferiti',tools:'Strumenti',seasons:'Ricorrenze islamiche',stats:'I miei progressi'}};
const settings=$('#settings .card');
if(settings)settings.insertAdjacentHTML('beforeend','<div class="listitem"><b>لغة الواجهة</b><select id="interfaceLanguage" class="field"><option value="ar">العربية</option><option value="fr">Français</option><option value="en">English</option><option value="es">Español</option><option value="it">Italiano</option></select><p class="feature-note">تترجم القوائم الأساسية؛ نص القرآن والأذكار يبقى بلغته الأصلية.</p></div><div class="listitem"><b>ألوان الواجهة</b><select id="paletteSelect" class="field"><option value="emerald">زمردي وذهبي</option><option value="night">سماء الليل</option><option value="pearl">لؤلؤي</option><option value="forest">طبيعة</option></select></div><div class="listitem"><b>الخصوصية</b><button id="clearLocalData" class="feature-btn">مسح بيانات هذا الجهاز</button></div>');
function applyLanguage(lang){
 const d=dict[lang]||dict.ar;
 all('.side-link[data-open]').forEach(b=>{const sp=b.querySelector('span'),id=b.dataset.open;b.textContent='';if(sp)b.appendChild(sp);b.appendChild(document.createTextNode(d[id]||id))});
 const dockNames={home:d.home,quran:d.quran,adhkar:d.adhkar,qibla:d.qibla};
 all('.mobile-dock [data-open]').forEach(b=>{const id=b.dataset.open,sp=b.querySelector('span'),label=lang==='ar'?(id==='adhkar'?'الأذكار والمسبحة':id==='qibla'?'القبلة والمزيد':id==='quran'?'القرآن':'الرئيسية'):(dockNames[id]||id);b.textContent='';if(sp)b.appendChild(sp);b.appendChild(document.createTextNode(label))});
 document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';saveLocal('interfaceLanguage',lang);
}
$('#interfaceLanguage')?.addEventListener('change',e=>applyLanguage(e.target.value));
readLocal('interfaceLanguage','ar').then(v=>{if($('#interfaceLanguage'))$('#interfaceLanguage').value=v;applyLanguage(v)});
const palettes={night:{bg:'#080d20',panel:'#121a33',panel2:'#192442',line:'#344264',gold:'#c5b4ff',mint:'#b6c8ff',text:'#f4f2ff',muted:'#b4bdd7'},pearl:{bg:'#f5f1e9',panel:'#fffdf8',panel2:'#eee9df',line:'#d6ccba',gold:'#96743b',mint:'#527b68',text:'#292b26',muted:'#66675e'},forest:{bg:'#10251b',panel:'#183527',panel2:'#214532',line:'#42684d',gold:'#e2c37b',mint:'#b9dfac',text:'#f3f4e8',muted:'#b7c8b4'}};
function usePalette(k){if(k==='emerald'){document.documentElement.removeAttribute('data-palette');return}const p=palettes[k];if(!p)return;Object.entries(p).forEach(x=>document.documentElement.style.setProperty('--'+x[0],x[1]));document.documentElement.dataset.palette=k}
$('#paletteSelect')?.addEventListener('change',e=>{usePalette(e.target.value);saveLocal('palette',e.target.value)});
readLocal('palette','emerald').then(v=>{if($('#paletteSelect'))$('#paletteSelect').value=v;usePalette(v)});
/* Quran: verse audio, tafsir, topic search, last position and reading modes. */
const reader=$('#surahReaderView'),toolbar=reader?.querySelector('.reader-toolbar');
if(toolbar)toolbar.insertAdjacentHTML('beforeend','<button id="focusModeBtn" class="smallbtn">وضع التركيز</button><button id="paperModeBtn" class="smallbtn">ورق المصحف</button><button id="saveBookmarkBtn" class="smallbtn">حفظ الموضع</button>');
if(reader)reader.insertAdjacentHTML('beforeend','<div id="readerTools" class="feature-card"><div class="reader-extra"><label>القارئ <select id="reciterSelect" class="feature-select"><option value="ar.alafasy">مشاري العفاسي</option><option value="ar.abdulbasit">عبد الباسط عبد الصمد</option><option value="ar.husary">محمود خليل الحصري</option></select></label><button id="playFullSurah" class="feature-btn primary">استمع للسورة كاملة</button><button id="topicSearchToggle" class="feature-btn">بحث في القرآن</button></div><audio id="quranAudio" controls class="reader-audio"></audio><div id="quranSearchPanel" hidden><div class="feature-row"><input id="quranSearchInput" class="feature-input" placeholder="كلمة أو موضوع مثل الصبر..."><button id="quranSearchGo" class="feature-btn">بحث</button><button id="quranVoiceSearch" class="feature-btn">بحث صوتي</button></div><div id="quranSearchResults" class="feature-list"></div></div><div id="tafsirPanel" class="tafsir-box" hidden></div></div>');
let activeSurah=0,audioEdition='ar.alafasy',audioMap=[],paper=false;
const player=$('#quranAudio');
async function getAudioMap(n){audioEdition=$('#reciterSelect')?.value||'ar.alafasy';try{const r=await fetch(api+'/surah/'+n+'/'+audioEdition);if(!r.ok)throw Error();audioMap=(await r.json()).data.ayahs||[]}catch(e){audioMap=[]}}
async function enhanceSurah(n){
 activeSurah=n;await getAudioMap(n);
 const saved=await readLocal('dailyReadVerses',[]),date=await readLocal('dailyReadDate',''),today=new Date().toLocaleDateString('en-CA');
 all('#surahContent .verse').forEach((el,i)=>{const ay=Number(el.dataset.ayah),info=audioMap[i]||{};if(date===today&&Array.isArray(saved)&&saved.includes(n+':'+ay))el.classList.add('read-marked');if(info.number)el.dataset.global=info.number;if(!el.querySelector('.verse-actions'))el.insertAdjacentHTML('beforeend','<div class="verse-actions"><button data-play-ayah="'+ay+'">استماع</button><button data-tafsir-ayah="'+ay+'">التفسير الميسر</button></div>')});
}
const originalLoad=window.loadSurah;
if(typeof originalLoad==='function')window.loadSurah=async function(n){await originalLoad(n);if(all('#surahContent .verse').length){await enhanceSurah(n);saveLocal('lastRead',{surah:n,ayah:1,at:Date.now()})}};
$('#reciterSelect')?.addEventListener('change',()=>{if(activeSurah)getAudioMap(activeSurah)});
$('#playFullSurah')?.addEventListener('click',()=>{if(!activeSurah)return toast('افتح سورة أولاً');player.src='https://cdn.islamic.network/quran/audio-surah/128/'+audioEdition+'/'+activeSurah+'.mp3';player.play().catch(()=>toast('اضغط تشغيل في مشغل الصوت'))});
$('#surahContent')?.addEventListener('click',e=>{
 const p=e.target.closest('[data-play-ayah]');if(p){e.stopPropagation();const i=Number(p.dataset.playAyah)-1,a=audioMap[i];if(!a?.number)return toast('تعذر تحديد ملف التلاوة');player.src=a.audio||('https://cdn.islamic.network/quran/audio/128/'+audioEdition+'/'+a.number+'.mp3');player.play().catch(()=>toast('اضغط تشغيل داخل المشغل'));return}
 const t=e.target.closest('[data-tafsir-ayah]');if(t){e.stopPropagation();showTafsir(activeSurah,Number(t.dataset.tafsirAyah))}
},true);
async function showTafsir(s,a){const p=$('#tafsirPanel');p.hidden=false;p.textContent='جارٍ تحميل التفسير الميسر…';try{const r=await fetch(api+'/ayah/'+s+':'+a+'/ar.muyassar');if(!r.ok)throw Error();const j=await r.json();p.innerHTML='<b>التفسير الميسر · '+s+':'+a+'</b><p></p><small>للتدبر، ولا يغني عن سؤال أهل العلم.</small>';p.querySelector('p').textContent=j.data.text}catch(e){p.textContent='تعذر تحميل التفسير حالياً.'}}
$('#topicSearchToggle')?.addEventListener('click',()=>{$('#quranSearchPanel').hidden=!$('#quranSearchPanel').hidden;$('#quranSearchInput').focus()});
async function searchQuran(){const q=$('#quranSearchInput').value.trim(),out=$('#quranSearchResults');if(!q)return;out.innerHTML='<p class="muted">جارٍ البحث…</p>';try{const r=await fetch(api+'/search/'+encodeURIComponent(q)+'/all/ar');if(!r.ok)throw Error();const rows=(await r.json()).data.matches||[];out.innerHTML=rows.length?rows.slice(0,40).map(x=>'<div class="feature-item"><p class="arabic"></p><small></small><button class="feature-btn" data-result-s="'+x.surah.number+'" data-result-a="'+x.numberInSurah+'">افتح الآية</button></div>').join(''):'<p class="muted">لا توجد نتائج.</p>';rows.slice(0,40).forEach((x,i)=>{out.children[i].querySelector('p').textContent=x.text;out.children[i].querySelector('small').textContent=x.surah.name+' · الآية '+x.numberInSurah})}catch(e){out.innerHTML='<p class="muted">تعذر البحث. تحقق من الاتصال.</p>'}}
$('#quranSearchGo')?.addEventListener('click',searchQuran);$('#quranSearchInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')searchQuran()});
$('#quranSearchResults')?.addEventListener('click',e=>{const b=e.target.closest('[data-result-s]');if(!b)return;window.openSection('quran');window.loadSurah(Number(b.dataset.resultS)).then(()=>setTimeout(()=>$('#surahContent [data-ayah="'+b.dataset.resultA+'"]')?.scrollIntoView({behavior:'smooth',block:'center'}),200))});
$('#quranVoiceSearch')?.addEventListener('click',()=>{const S=window.SpeechRecognition||window.webkitSpeechRecognition;if(!S)return toast('البحث الصوتي غير مدعوم هنا');const rec=new S();rec.lang='ar-SA';rec.onresult=e=>{$('#quranSearchInput').value=e.results[0][0].transcript;searchQuran()};rec.start()});
$('#focusModeBtn')?.addEventListener('click',()=>{document.body.classList.toggle('focus-reading');$('#focusModeBtn').textContent=document.body.classList.contains('focus-reading')?'إنهاء التركيز':'وضع التركيز'});
$('#paperModeBtn')?.addEventListener('click',()=>{paper=!paper;$('#surahContent').classList.toggle('reading-paper',paper);$('#paperModeBtn').textContent=paper?'إلغاء الورق':'ورق المصحف'});
async function bookmark(){const el=[...all('#surahContent .verse')].find(x=>{const r=x.getBoundingClientRect();return r.bottom>100&&r.top<innerHeight*.65});if(!el||!activeSurah)return toast('افتح سورة أولاً');await saveLocal('lastRead',{surah:activeSurah,ayah:Number(el.dataset.ayah),at:Date.now()});toast('تم حفظ موضع القراءة')}
$('#saveBookmarkBtn')?.addEventListener('click',bookmark);
const origMenu=window.showVerseMenu;if(typeof origMenu==='function')window.showVerseMenu=function(el,x,y){origMenu(el,x,y);selectedVerse={text:el.childNodes[0]?.textContent?.trim()||el.textContent.trim(),surah:activeSurah,ayah:el.dataset.ayah}};
let sx=null;$('#surahContent')?.addEventListener('touchstart',e=>{sx=e.changedTouches[0].clientX},{passive:true});$('#surahContent')?.addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>100&&activeSurah)window.loadSurah(Math.max(1,Math.min(114,activeSurah+(dx>0?-1:1))))},{passive:true});
/* Favourites and last-read restore. */
async function renderFavorites(){
 let fav=await readLocal('favoriteVerses',[]);fav=Array.isArray(fav)?fav:[];const keys=new Set();fav=fav.filter(v=>{const k=v.surah+':'+v.ayah;if(keys.has(k))return false;keys.add(k);return true});await saveLocal('favoriteVerses',fav);
 const box=$('#favoriteList');box.innerHTML=fav.length?fav.map((v,i)=>'<article class="feature-item"><p class="favorite-verse"></p><small></small><div class="feature-actions"><button class="feature-btn" data-fopen="'+i+'">افتح</button><button class="feature-btn" data-fremove="'+i+'">حذف</button></div></article>').join(''):'<p class="muted">لا توجد آيات محفوظة. اضغط مطولاً على آية واختر حفظ في المفضلة.</p>';
 fav.forEach((v,i)=>{box.children[i].querySelector('p').textContent=v.text;box.children[i].querySelector('small').textContent='السورة '+v.surah+' · الآية '+v.ayah});
 const last=await readLocal('lastRead',null);$('#lastReadCard').innerHTML=last?'<p>آخر موضع: سورة '+last.surah+' · الآية '+last.ayah+'</p><button class="feature-btn primary" id="resumeLastRead">متابعة القراءة</button>':'لم تحفظ موضع قراءة بعد.';
 $('#resumeLastRead')?.addEventListener('click',()=>window.loadSurah(Number(last.surah)).then(()=>setTimeout(()=>$('#surahContent [data-ayah="'+last.ayah+'"]')?.scrollIntoView({behavior:'smooth',block:'center'}),250)));
 box.onclick=async e=>{const o=e.target.closest('[data-fopen]'),d=e.target.closest('[data-fremove]');if(o){const v=fav[Number(o.dataset.fopen)];window.openSection('quran');window.loadSurah(v.surah).then(()=>setTimeout(()=>$('#surahContent [data-ayah="'+v.ayah+'"]')?.scrollIntoView({behavior:'smooth',block:'center'}),250))}if(d){fav.splice(Number(d.dataset.fremove),1);await saveLocal('favoriteVerses',fav);renderFavorites()}};
}
$('#refreshFavorites')?.addEventListener('click',renderFavorites);
all('[data-verse-action="favorite"]').forEach(b=>b.addEventListener('click',()=>setTimeout(renderFavorites,250)));
/* Verified short hadith selection: Bukhari/Muslim references. */
const hadiths=[
['إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى.','صحيح البخاري · 1','صحيح'],
['الدين النصيحة.','صحيح مسلم · 55','صحيح'],
['لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه.','صحيح البخاري · 13','صحيح'],
['من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت.','صحيح البخاري · 6018، وصحيح مسلم · 47','متفق عليه'],
['الكلمة الطيبة صدقة.','صحيح البخاري · 2989، وصحيح مسلم · 1009','متفق عليه'],
['يسروا ولا تعسروا، وبشروا ولا تنفروا.','صحيح البخاري · 69، وصحيح مسلم · 1734','متفق عليه']];
const hadithCard=$('#hadith .card');
if(hadithCard){hadithCard.innerHTML='<p class="feature-note">أحاديث مختارة من الصحيحين. قد يختلف الترقيم بين الطبعات.</p><input id="hadithSearch" class="feature-input" placeholder="ابحث في الأحاديث..."><div id="hadithList" class="feature-list"></div>';const render=()=>{const q=$('#hadithSearch').value;const rows=hadiths.filter(h=>h[0].includes(q)||h[1].includes(q));$('#hadithList').innerHTML=rows.map(h=>'<article class="feature-item"><p class="arabic"></p><small></small><span class="feature-pill"></span></article>').join('');rows.forEach((h,i)=>{const e=$('#hadithList').children[i];e.querySelector('p').textContent='«'+h[0]+'»';e.querySelector('small').textContent=h[1];e.querySelector('.feature-pill').textContent=h[2]})};$('#hadithSearch').addEventListener('input',render);render()}
/* Learning topics with cautious notes where rulings can differ. */
const learnCard=$('#learn .card');
if(learnCard){const topics=[
['الوضوء','غسل الكفين، والمضمضة والاستنشاق، وغسل الوجه، واليدين إلى المرفقين، ومسح الرأس، وغسل الرجلين إلى الكعبين مع الترتيب. النية محلها القلب. في تفصيل الفرائض والسنن اختلاف فقهي.'],
['الصلاة','تكبيرة الإحرام، والقيام والقراءة، والركوع والاعتدال، والسجود والجلوس بين السجدتين، ثم إتمام الركعات والتشهد والتسليم. تعلّم الصفة العملية من مصدر موثوق لمذهبك.'],
['الصيام','الإمساك عن المفطرات من طلوع الفجر إلى غروب الشمس مع النية وحفظ الجوارح. للمرض والسفر والقضاء والرخص تفاصيل.'],
['الزكاة','تجب في الأموال التي استوفت شروطها، ومنها بلوغ النصاب وحولان الحول في غالب الأموال. يختلف الحساب باختلاف نوع المال.'],
['التيمم','يشرع عند فقد الماء أو تعذر استعماله لضرر معتبر، وله شروط وصفة مبينة في كتب الفقه.'],
['الحج والعمرة','الإحرام والتلبية، والطواف والسعي، والوقوف بعرفة للحج، وبقية الأعمال حسب نوع النسك. يلزم الرجوع إلى دليل مناسك معتمد.']];
learnCard.innerHTML=topics.map(t=>'<div class="learn-item"><button class="learn-toggle" aria-expanded="false">'+t[0]+' <span>＋</span></button><div class="learn-content"></div></div>').join('')+'<p class="feature-note">مادة موجزة وليست فتوى؛ راجع جهة إفتاء موثوقة في المسائل التفصيلية.</p>';
topics.forEach((t,i)=>learnCard.querySelectorAll('.learn-content')[i].textContent=t[1]);learnCard.querySelectorAll('.learn-toggle').forEach(b=>b.addEventListener('click',()=>{const x=b.closest('.learn-item'),o=x.classList.toggle('open');b.setAttribute('aria-expanded',String(o));b.querySelector('span').textContent=o?'－':'＋'}))}
/* More daily adhkar with personal repetition counts. */
if(typeof adhkar==='object'){adhkar.travel=[['سبحان الذي سخّر لنا هذا وما كنا له مقرنين، وإنا إلى ربنا لمنقلبون.','دعاء الركوب'],['اللهم إنا نسألك في سفرنا هذا البر والتقوى، ومن العمل ما ترضى.','دعاء السفر']];adhkar.distress=[['لا إله إلا أنت سبحانك إني كنت من الظالمين.','دعاء ذي النون'],['حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم.','ذكر ودعاء']];adhkar.waking=[['الحمد لله الذي أحيانا بعدما أماتنا وإليه النشور.','عند الاستيقاظ']]}
function renderAdhkar(kind){const rows=adhkar[kind]||[];readLocal('adhkarCounters',{}).then(saved=>{const day=new Date().toLocaleDateString('en-CA'),rec=saved[day]||{};$('#adhkarList').innerHTML=rows.map((x,i)=>'<article class="feature-item"><p class="arabic"></p><small></small><div class="adhkar-action"><span id="adhkarN'+i+'" class="adhkar-progress"></span><button class="feature-btn primary" data-acount="'+i+'">تسبيح</button></div></article>').join('');rows.forEach((x,i)=>{$('#adhkarList').children[i].querySelector('p').textContent=x[0];$('#adhkarList').children[i].querySelector('small').textContent=x[1];$('#adhkarN'+i).textContent='العدد: '+(rec[kind+':'+i]||0)});$('#adhkarList').onclick=async e=>{const b=e.target.closest('[data-acount]');if(!b)return;const i=Number(b.dataset.acount),k=kind+':'+i;rec[k]=(rec[k]||0)+1;saved[day]=rec;await saveLocal('adhkarCounters',saved);$('#adhkarN'+i).textContent='العدد: '+rec[k];if(navigator.vibrate)navigator.vibrate(18);addStat('adhkar',1)}})}
all('[data-adhkar]').forEach(old=>{const b=old.cloneNode(true);old.replaceWith(b);b.addEventListener('click',()=>renderAdhkar(b.dataset.adhkar))});
const adhkarParent=all('[data-adhkar]')[0]?.parentElement;
if(adhkarParent)adhkarParent.insertAdjacentHTML('beforeend','<button class="tile" data-moreadhkar="travel">أذكار السفر</button><button class="tile" data-moreadhkar="distress">دعاء الكرب</button><button class="tile" data-moreadhkar="waking">أذكار الاستيقاظ</button>');
all('[data-moreadhkar]').forEach(b=>b.addEventListener('click',()=>renderAdhkar(b.dataset.moreadhkar)));
/* Tasbih presets and daily records. */
const tasCard=$('#tasbih .card');
if(tasCard)tasCard.insertAdjacentHTML('afterbegin','<select id="tasbihPreset" class="feature-select"><option>سبحان الله وبحمده</option><option>سبحان الله</option><option>الحمد لله</option><option>الله أكبر</option><option>لا إله إلا الله</option><option>أستغفر الله</option><option>اللهم صل وسلم على نبينا محمد</option></select><p class="feature-note">الهدف <select id="tasbihGoal" class="feature-select" style="display:inline;width:auto"><option>33</option><option>100</option><option>1000</option></select> مرة</p>');
$('#tasbihPreset')?.addEventListener('change',e=>{const el=$('#tasbih .card .muted');if(el)el.textContent=e.target.value});
const originalCount=$('#countBtn').onclick;
$('#countBtn').onclick=function(e){if(originalCount)originalCount.call(this,e);if(navigator.vibrate)navigator.vibrate(18);addStat('tasbih',1);if(Number($('#count').textContent)===Number($('#tasbihGoal').value))toast('أحسنت، أكملت الورد')};
/* Activity log, streak and heatmap. */
const dayKey=()=>new Date().toLocaleDateString('en-CA');
async function addStat(kind,n){const log=await readLocal('activityLog',{}),d=dayKey();if(!log[d])log[d]={verses:0,tasbih:0,adhkar:0};log[d][kind]=(log[d][kind]||0)+n;await saveLocal('activityLog',log)}
const oldProgress=window.updateDailyProgress;if(typeof oldProgress==='function')window.updateDailyProgress=function(){oldProgress();readLocal('activityLog',{}).then(log=>{const d=dayKey();if(!log[d])log[d]={verses:0,tasbih:0,adhkar:0};log[d].verses=Number(dailyReadCount)||0;saveLocal('activityLog',log)})};
async function renderStats(){
 const log=await readLocal('activityLog',{}),read=await readLocal('dailyReadVerses',[]),d=dayKey(),x=log[d]||{};
 $('#statsVerses').textContent=Array.isArray(read)?read.length:0;$('#statsTasbih').textContent=x.tasbih||0;$('#statsAdhkar').textContent=x.adhkar||0;
 let streak=0;for(let i=0;i<366;i++){const dt=new Date();dt.setDate(dt.getDate()-i);const v=log[dt.toLocaleDateString('en-CA')]||{};if((v.verses||0)+(v.tasbih||0)+(v.adhkar||0)>0)streak++;else if(i)break}$('#statsStreak').textContent=streak;
 const arr=Array.from({length:7},(_,i)=>{const dt=new Date();dt.setDate(dt.getDate()-6+i);const k=dt.toLocaleDateString('en-CA'),v=log[k]||{};return {k,n:(v.verses||0)+(v.tasbih||0)+(v.adhkar||0)}}),max=Math.max(1,...arr.map(a=>a.n));
 $('#weekBars').innerHTML=arr.map(a=>'<div class="week-bar-wrap"><span>'+a.n+'</span><div class="week-bar" style="height:'+Math.max(3,a.n/max*78)+'px"></div><small>'+a.k.slice(5)+'</small></div>').join('');
 $('#activityHeatmap').innerHTML=Array.from({length:30},(_,i)=>{const dt=new Date();dt.setDate(dt.getDate()-29+i);const k=dt.toLocaleDateString('en-CA'),v=log[k]||{},n=(v.verses||0)+(v.tasbih||0)+(v.adhkar||0),level=n===0?0:n<10?1:n<40?2:n<100?3:4;return '<div class="heat-cell" data-level="'+level+'" title="'+k+' · '+n+' نشاط"></div>'}).join('');
}
$('#refreshStats')?.addEventListener('click',renderStats);renderStats();
/* Prayer methods and notifications. Tunisia's method is selectable, not forced. */
const cities={Tunis:[36.8065,10.1815],Sfax:[34.7406,10.7603],Sousse:[35.8256,10.63699],Kairouan:[35.6781,10.0963],Bizerte:[37.2744,9.8739],Gabes:[33.8815,10.0982],Gafsa:[34.425,8.7842],Medenine:[33.3549,10.5055]};
let prayerCoords=null,timings=null,minutes=5,lastNotice='',adhanBlob=null,adhanUrl=null;
async function loadPrayer(lat,lon){prayerCoords={lat:Number(lat),lon:Number(lon)};const method=Number($('#prayerMethod')?.value||18);$('#prayerPageStatus').textContent='جارٍ حساب المواقيت…';try{const r=await fetch('https://api.aladhan.com/v1/timings?latitude='+lat+'&longitude='+lon+'&method='+method);if(!r.ok)throw Error();const j=await r.json();timings=j.data.timings;window.prayerTimesData=timings;const k=[['الفجر','Fajr'],['الظهر','Dhuhr'],['العصر','Asr'],['المغرب','Maghrib'],['العشاء','Isha']];$('#prayerTimes').innerHTML=k.map(a=>'<div class="prayer"><span>'+a[0]+'</span><b>'+timings[a[1]]+'</b></div>').join('');$('#locationLabel').textContent=j.data.meta.timezone||'الموقع المختار';$('#prayerStatus').textContent='المواقيت محسوبة بطريقة '+method+'. تحقق من التوقيت المحلي لمسجدك.';$('#prayerPageStatus').textContent='تم تحديث المواقيت · '+(j.data.date?.readable||'اليوم');$('#prayerMethodLabel').textContent='طريقة الحساب: '+method;refreshPrayer();return true}catch(e){$('#prayerPageStatus').textContent='تعذر تحميل المواقيت. تحقق من الاتصال.';return false}}
window.loadPrayer=loadPrayer;
function nextPrayer(){if(!timings)return null;const k=[['الفجر','Fajr'],['الظهر','Dhuhr'],['العصر','Asr'],['المغرب','Maghrib'],['العشاء','Isha']],now=new Date();for(const [name,key] of k){const [h,m]=timings[key].split(':').map(Number),d=new Date();d.setHours(h,m,0,0);if(d>now)return {name,key,date:d}}const [h,m]=timings.Fajr.split(':').map(Number),d=new Date();d.setDate(d.getDate()+1);d.setHours(h,m,0,0);return {name:'الفجر',key:'Fajr',date:d}}
function refreshPrayer(){const t=nextPrayer();if(!t)return;const n=Math.max(0,Math.floor((t.date-new Date())/1000)),s=String(n%60).padStart(2,'0'),m=String(Math.floor(n/60)%60).padStart(2,'0'),h=String(Math.floor(n/3600)).padStart(2,'0');$('#nextPrayerName').textContent=t.name;$('#homeNextLabel').textContent='الصلاة القادمة: '+t.name;$('#prayerCountdown').textContent=h+':'+m+':'+s;$('#prayerCountdownHome').textContent=h+':'+m+':'+s;$('#nextPrayer').textContent=t.name+' '+timings[t.key]}
function setCity(){const v=$('#citySelect').value;if(v==='manual'){const a=Number($('#manualLat').value),b=Number($('#manualLon').value);if(!Number.isFinite(a)||!Number.isFinite(b)||Math.abs(a)>90||Math.abs(b)>180)return toast('أدخل إحداثيات صحيحة');loadPrayer(a,b)}else if(cities[v])loadPrayer(...cities[v])}
$('#applyPrayerLocation')?.addEventListener('click',setCity);$('#citySelect')?.addEventListener('change',()=>{if($('#citySelect').value==='manual')$('#manualLat').focus();else setCity()});
$('#prayerMethod')?.addEventListener('change',()=>{saveLocal('prayerMethod',$('#prayerMethod').value);if(prayerCoords)loadPrayer(prayerCoords.lat,prayerCoords.lon)});
readLocal('prayerMethod','18').then(v=>{if($('#prayerMethod'))$('#prayerMethod').value=String(v)});
readLocal('reminderMinutes',5).then(v=>{minutes=Number(v);if($('#reminderMinutes'))$('#reminderMinutes').value=String(v)});
$('#reminderMinutes')?.addEventListener('change',e=>{minutes=Number(e.target.value);saveLocal('reminderMinutes',minutes)});
async function notice(title,body){if(!('Notification'in window)||Notification.permission!=='granted')return false;try{if('serviceWorker'in navigator){const r=await navigator.serviceWorker.ready;await r.showNotification(title,{body,icon:'./icons/icon.svg',tag:'imuslim-prayer'})}else new Notification(title,{body});return true}catch(e){return false}}
$('#enablePrayerNotices')?.addEventListener('click',async()=>{if(!('Notification'in window))return toast('الإشعارات غير مدعومة');const p=await Notification.requestPermission();$('#noticeStatus').textContent=p==='granted'?'تم السماح؛ التذكير أثناء فتح التطبيق فقط.':'لم يتم منح الإذن.'});
$('#testPrayerNotice')?.addEventListener('click',async()=>{if(!await notice('i-Muslim · اختبار','هذا اختبار لإشعارات التطبيق.'))toast('اسمح بالإشعارات أولاً')});
function playAdhan(){if(adhanBlob){const a=$('#adhanPreview');a.currentTime=0;a.play().catch(()=>{});return}try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C(),o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(660,c.currentTime);o.frequency.setValueAtTime(880,c.currentTime+.25);g.gain.setValueAtTime(.001,c.currentTime);g.gain.exponentialRampToValueAtTime(.1,c.currentTime+.05);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.7);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.72);o.onended=()=>c.close()}catch(e){}}
async function reminderCheck(){if(!timings||!('Notification'in window)||Notification.permission!=='granted')return;const now=new Date();for(const [name,key] of [['الفجر','Fajr'],['الظهر','Dhuhr'],['العصر','Asr'],['المغرب','Maghrib'],['العشاء','Isha']]){const [h,m]=timings[key].split(':').map(Number),d=new Date();d.setHours(h,m-minutes,0,0);const stamp=dayKey()+key+minutes,delta=now-d;if(delta>=0&&delta<18000&&lastNotice!==stamp){lastNotice=stamp;await notice('i-Muslim · تذكير','اقترب موعد صلاة '+name);playAdhan();break}}}
setInterval(()=>{refreshPrayer();reminderCheck()},1000);
$('#adhanFile')?.addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;if(f.size>15*1024*1024){toast('الحد الأقصى 15 ميغابايت');return}adhanBlob=f;await saveLocal('adhanAudio',f);if(adhanUrl)URL.revokeObjectURL(adhanUrl);adhanUrl=URL.createObjectURL(f);$('#adhanPreview').src=adhanUrl;toast('تم حفظ صوت الأذان على الجهاز')});
readLocal('adhanAudio',null).then(f=>{if(f instanceof Blob){adhanBlob=f;adhanUrl=URL.createObjectURL(f);$('#adhanPreview').src=adhanUrl}});
$('#testAdhan')?.addEventListener('click',()=>adhanBlob?$('#adhanPreview').play().catch(()=>{}):playAdhan());
$('#clearAdhan')?.addEventListener('click',()=>{adhanBlob=null;$('#adhanPreview').removeAttribute('src');$('#adhanFile').value='';saveLocal('adhanAudio',null);toast('تمت إزالة الملف')});
function refreshPrayerPage(){if(prayerCoords)refreshPrayer()}
if(!window.userCoords)loadPrayer(...cities.Tunis);
/* Compass heading sensor. */
const qb=$('#qibla .card');
if(qb)qb.insertAdjacentHTML('afterbegin','<div class="compass-face"><span class="compass-north">الشمال</span><div id="compassArrow" class="compass-arrow">↑</div></div><div class="feature-actions" style="justify-content:center"><button id="enableCompassBtn" class="feature-btn">تفعيل بوصلة الهاتف</button></div><p id="compassStatus" class="feature-note center">لا تتوفر حساسات الاتجاه في كل الأجهزة.</p>');
let heading=null;function compassUpdate(){const b=Number($('#qiblaDegree')?.textContent.replace('°',''));if(heading!==null&&Number.isFinite(b))$('#compassArrow').style.transform='rotate('+(b-heading)+'deg)'}
function compassEvent(e){const h=typeof e.webkitCompassHeading==='number'?e.webkitCompassHeading:typeof e.alpha==='number'?360-e.alpha:null;if(h!==null){heading=h;compassUpdate();$('#compassStatus').textContent='تم رصد اتجاه الهاتف؛ عاير البوصلة بعيداً عن المعادن.'}}
$('#enableCompassBtn')?.addEventListener('click',async()=>{try{if(typeof DeviceOrientationEvent!=='undefined'&&DeviceOrientationEvent.requestPermission){if(await DeviceOrientationEvent.requestPermission()!=='granted')throw Error()}addEventListener('deviceorientation',compassEvent,true);$('#compassStatus').textContent='جارٍ انتظار المستشعر…'}catch(e){$('#compassStatus').textContent='لم يسمح الجهاز باستخدام المستشعر.'}});
const oldCalc=window.calcQibla;if(typeof oldCalc==='function')window.calcQibla=function(a,b){oldCalc(a,b);setTimeout(compassUpdate,30)};
/* Zakat, khatma, notes, share and privacy tools. */
$('#calculateZakat')?.addEventListener('click',()=>{const w=Number($('#zakatWealth').value),n=Number($('#zakatNisab').value),y=$('#zakatYear').checked,o=$('#zakatResult');o.hidden=false;if(!(w>=0)||!(n>0)){o.textContent='أدخل المال والنصاب بصورة صحيحة.';return}o.textContent=w<n?'لم يبلغ المال النصاب الذي أدخلته.':!y?'بلغ المال النصاب، لكن لم تحدد اكتمال الحول.':'الزكاة التقديرية: '+(w*.025).toLocaleString(undefined,{maximumFractionDigits:2})+' (2.5%)'});
$('#makeKhatma')?.addEventListener('click',()=>{const d=Math.max(1,Math.min(365,Number($('#khatmaDays').value)||30));$('#khatmaResult').textContent='اقرأ نحو '+Math.ceil(604/d)+' صفحة يومياً ('+(30/d).toFixed(2)+' جزء تقريباً) لإكمال المصحف في '+d+' يوماً.'});
$('#saveSeerahNotes')?.addEventListener('click',()=>saveLocal('seerahNotes',$('#seerahNotes').value).then(()=>toast('حُفظت الملاحظات')));
readLocal('seerahNotes','').then(v=>{if($('#seerahNotes'))$('#seerahNotes').value=v||''});
all('[data-copy-text]').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(b.dataset.copyText);toast('تم النسخ')}catch(e){toast('تعذر النسخ')}}));
$('#clearLocalData')?.addEventListener('click',async()=>{if(!confirm('سيتم حذف المفضلة والعدادات والموضع المحفوظ والإنجازات من هذا الجهاز. هل تريد المتابعة؟'))return;try{const db=await openLocalDB();await new Promise((ok,no)=>{const t=db.transaction('kv','readwrite');t.objectStore('kv').clear();t.oncomplete=ok;t.onerror=()=>no(t.error)})}catch(e){}Object.keys(localStorage).filter(k=>k.startsWith('imuslim-')).forEach(k=>localStorage.removeItem(k));toast('تم مسح البيانات؛ سيعاد تحميل التطبيق');setTimeout(()=>location.reload(),900)});
const oldOpen=window.openSection;if(typeof oldOpen==='function')window.openSection=function(id){oldOpen(id);if(id==='favorites')renderFavorites();if(id==='stats')renderStats();if(id==='prayer')refreshPrayerPage()};
renderFavorites();
addEventListener('keydown',e=>{if(e.key==='Escape'){document.body.classList.remove('focus-reading');if($('#sidebar')?.classList.contains('open'))$('#menuToggle').click()}});
/* Time-aware UI, accent, glass, stars and daily Quran card. */
const settingsExtras=$('#settings .card');
if(settingsExtras){
 settingsExtras.insertAdjacentHTML('beforeend',
 '<div class="listitem"><b>لون الإضاءة والنيون</b><select id="accentSelect" class="field"><option value="emerald">أخضر زمردي</option><option value="purple">بنفسجي</option><option value="cyan">أزرق سماوي</option><option value="gold">ذهبي</option></select></div>'+
 '<div class="listitem"><label><input id="timeThemeToggle" type="checkbox"> تغيير الثيم تلقائياً حسب وقت اليوم</label><p class="feature-note">فجر هادئ، نهار مشرق، مغرب دافئ، وليل داكن.</p></div>'+
 '<div class="listitem"><label><input id="glassToggle" type="checkbox"> بطاقات زجاجية شفافة</label></div>'+
 '<div class="listitem"><label><input id="starsToggle" type="checkbox"> نجوم ليلية متحركة هادئة</label></div>'+
 '<div class="listitem"><label><input id="ambientToggle" type="checkbox"> صوت مطر هادئ أثناء القراءة</label><p class="feature-note">صوت مطر توليدي محلي، دون موسيقى أو ملف خارجي.</p></div>'+
 '<div class="listitem"><b>التثبيت على iPhone</b><p class="feature-note">افتح الرابط في Safari، اضغط مشاركة، ثم «إضافة إلى الشاشة الرئيسية». على Android استخدم زر تثبيت التطبيق عندما يظهر.</p></div>'+
 '<div class="listitem"><b>الإشعارات المتقدمة والودجات</b><p class="feature-note">إشعارات Push بعد إغلاق الموقع تحتاج خادم Push ومفاتيح VAPID واشتراكاً محفوظاً على الخادم. ودجات الشاشة تحتاج تطبيقاً أصلياً على Android/iOS؛ نسخة الويب لا تنشئها وحدها.</p></div>'+
 '<div class="listitem"><b>العداد العالمي للصلاة على النبي ﷺ</b><p class="feature-note">العداد الحالي محلي على جهازك. تحويله إلى عداد عالمي موثوق يتطلب قاعدة بيانات مشتركة وخادماً يمنع تكرار الإرسال والتلاعب؛ لن نعرض رقماً عالمياً وهمياً.</p></div>'
 );
 const psel=$('#paletteSelect');if(psel&&!psel.querySelector('option[value="time"]'))psel.insertAdjacentHTML('beforeend','<option value="time">ثيم زمني تلقائي</option>');
}
if(!$('#starLayer'))document.body.insertAdjacentHTML('afterbegin','<div id="starLayer" aria-hidden="true"></div>');
const accents={emerald:{gold:'#d8b56d',mint:'#9dd8bd',glow:'#34d399'},purple:{gold:'#c9a7ff',mint:'#d2c3ff',glow:'#a855f7'},cyan:{gold:'#72d9ee',mint:'#a3f1ed',glow:'#22d3ee'},gold:{gold:'#f0cf82',mint:'#d9c48d',glow:'#eabf57'}};
function applyAccent(k){const a=accents[k]||accents.emerald;document.documentElement.style.setProperty('--gold',a.gold);document.documentElement.style.setProperty('--mint',a.mint);document.documentElement.style.setProperty('--line',k==='emerald'?'#285044':a.glow+'66');document.documentElement.dataset.accent=k}
$('#accentSelect')?.addEventListener('change',e=>{applyAccent(e.target.value);saveLocal('accent',e.target.value)});
readLocal('accent','emerald').then(v=>{if($('#accentSelect'))$('#accentSelect').value=v;applyAccent(v)});
function themeByTime(){
 const h=new Date().getHours();
 const p=h>=4&&h<8?{name:'الفجر',bg:'#10252a',panel:'#18343a',panel2:'#21434a',line:'#456a70',gold:'#dfbd82',mint:'#b5d8ce',text:'#f1f0e8',muted:'#b6c9c4'}:
 h>=8&&h<16?{name:'النهار',bg:'#10261f',panel:'#17382b',panel2:'#204535',line:'#476a52',gold:'#e4c67c',mint:'#b8dfbd',text:'#f5f3e9',muted:'#bdcbbd'}:
 h>=16&&h<19?{name:'المغرب',bg:'#2a1b18',panel:'#3c2821',panel2:'#4b3025',line:'#76513d',gold:'#efb879',mint:'#e6c0a0',text:'#fff0dc',muted:'#dbc4b1'}:
 {name:'العشاء',bg:'#090d20',panel:'#11182d',panel2:'#1b2540',line:'#344360',gold:'#c7b0ff',mint:'#b9c9f3',text:'#f4f2ff',muted:'#b4bdd7'};
 Object.entries(p).filter(x=>x[0]!=='name').forEach(([k,v])=>document.documentElement.style.setProperty('--'+k,v));
 document.documentElement.dataset.timeTheme=p.name;document.documentElement.dataset.stars=h<5||h>=19?'on':'off';
}
function toggleBool(k,on){document.body.dataset[k]=on?'on':'off';saveLocal(k,on)}
$('#glassToggle')?.addEventListener('change',e=>toggleBool('glass',e.target.checked));
$('#starsToggle')?.addEventListener('change',e=>toggleBool('stars',e.target.checked));
readLocal('glass',false).then(v=>{if($('#glassToggle'))$('#glassToggle').checked=!!v;document.body.dataset.glass=v?'on':'off'});
readLocal('stars',false).then(v=>{if($('#starsToggle'))$('#starsToggle').checked=!!v;document.body.dataset.stars=v?'on':'off'});
readLocal('timeTheme',false).then(v=>{if($('#timeThemeToggle'))$('#timeThemeToggle').checked=!!v;if(v){if($('#paletteSelect'))$('#paletteSelect').value='time';themeByTime()}});
$('#timeThemeToggle')?.addEventListener('change',e=>{saveLocal('timeTheme',e.target.checked);if(e.target.checked){if($('#paletteSelect'))$('#paletteSelect').value='time';themeByTime()}else{delete document.documentElement.dataset.timeTheme;readLocal('palette','emerald').then(usePalette)}});
const oldPaletteChange=$('#paletteSelect')?.onchange;
$('#paletteSelect')?.addEventListener('change',e=>{
 if(e.target.value==='time'){saveLocal('timeTheme',true);if($('#timeThemeToggle'))$('#timeThemeToggle').checked=true;themeByTime()}
 else{saveLocal('timeTheme',false);if($('#timeThemeToggle'))$('#timeThemeToggle').checked=false;usePalette(e.target.value)}
});
setInterval(()=>{if(document.documentElement.dataset.timeTheme)themeByTime()},5*60*1000);
/* Rebuild daily verse as a flip card, using an actual verse returned by Quran API. */
const dailyCard=$('#dailyVerse')?.closest('.card');
if(dailyCard){
 dailyCard.innerHTML='<h3>رسالة من القرآن</h3><div class="daily-flip-wrap"><div id="dailyFlip" class="daily-flip"><div class="daily-face front"><small>آية اليوم · اضغط لقلب البطاقة</small><div id="dailyVerse" class="arabic">﴿ فَاذْكُرُونِي أَذْكُرْكُمْ ﴾</div><small id="dailyVerseRef">البقرة · 152</small></div><div class="daily-face back"><small>تدبر في الآية</small><p id="dailyVerseBack" class="arabic">اجعل للقرآن حضوراً في يومك.</p><small id="dailyVerseBackRef"></small></div></div></div><button id="flipDailyVerse" class="feature-btn daily-flip-button">اقلب البطاقة</button><button id="shareDailyVerse" class="feature-btn daily-flip-button">مشاركة الآية</button>';
}
let dailyData=null;
async function loadDailyVerse(){
 const saved=await readLocal('dailyVerseCard',null),today=dayKey();
 if(saved?.date===today)dailyData=saved;
 else{
  try{const r=await fetch(api+'/ayah/random/quran-uthmani');if(!r.ok)throw Error();const j=await r.json(),a=j.data;dailyData={date:today,text:a.text,surah:a.surah.name,ayah:a.numberInSurah,number:a.number};await saveLocal('dailyVerseCard',dailyData)}catch(e){dailyData={date:today,text:'فَاذْكُرُونِي أَذْكُرْكُمْ',surah:'البقرة',ayah:152}}
 }
 if($('#dailyVerse'))$('#dailyVerse').textContent='﴿ '+dailyData.text+' ﴾';
 if($('#dailyVerseRef'))$('#dailyVerseRef').textContent=dailyData.surah+' · الآية '+dailyData.ayah;
 if($('#dailyVerseBack'))$('#dailyVerseBack').textContent='توقف لحظة، واقرأ الآية بتدبر، واجعلها رفيقة يومك.';
 if($('#dailyVerseBackRef'))$('#dailyVerseBackRef').textContent=dailyData.surah+' · '+dailyData.ayah;
}
$('#flipDailyVerse')?.addEventListener('click',()=>$('#dailyFlip').classList.toggle('flipped'));
$('#dailyFlip')?.addEventListener('click',()=>$('#dailyFlip').classList.toggle('flipped'));
$('#shareDailyVerse')?.addEventListener('click',async()=>{if(!dailyData)return;const t='﴿ '+dailyData.text+' ﴾\\n'+dailyData.surah+' · الآية '+dailyData.ayah+'\\n— i-Muslim';try{if(navigator.share)await navigator.share({title:'آية من القرآن الكريم',text:t});else{await navigator.clipboard.writeText(t);toast('تم نسخ الآية للمشاركة')}}catch(e){}});
loadDailyVerse();
/* Automatic bookmark: offer resume on the home screen and keep page metadata. */
const homeHero=$('#home .hero');
if(homeHero)homeHero.insertAdjacentHTML('afterend','<div id="continueReadingCard" class="feature-card" hidden><div class="feature-row"><div><h3>تابع من حيث وصلت</h3><p id="continueReadingLabel" class="muted"></p></div><button id="continueReadingBtn" class="feature-btn primary">متابعة القراءة</button></div></div>');
async function refreshContinueCard(){
 const last=await readLocal('lastRead',null),card=$('#continueReadingCard');if(!card)return;
 card.hidden=!last;if(!last)return;
 let title='سورة رقم '+last.surah;
 try{const ss=window.surahs||[];if(ss[last.surah-1])title=ss[last.surah-1].name}catch(e){}
 $('#continueReadingLabel').textContent=title+' · الآية '+(last.ayah||1)+(last.page?' · الصفحة '+last.page:'');
}
$('#continueReadingBtn')?.addEventListener('click',async()=>{const last=await readLocal('lastRead',null);if(!last)return;window.openSection('quran');await window.loadSurah(Number(last.surah));setTimeout(()=>$('#surahContent [data-ayah="'+last.ayah+'"]')?.scrollIntoView({behavior:'smooth',block:'center'}),250)});
const surahContent=$('#surahContent');
surahContent?.addEventListener('click',e=>{
 const b=e.target.closest('button'),v=e.target.closest('.verse');
 if(!v||b)return;
 const n=Number(v.dataset.ayah),page=Number(v.dataset.page)||null;
 saveLocal('lastRead',{surah:activeSurah,ayah:n,page,at:Date.now()});refreshContinueCard();
});
async function savePreciseBookmark(){
 const el=[...all('#surahContent .verse')].find(x=>{const r=x.getBoundingClientRect();return r.bottom>100&&r.top<innerHeight*.65});
 if(!el||!activeSurah)return toast('افتح سورة أولاً');
 const mark={surah:activeSurah,ayah:Number(el.dataset.ayah),page:Number(el.dataset.page)||null,at:Date.now()};
 await saveLocal('lastRead',mark);refreshContinueCard();toast('تم حفظ السورة والآية والصفحة');
}
$('#saveBookmarkBtn')?.removeEventListener('click',bookmark);
$('#saveBookmarkBtn')?.addEventListener('click',savePreciseBookmark);
refreshContinueCard();
/* Prayer interval progress and edge glow at the actual prayer time. */
function ensureProgress(el){
 if(!el||el.querySelector('.prayer-progress-track'))return;
 el.insertAdjacentHTML('beforeend','<div class="prayer-progress-track"><div id="'+(el.id||'prayer')+'ProgressFill" class="prayer-progress-fill"></div></div><div class="prayer-progress-meta"><span id="'+(el.id||'prayer')+'ProgressLabel">الوقت المنقضي</span><span id="'+(el.id||'prayer')+'ProgressPercent">0%</span></div>');
}
const prayerCountdown=$('#prayerCountdown')?.closest('.countdown-box'),homeCountdown=$('#prayerCountdownHome')?.closest('.countdown-box');
ensureProgress(prayerCountdown);ensureProgress(homeCountdown);
const oldRefresh=refreshPrayer;
refreshPrayer=function(){
 oldRefresh();
 const t=nextPrayer();if(!t||!timings)return;
 const keys=['Fajr','Dhuhr','Asr','Maghrib','Isha'],i=keys.indexOf(t.key),prev=keys[(i+4)%5],[ph,pm]=timings[prev].split(':').map(Number),start=new Date(t.date);
 start.setHours(ph,pm,0,0);if(prev==='Isha'&&t.key==='Fajr')start.setDate(start.getDate()-1);
 const span=Math.max(1,t.date-start),pct=Math.max(0,Math.min(100,(Date.now()-start)/span*100));
 [[prayerCountdown,'prayerCountdown'],[homeCountdown,'prayerCountdownHome']].forEach(([el,id])=>{if(!el)return;const fill=$('#'+id+'ProgressFill'),label=$('#'+id+'ProgressLabel'),percent=$('#'+id+'ProgressPercent');if(fill)fill.style.width=pct.toFixed(1)+'%';if(label)label.textContent='الوقت المنقضي منذ الصلاة السابقة';if(percent)percent.textContent=Math.round(pct)+'%'});
};
let lastEdgePulse='';
function pulsePrayerEdge(){if(!timings)return;const now=new Date();for(const [name,key] of [['الفجر','Fajr'],['الظهر','Dhuhr'],['العصر','Asr'],['المغرب','Maghrib'],['العشاء','Isha']]){const [h,m]=timings[key].split(':').map(Number),d=new Date();d.setHours(h,m,0,0);const delta=Math.abs(Date.now()-d.getTime()),stamp=dayKey()+key;if(delta<18000&&lastEdgePulse!==stamp){lastEdgePulse=stamp;document.body.classList.add('prayer-edge-glow');setTimeout(()=>document.body.classList.remove('prayer-edge-glow'),2900);if(navigator.vibrate)navigator.vibrate([60,40,60]);break}}}
setInterval(()=>{refreshPrayer();pulsePrayerEdge()},1000);
/* Gradual tasbih haptics at 33, 66 and 100 repetitions. */
const previousTasbihHandler=$('#countBtn')?.onclick;
if($('#countBtn'))$('#countBtn').onclick=function(e){
 if(previousTasbihHandler)previousTasbihHandler.call(this,e);
 const c=Number($('#count').textContent)||0;
 if(navigator.vibrate){if(c%100===0)navigator.vibrate([70,45,110]);else if(c%33===0)navigator.vibrate([35,25,55]);else navigator.vibrate(12)}
 if(c>0&&c%33===0&&c%100!==0)toast('أكملت '+c+' تسبيحة');
};
/* One-tap share action on every verse. */
const oldEnhance=enhanceSurah;
enhanceSurah=async function(n){
 await oldEnhance(n);
 all('#surahContent .verse').forEach(el=>{
  if(!el.querySelector('[data-share-verse]'))el.querySelector('.verse-actions')?.insertAdjacentHTML('beforeend','<button data-share-verse="'+el.dataset.ayah+'">مشاركة</button>');
  if(!el.dataset.page&&el.dataset.mushafPage)el.dataset.page=el.dataset.mushafPage;
 });
};
surahContent?.addEventListener('click',async e=>{
 const b=e.target.closest('[data-share-verse]');if(!b)return;
 e.stopPropagation();e.preventDefault();
 const v=b.closest('.verse'),text=(v?.childNodes[0]?.textContent||'').trim();
 const ref=(window.surahs?.[activeSurah-1]?.name||'القرآن الكريم')+' · الآية '+b.dataset.shareVerse;
 const payload=text+'\\n'+ref+'\\n— i-Muslim';
 try{if(navigator.share)await navigator.share({title:'آية من القرآن الكريم',text:payload});else{await navigator.clipboard.writeText(payload);toast('تم نسخ الآية للمشاركة')}}catch(e){}
},true);
/* Topic index: curated words are search entry points, results remain real Quran matches. */
const lib=$('#library .feature-grid');
if(lib)lib.insertAdjacentHTML('beforeend','<article class="feature-card"><h3>فهرس موضوعات القرآن</h3><p>اختر موضوعاً للبحث في نص المصحف.</p><div id="topicChips" class="topic-chips"><button data-topic="الصبر">الصبر</button><button data-topic="الرزق">الرزق</button><button data-topic="التوبة">التوبة</button><button data-topic="الوالدين">الوالدان</button><button data-topic="الرحمة">الرحمة</button><button data-topic="الشكر">الشكر</button><button data-topic="العدل">العدل</button><button data-topic="الجنة">الجنة</button></div><div id="topicResults" class="feature-list"></div><p class="feature-note">هذا فهرس استكشافي بألفاظ البحث، وليس تصنيفاً تفسيرياً شاملاً لكل الآيات المتعلقة بالموضوع.</p></article>');
async function topicSearch(word){
 const out=$('#topicResults');out.innerHTML='<p class="muted">جارٍ البحث…</p>';
 try{const r=await fetch(api+'/search/'+encodeURIComponent(word)+'/all/ar');if(!r.ok)throw Error();const rows=(await r.json()).data.matches||[];out.innerHTML=rows.length?rows.slice(0,12).map(x=>'<div class="feature-item"><p class="arabic"></p><small></small><button class="feature-btn" data-topic-s="'+x.surah.number+'" data-topic-a="'+x.numberInSurah+'">افتح الآية</button></div>').join(''):'<p class="muted">لم تظهر نتائج لهذا اللفظ.</p>';rows.slice(0,12).forEach((x,i)=>{out.children[i].querySelector('p').textContent=x.text;out.children[i].querySelector('small').textContent=x.surah.name+' · '+x.numberInSurah})}catch(e){out.textContent='تعذر البحث حالياً.'}
}
$('#topicChips')?.addEventListener('click',e=>{const b=e.target.closest('[data-topic]');if(b)topicSearch(b.dataset.topic)});
$('#topicResults')?.addEventListener('click',e=>{const b=e.target.closest('[data-topic-s]');if(!b)return;window.openSection('quran');window.loadSurah(Number(b.dataset.topicS)).then(()=>setTimeout(()=>$('#surahContent [data-ayah="'+b.dataset.topicA+'"]')?.scrollIntoView({behavior:'smooth',block:'center'}),250))});
/* Hifz quiz: masks one word from a verse currently loaded by the user. */
const quizTarget=$('#readerTools');
if(quizTarget)quizTarget.insertAdjacentHTML('beforeend','<div class="feature-card quiz-card"><h3>تدريب التسميع والحفظ</h3><p class="feature-note">اختر سورة وافتحها أولاً، ثم أخفِ كلمة وحاول تذكرها.</p><div class="feature-actions"><button id="startVerseQuiz" class="feature-btn primary">ابدأ اختبار الآية</button></div><div id="quizArea" hidden><div id="quizQuestion" class="quiz-question"></div><div class="quiz-options"><input id="quizAnswer" class="feature-input" placeholder="اكتب الكلمة المفقودة"><button id="checkQuizAnswer" class="feature-btn">تحقق</button><button id="showQuizAnswer" class="feature-btn">إظهار الإجابة</button></div><p id="quizFeedback" class="feature-note"></p></div></div>');
let quizWord='',quizText='';
function makeQuiz(){
 const verses=[...all('#surahContent .verse')];if(!verses.length)return toast('افتح سورة أولاً');
 const el=verses[Math.floor(Math.random()*verses.length)],text=(el.childNodes[0]?.textContent||'').trim(),words=text.split(/\s+/).filter(w=>w.length>2);
 if(words.length<3)return toast('هذه الآية قصيرة؛ جرّب آية أخرى');
 const index=Math.floor(Math.random()*words.length);quizWord=words[index];quizText=text;
 const masked=words.map((w,i)=>i===index?'ــــــ':w).join(' ');
 $('#quizQuestion').textContent=masked;$('#quizFeedback').textContent='سورة '+activeSurah+' · الآية '+el.dataset.ayah;$('#quizAnswer').value='';$('#quizArea').hidden=false;
}
$('#startVerseQuiz')?.addEventListener('click',makeQuiz);
$('#checkQuizAnswer')?.addEventListener('click',()=>{const a=$('#quizAnswer').value.trim().replace(/[،؛.!؟]/g,''),b=quizWord.replace(/[،؛.!؟]/g,'');$('#quizFeedback').textContent=a===b?'أحسنت! إجابة صحيحة.':'ليست مطابقة بعد؛ حاول مرة أخرى أو أظهر الإجابة.';if(a===b)addStat('verses',1)});
$('#showQuizAnswer')?.addEventListener('click',()=>{$('#quizFeedback').textContent='الكلمة هي: '+quizWord});
/* Zakat includes cash, savings and value of owned gold/silver. */
const zakatCard=$('#calculateZakat')?.closest('.feature-card');
if(zakatCard){
 const nisab=$('#zakatNisab');
 nisab.insertAdjacentHTML('afterend','<label>المدخرات الإضافية</label><input id="zakatSavings" class="feature-input" type="number" min="0" step=".01" placeholder="المدخرات"><label>وزن الذهب (غرام)</label><input id="zakatGoldG" class="feature-input" type="number" min="0" step=".01" placeholder="غرام الذهب"><label>سعر غرام الذهب بعملتك</label><input id="zakatGoldPrice" class="feature-input" type="number" min="0" step=".01" placeholder="السعر"><label>وزن الفضة (غرام)</label><input id="zakatSilverG" class="feature-input" type="number" min="0" step=".01" placeholder="غرام الفضة"><label>سعر غرام الفضة بعملتك</label><input id="zakatSilverPrice" class="feature-input" type="number" min="0" step=".01" placeholder="السعر">');
 const oldZakat=$('#calculateZakat');const fresh=oldZakat.cloneNode(true);oldZakat.replaceWith(fresh);
 fresh.addEventListener('click',()=>{
  const num=id=>Math.max(0,Number($('#'+id).value)||0),cash=num('zakatWealth')+num('zakatSavings'),gold=num('zakatGoldG')*num('zakatGoldPrice'),silver=num('zakatSilverG')*num('zakatSilverPrice'),total=cash+gold+silver,nis=num('zakatNisab'),year=$('#zakatYear').checked,out=$('#zakatResult');out.hidden=false;
  if(!(nis>0)){out.textContent='أدخل قيمة النصاب بعملتك من مصدر موثوق.';return}
  out.textContent=total<nis?'إجمالي المال المُدخل أقل من النصاب المختار.':!year?'بلغ الإجمالي النصاب المُدخل، لكن لم تحدد اكتمال الحول.':'إجمالي المال المُدخل: '+total.toLocaleString(undefined,{maximumFractionDigits:2})+' · الزكاة التقديرية 2.5%: '+(total*.025).toLocaleString(undefined,{maximumFractionDigits:2});
 });
}
/* Travel-distance helper; it deliberately avoids issuing an automatic legal ruling. */
const toolsGrid=$('#tools .feature-grid');
if(toolsGrid)toolsGrid.insertAdjacentHTML('beforeend',
 '<article class="feature-card"><h3>أحكام المسافر ومسافة الطريق</h3><p class="feature-note">أدخل إحداثيات الوجهة لحساب المسافة الجغرافية التقريبية من موقعك، لا مسافة الطريق.</p><div class="feature-row"><input id="travelLat" class="feature-input" type="number" step="any" placeholder="خط عرض الوجهة"><input id="travelLon" class="feature-input" type="number" step="any" placeholder="خط طول الوجهة"></div><button id="travelDistanceBtn" class="feature-btn primary">احسب المسافة</button><div id="travelDistanceResult" class="travel-result" hidden></div><p class="feature-note">لا يحكم التطبيق تلقائياً بجواز القصر أو الجمع؛ فالمسافة والإقامة والنية وتفاصيل المذهب تؤثر في الحكم.</p></article>'+
 '<article class="feature-card"><h3>المساجد القريبة</h3><p class="feature-note">ابحث في بيانات OpenStreetMap للمساجد القريبة من موقعك، وقد لا تكون كل المساجد مدرجة أو بياناتها محدثة.</p><button id="nearbyMosquesBtn" class="feature-btn primary">العثور على المساجد</button><div id="nearbyMosquesList" class="mosque-list"></div></article>'+
 '<article class="feature-card"><h3>العداد العالمي للصلاة على النبي ﷺ</h3><p class="feature-kpi">—</p><p>لا يوجد خادم مشترك مرتبط حالياً. نعرض هذا كميزة قيد التجهيز حتى تتوفر قاعدة بيانات تمنع تضخيم العدد أو تكرار الإرسال.</p></article>'+
 '<article class="feature-card"><h3>إشعارات Push والودجات</h3><p>التذكيرات المحلية الموجودة تعمل أثناء فتح التطبيق. الإشعارات بعد الإغلاق تحتاج خادم Push ومفاتيح VAPID واشتراكاً محفوظاً. ودجات الشاشة تتطلب تكاملاً أصلياً منفصلاً.</p><span class="feature-pill">تحتاج خادماً وتطبيقاً أصلياً</span></article>');
function haversine(a,b,c,d){const rad=x=>x*Math.PI/180,R=6371,dl=rad(c-a),dn=rad(d-b),v=Math.sin(dl/2)**2+Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(v))}
$('#travelDistanceBtn')?.addEventListener('click',()=>{
 const lat=Number($('#travelLat').value),lon=Number($('#travelLon').value),out=$('#travelDistanceResult');out.hidden=false;
 if(!prayerCoords){out.textContent='حدد موقعك أو اختر مدينة في صفحة الصلاة أولاً.';return}
 if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180){out.textContent='أدخل إحداثيات صحيحة للوجهة.';return}
 out.textContent='المسافة الجغرافية التقريبية: '+haversine(prayerCoords.lat,prayerCoords.lon,lat,lon).toFixed(1)+' كم. مسافة الطريق الفعلية قد تكون أطول.';
});
$('#nearbyMosquesBtn')?.addEventListener('click',async()=>{
 const out=$('#nearbyMosquesList');out.innerHTML='<p class="muted">جارٍ البحث ضمن نطاق 5 كم…</p>';
 let coords=window.userCoords||prayerCoords;
 if(!coords&&navigator.geolocation){try{const p=await new Promise((ok,no)=>navigator.geolocation.getCurrentPosition(ok,no,{enableHighAccuracy:true,timeout:12000}));coords={lat:p.coords.latitude,lon:p.coords.longitude}}catch(e){}}
 if(!coords){out.textContent='اسمح بالموقع أو اختر مدينة في صفحة الصلاة.';return}
 const q='[out:json][timeout:25];(node["amenity"="place_of_worship"]["religion"="muslim"](around:5000,'+coords.lat+','+coords.lon+');way["amenity"="place_of_worship"]["religion"="muslim"](around:5000,'+coords.lat+','+coords.lon+');node["building"="mosque"](around:5000,'+coords.lat+','+coords.lon+');way["building"="mosque"](around:5000,'+coords.lat+','+coords.lon+'););out center tags;';
 try{
  const r=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:'data='+encodeURIComponent(q)});
  if(!r.ok)throw Error('overpass');const rows=(await r.json()).elements||[];
  const list=rows.map(x=>{const lat=x.lat??x.center?.lat,lon=x.lon??x.center?.lon;if(!Number.isFinite(lat)||!Number.isFinite(lon))return null;const tags=x.tags||{},name=tags.name||tags['name:ar']||'مسجد بدون اسم مسجل';return {name,lat,lon,dist:haversine(coords.lat,coords.lon,lat,lon)}}).filter(Boolean).sort((a,b)=>a.dist-b.dist).slice(0,15);
  out.innerHTML=list.length?list.map(x=>'<div class="mosque-item"><b></b><br><small></small><br><a target="_blank" rel="noopener">فتح الاتجاهات</a></div>').join(''):'لم نعثر على مساجد مسجلة ضمن 5 كم. جرّب فتح الخريطة.';
  list.forEach((x,i)=>{const el=out.children[i];el.querySelector('b').textContent=x.name;el.querySelector('small').textContent=x.dist.toFixed(2)+' كم تقريباً';el.querySelector('a').href='https://www.google.com/maps/dir/?api=1&destination='+x.lat+','+x.lon});
 }catch(e){out.innerHTML='<p class="muted">تعذر الوصول إلى بيانات OpenStreetMap الآن. افتح <a target="_blank" rel="noopener" href="https://www.openstreetmap.org/">الخريطة</a> أو حاول لاحقاً.</p>'}
});
/* Hijri occasions are clearly marked as estimates pending local moon-sighting. */
const calCard=$('#calendar .card');
if(calCard)calCard.insertAdjacentHTML('beforeend','<div class="feature-card" style="margin-top:12px"><h3>المناسبات والأيام الفاضلة</h3><div id="hijriOccasions" class="feature-list"><p class="muted">جارٍ إعداد التذكيرات التقريبية…</p></div><p class="feature-note">التواريخ الهجرية قد تتقدم أو تتأخر بحسب رؤية الهلال وإعلان الجهة الرسمية في بلدك.</p></div>');
async function loadHijriOccasions(){
 const box=$('#hijriOccasions');if(!box)return;
 try{
  const r=await fetch('https://api.aladhan.com/v1/gToH');if(!r.ok)throw Error();const h=(await r.json()).data.hijri;
  const month=Number(h.month.number),day=Number(h.day),names={1:'المحرّم',2:'صفر',3:'ربيع الأول',4:'ربيع الآخر',5:'جمادى الأولى',6:'جمادى الآخرة',7:'رجب',8:'شعبان',9:'رمضان',10:'شوّال',11:'ذو القعدة',12:'ذو الحجة'};
  const events=[{m:1,d:1,t:'بداية العام الهجري'},{m:1,d:10,t:'يوم عاشوراء'},{m:3,d:12,t:'المولد النبوي – تاريخ متداول، وليس محل اتفاق'},{m:7,d:27,t:'ليلة الإسراء والمعراج – تاريخ مشهور مع اختلاف أهل العلم'},{m:9,d:1,t:'بداية رمضان'},{m:9,d:27,t:'ليلة 27 من رمضان – لا يُجزم بأنها ليلة القدر'},{m:10,d:1,t:'عيد الفطر'},{m:12,d:9,t:'يوم عرفة'},{m:12,d:10,t:'عيد الأضحى'}];
  const white=[13,14,15].map(d=>({m,d,t:'من الأيام البيض'}));
  const allEvents=[...events,...white],next=allEvents.filter(e=>e.m>month||(e.m===month&&e.d>=day)).sort((a,b)=>a.m-b.m||a.d-b.d).slice(0,6);
  box.innerHTML='<div class="feature-item"><b>اليوم الهجري</b><p>'+h.day+' '+(h.month.ar||names[month])+' '+h.year+' هـ</p></div>'+next.map(e=>'<div class="feature-item"><b></b><small></small></div>').join('');
  next.forEach((e,i)=>{box.children[i+1].querySelector('b').textContent=e.t;box.children[i+1].querySelector('small').textContent=e.d+' '+names[e.m]});
 }catch(e){box.textContent='تعذر تحميل التاريخ الهجري حالياً.'}
}
loadHijriOccasions();
/* Rain ambience is synthesized locally, user-controlled and silent by default. */
let rainContext=null,rainSource=null,rainGain=null,rainOn=false;
async function toggleRain(on){
 if(!on){if(rainGain)rainGain.gain.setTargetAtTime(0,rainContext.currentTime,.15);rainOn=false;saveLocal('rainSound',false);return}
 try{
  const C=window.AudioContext||window.webkitAudioContext;if(!C)throw Error();if(!rainContext)rainContext=new C();await rainContext.resume();
  if(!rainSource){const length=rainContext.sampleRate*3,buffer=rainContext.createBuffer(1,length,rainContext.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*.45;rainSource=rainContext.createBufferSource();rainSource.buffer=buffer;rainSource.loop=true;const low=rainContext.createBiquadFilter();low.type='lowpass';low.frequency.value=1100;const high=rainContext.createBiquadFilter();high.type='highpass';high.frequency.value=180;rainGain=rainContext.createGain();rainGain.gain.value=0;rainSource.connect(low);low.connect(high);high.connect(rainGain);rainGain.connect(rainContext.destination);rainSource.start()}
  rainGain.gain.setTargetAtTime(.035,rainContext.currentTime,.8);rainOn=true;saveLocal('rainSound',true);
 }catch(e){toast('تعذر تشغيل الصوت في هذا المتصفح');if($('#ambientToggle'))$('#ambientToggle').checked=false}
}
$('#ambientToggle')?.addEventListener('change',e=>toggleRain(e.target.checked));
if(quizTarget)quizTarget.insertAdjacentHTML('beforeend','<div class="feature-actions"><button id="rainReaderToggle" class="feature-btn ambient-toggle" aria-pressed="false">صوت مطر هادئ</button></div>');
$('#rainReaderToggle')?.addEventListener('click',()=>{toggleRain(!rainOn);$('#rainReaderToggle').setAttribute('aria-pressed',String(!rainOn));if($('#ambientToggle'))$('#ambientToggle').checked=!rainOn});
readLocal('rainSound',false).then(v=>{if(v){if($('#ambientToggle'))$('#ambientToggle').checked=true}});
/* Settings can request the ambient track only after a user gesture. */
/* Make the prayer edge effect and time theme respect reduced motion. */
refreshPrayer();refreshContinueCard();

})();