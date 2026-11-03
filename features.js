(function(){
'use strict';
const $=s=>document.querySelector(s), all=s=>document.querySelectorAll(s), api='https://api.alquran.cloud/v1';
const nav=$('.side-nav');
const items=[['prayer','الصلاة والأذان','◷'],['library','المكتبة الإسلامية','▤'],['favorites','المفضلة','♡'],['tools','أدوات المسلم','✧'],['seasons','المواسم الإسلامية','☾'],['stats','إنجازاتي','▥'],['games','ألعاب التدبر','◇'],['prohibitions','موسوعة المحرمات','⚖'],['hub','مركز المسلم','✦']];
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
<div class="feature-card"><h3>آيات اليوم</h3><div class="feature-kpi" id="statsVerses">0</div></div><div class="feature-card"><h3>التسبيح اليوم</h3><div class="feature-kpi" id="statsTasbih">0</div></div><div class="feature-card"><h3>الأذكار المكتملة اليوم</h3><div class="feature-kpi" id="statsAdhkar">0</div></div><div class="feature-card"><h3>أيام متتالية</h3><div class="feature-kpi" id="statsStreak">0</div></div></div><div class="feature-card" style="margin-top:12px"><h3>نشاط آخر 7 أيام</h3><div id="weekBars" class="week-bars"></div><h3 style="margin-top:20px">خريطة النشاط – 30 يوماً</h3><div id="activityHeatmap" class="heatmap"></div><p class="feature-note">البيانات محلية ولا تتم مزامنتها عبر الأجهزة.</p></div></section>
<section id="games" class="section feature-page"><button class="smallbtn back" data-open="home">← الرئيسية</button><div class="section-head"><div><h2>ألعاب الأجر والتدبر</h2><p class="muted">أنشطة للتعلم والمراجعة؛ لا يمكن الجزم بأن نقاط اللعبة تعني حسنات.</p></div></div><div class="feature-grid">
<article class="feature-card game-card"><h3>ترتيب كلمات الآية</h3><p class="feature-note">رتّب كلمات الآية القصيرة لتراجع حفظك.</p><div id="ayahPuzzle" class="game-options"></div><div class="feature-actions"><button id="checkAyahPuzzle" class="feature-btn primary">تحقق من الترتيب</button><button id="shuffleAyahPuzzle" class="feature-btn">إعادة الخلط</button></div><p id="ayahPuzzleResult" class="feature-note" aria-live="polite"></p><small class="muted">الإخلاص: ١</small></article>
<article class="feature-card game-card"><h3>معاني الكلمات القرآنية</h3><p id="vocabQuestion" class="arabic"></p><div id="vocabOptions" class="game-options"></div><p id="vocabResult" class="feature-note" aria-live="polite"></p><button id="nextVocab" class="feature-btn">سؤال آخر</button></article>
<article class="feature-card game-card"><h3>بطاقات السيرة النبوية</h3><p id="seerahQuestion"></p><div id="seerahOptions" class="game-options"></div><p id="seerahResult" class="feature-note" aria-live="polite"></p><button id="nextSeerah" class="feature-btn">بطاقة أخرى</button></article>
<article class="feature-card game-card"><h3>وصّل الاسم بمعناه</h3><p class="feature-note">اختر المعنى الصحيح للاسم.</p><p id="nameMatchQuestion" class="arabic"></p><div id="nameMatchOptions" class="game-options"></div><p id="nameMatchResult" class="feature-note" aria-live="polite"></p><button id="nextNameMatch" class="feature-btn">اسم آخر</button></article>
</div></section>
<section id="prohibitions" class="section feature-page"><button class="smallbtn back" data-open="home">← الرئيسية</button><div class="section-head"><div><h2>موسوعة المحرمات والمحظورات</h2><p class="muted">مدخل تعليمي مختصر بأدلة قرآنية واضحة، وليس بديلاً عن سؤال أهل العلم في النوازل.</p></div></div><div class="feature-card"><div class="prohibition-categories" id="prohibitionCategories"></div><div class="feature-list" id="prohibitionList"></div></div><div id="prohibitionDetail" class="prohibition-detail" hidden role="dialog" aria-modal="true" aria-labelledby="prohibitionTitle"><div class="prohibition-dialog"><button id="closeProhibition" class="feature-btn">إغلاق ✕</button><h3 id="prohibitionTitle"></h3><div id="prohibitionBody"></div></div></div></section>
<section id="hub" class="section feature-page"><button class="smallbtn back" data-open="home">← الرئيسية</button><div class="section-head"><div><h2>مركز المسلم</h2><p class="muted">أدوات عملية للقرآن والعبادة والتعلم والحياة اليومية.</p></div></div>
<div class="hub-grid">
<article class="feature-card"><h3>1. ختمة مع الأصدقاء</h3><p class="feature-note">أنشئ مجموعة وشارك رمزها، وسجّل الأجزاء التي أنجزتها على هذا الجهاز.</p><input id="khatmaGroupName" class="feature-input" placeholder="اسم الختمة"><button id="createKhatmaGroup" class="feature-btn primary">إنشاء ختمة</button><div id="khatmaGroupPanel"></div><p class="feature-note">ملاحظة: المشاركة حالياً بالرابط/الرمز فقط؛ لا توجد مزامنة مباشرة بين المشاركين دون خادم.</p></article>
<article class="feature-card"><h3>2. مصحف الحفظ الذكي</h3><p class="feature-note">اختبر حفظك في آيات قصيرة؛ أخفِ النص ثم حاول كتابته.</p><select id="memorizeVerse" class="feature-select"><option value="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ">الفاتحة: 1</option><option value="قُلْ هُوَ اللَّهُ أَحَدٌ">الإخلاص: 1</option><option value="اللَّهُ الصَّمَدُ">الإخلاص: 2</option><option value="لَمْ يَلِدْ وَلَمْ يُولَدْ">الإخلاص: 3</option></select><button id="hideMemVerse" class="feature-btn">إخفاء الآية</button><p id="memorizePrompt" class="arabic"></p><textarea id="memorizeAnswer" class="feature-input" rows="2" placeholder="اكتب الآية من حفظك"></textarea><button id="checkMemorize" class="feature-btn primary">تحقق</button><p id="memorizeResult" class="feature-note"></p></article>
<article class="feature-card"><h3>3. وضع المسجد</h3><p>وضع هادئ يقلل الإضاءة ويخفي الزخارف والتنبيهات داخل التطبيق.</p><button id="mosqueModeToggle" class="feature-btn primary">تفعيل وضع المسجد</button><p id="mosqueModeStatus" class="feature-note"></p></article>
<article class="feature-card"><h3>4. مخطط العبادات الأسبوعي</h3><p class="feature-note">ضع أهدافك وتابع إنجازها خلال الأسبوع.</p><div id="weeklyPlan"></div><p id="weeklyPlanProgress" class="feature-note"></p></article>
<article class="feature-card"><h3>5. مكتبة الأدعية</h3><input id="duaSearch" class="feature-input" placeholder="ابحث عن دعاء أو موقف"><div id="duaLibrary" class="feature-list"></div></article>
<article class="feature-card"><h3>6. تذكير قيام الليل</h3><label>وقت التذكير</label><input id="qiyamTime" class="feature-input" type="time" value="04:00"><button id="saveQiyam" class="feature-btn primary">حفظ التذكير</button><p id="qiyamStatus" class="feature-note">يلزم إبقاء التطبيق مفتوحاً ليستطيع المتصفح إطلاق التنبيه؛ لا يعمل كمنبه نظام مضمون بعد إغلاقه.</p></article>
<article class="feature-card"><h3>7. تعلّم التجويد</h3><div id="tajweedLessons" class="feature-list"></div><p class="feature-note">الأمثلة للتعلم النظري؛ إتقان الأداء يحتاج التلقي على قارئ متقن.</p></article>
<article class="feature-card"><h3>8. رحلة في التاريخ الإسلامي</h3><div id="historyTimeline" class="feature-list"></div></article>
<article class="feature-card"><h3>9. سجل الصدقات</h3><div class="feature-row"><input id="sadaqahAmount" class="feature-input" type="number" min="0" step="0.01" placeholder="المبلغ"><input id="sadaqahNote" class="feature-input" placeholder="ملاحظة"></div><button id="addSadaqah" class="feature-btn primary">تسجيل صدقة</button><div id="sadaqahList" class="feature-list"></div><p class="feature-note">السجل خاص بهذا الجهاز ولا يثبت قبول العمل أو مقدار الأجر.</p></article>
<article class="feature-card"><h3>10. دليل صلاة المسافر</h3><label>المسافة التقريبية بالكيلومتر</label><input id="travelDistance" class="feature-input" type="number" min="0" placeholder="مثال: 120"><button id="checkTravel" class="feature-btn primary">اعرض إرشادات السفر</button><p id="travelGuidance" class="feature-note">الأحكام تختلف باختلاف المذهب والنية ومدة الإقامة؛ هذه معلومات تمهيدية وليست فتوى.</p></article>
<article class="feature-card"><h3>11. صانع البطاقات الإسلامية</h3><select id="cardKind" class="feature-select"><option value="آية للتدبر">آية للتدبر</option><option value="دعاء">دعاء</option><option value="تذكير">تذكير</option></select><textarea id="cardText" class="feature-input" rows="3" placeholder="اكتب النص الذي تريد وضعه على البطاقة"></textarea><button id="makeShareCard" class="feature-btn primary">إنشاء البطاقة</button><div id="shareCardPreview" class="share-card-preview"></div><button id="downloadShareCard" class="feature-btn">حفظ الصورة</button></article>
<article class="feature-card"><h3>12. تحدي المعلومات الإسلامية</h3><p id="dailyQuizQuestion"></p><div id="dailyQuizOptions" class="game-options"></div><p id="dailyQuizResult" class="feature-note"></p><button id="nextDailyQuiz" class="feature-btn">السؤال التالي</button></article>
<article class="feature-card"><h3>13. دليل المساجد والسفر</h3><p>يمكنك فتح أداة المساجد القريبة الموجودة في التطبيق، أو الانتقال إلى القبلة ومواقيت الصلاة.</p><div class="feature-actions"><button class="feature-btn primary" data-open="prayer">مواقيت الصلاة</button><button class="feature-btn" data-open="qibla">اتجاه القبلة</button><button class="feature-btn" data-open="tools">المساجد القريبة</button></div><p class="feature-note">تعتمد نتائج القرب على إذن الموقع وتوفر بيانات الخرائط.</p></article>
<article class="feature-card"><h3>14. مكتبتي الشخصية</h3><input id="personalLibraryTitle" class="feature-input" placeholder="عنوان الملاحظة أو المرجع"><textarea id="personalLibraryText" class="feature-input" rows="3" placeholder="اكتب فائدة أو رابطاً أو ملاحظة"></textarea><button id="savePersonalLibrary" class="feature-btn primary">حفظ في مكتبتي</button><div id="personalLibraryList" class="feature-list"></div></article>
<article class="feature-card"><h3>15. وضع السكينة</h3><p>شاشة هادئة للذكر والتأمل دون قوائم مشتتة.</p><button id="serenityModeToggle" class="feature-btn primary">تشغيل وضع السكينة</button><p id="serenityVerse" class="arabic center">ألا بذكر الله تطمئن القلوب</p><p class="feature-note center">الرعد: 28</p></article>
</div></section>`;
$('.app').insertAdjacentHTML('beforeend',pages);
const extraNav=all('.side-link').length>10?[...all('.side-link')].slice(10):[];
extraNav.forEach(b=>b.addEventListener('click',()=>window.openSection(b.dataset.open)));
all('.feature-page [data-open]').forEach(b=>b.addEventListener('click',()=>window.openSection(b.dataset.open)));
const homeTiles=$('.tiles');
if(homeTiles)homeTiles.insertAdjacentHTML('beforeend','<button class="tile" data-go="prayer"><span class="ico">◷</span><span>الصلاة والأذان</span></button><button class="tile" data-go="library"><span class="ico">▤</span><span>المكتبة</span></button><button class="tile" data-go="favorites"><span class="ico">♡</span><span>المفضلة</span></button><button class="tile" data-go="tools"><span class="ico">✧</span><span>الأدوات</span></button>');
document.addEventListener('click',e=>{const go=e.target.closest('[data-go]');if(go){e.preventDefault();window.openSection(go.dataset.go)}},true);
const homePrayer=$('#prayerTimes')?.closest('.card');
if(homePrayer)homePrayer.insertAdjacentHTML('beforeend','<div class="countdown-box"><div><div class="muted" id="homeNextLabel">الصلاة القادمة</div><div class="countdown-time" id="prayerCountdownHome">--:--:--</div></div><button class="feature-btn" data-go="prayer">إعدادات الصلاة</button></div>');
/* Core navigation translations are handled through delegated clicks. */
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
let prayerCoords=null,timings=null,minutes=5,lastNotice='',adhanBlob=null,adhanUrl=null,prayerIsFallback=true;
async function loadPrayer(lat,lon){prayerIsFallback=false;prayerCoords={lat:Number(lat),lon:Number(lon)};const method=Number($('#prayerMethod')?.value||18);$('#prayerPageStatus').textContent='جارٍ حساب المواقيت…';try{const r=await fetch('https://api.aladhan.com/v1/timings?latitude='+lat+'&longitude='+lon+'&method='+method);if(!r.ok)throw Error();const j=await r.json();timings=j.data.timings;window.prayerTimesData=timings;const k=[['الفجر','Fajr'],['الظهر','Dhuhr'],['العصر','Asr'],['المغرب','Maghrib'],['العشاء','Isha']];$('#prayerTimes').innerHTML=k.map(a=>'<div class="prayer"><span>'+a[0]+'</span><b>'+timings[a[1]]+'</b></div>').join('');$('#locationLabel').textContent=j.data.meta.timezone||'الموقع المختار';$('#prayerStatus').textContent='المواقيت محسوبة بطريقة '+method+'. تحقق من التوقيت المحلي لمسجدك.';$('#prayerPageStatus').textContent='تم تحديث المواقيت · '+(j.data.date?.readable||'اليوم');$('#prayerMethodLabel').textContent='طريقة الحساب: '+method;refreshPrayer();return true}catch(e){$('#prayerPageStatus').textContent='تعذر تحميل المواقيت. تحقق من الاتصال.';return false}}
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
if(!window.userCoords){prayerIsFallback=true;loadPrayer(...cities.Tunis).then(()=>{prayerIsFallback=true})}
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
$('#saveBookmarkBtn')?.removeEventListener('click',savePreciseBookmark);
$('#saveBookmarkBtn')?.addEventListener('click',savePreciseBookmark);
refreshContinueCard();
/* Prayer interval progress and edge glow at the actual prayer time. */
function ensureProgress(el,id){
 if(!el||el.querySelector('.prayer-progress-track'))return;
 el.insertAdjacentHTML('beforeend','<div class="prayer-progress-track"><div id="'+id+'ProgressFill" class="prayer-progress-fill"></div></div><div class="prayer-progress-meta"><span id="'+id+'ProgressLabel">الوقت المنقضي</span><span id="'+id+'ProgressPercent">0%</span></div>');
}
const prayerCountdown=$('#prayerCountdown')?.closest('.countdown-box'),homeCountdown=$('#prayerCountdownHome')?.closest('.countdown-box');
ensureProgress(prayerCountdown,'prayerCountdown');ensureProgress(homeCountdown,'prayerCountdownHome');
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
 if(navigator.vibrate){if(c%100===0)navigator.vibrate([70,45,110]);else if(c%33===0)navigator.vibrate([35,25,55])}
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
 let coords=window.userCoords||null;
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

/* Universal tap-to-understand bottom sheet for Quran, hadith, adhkar and Names. */
if(!$('#knowledgeShade'))document.body.insertAdjacentHTML('beforeend',
'<div id="knowledgeShade" class="knowledge-shade" hidden></div><section id="knowledgeSheet" class="knowledge-sheet" role="dialog" aria-modal="true" aria-labelledby="knowledgeTitle" hidden><div class="sheet-grab"></div><header class="sheet-head"><div><span class="feature-pill">اضغط وافهم</span><h2 id="knowledgeTitle">شرح المحتوى</h2></div><button id="knowledgeClose" class="smallbtn" aria-label="إغلاق">✕</button></header><div id="knowledgeSource" class="feature-note"></div><nav id="knowledgeTabs" class="sheet-tabs"><button data-sheet-tab="meaning" class="active">المعنى والتفسير</button><button data-sheet-tab="words">معاني الكلمات</button><button data-sheet-tab="reason">سبب النزول / المصدر</button></nav><div id="knowledgeBody" class="sheet-body"></div><footer id="knowledgeActions" class="sheet-actions"></footer></section>');
let sheetContext=null;
const wordMeanings={
 'السكينة':'الطمأنينة والثبات الذي يلقيه الله في القلب.','الصمد':'السيد الكامل المقصود في الحوائج، الذي يُفتقر إليه ولا يفتقر إلى أحد.','القارعة':'اسم من أسماء يوم القيامة، تقرع القلوب بأهوالها.','الغاشية':'القيامة التي تغشى الناس بأهوالها.','الكوثر':'الخير الكثير، ومنه النهر الذي أعطاه الله لنبيه ﷺ.','أبّاً':'الكلأ والمرعى، على أحد أشهر أقوال المفسرين.','قسورة':'الأسد أو الرماة، وقد ذكر المفسرون أكثر من قول.','سِجّين':'كتاب جامع لأعمال الفجار أو موضع سجلهم، كما فسره أهل التفسير.','عِلِّيِّين':'كتاب الأبرار أو موضع رفيع، على ما جاء في التفسير.','الصمد':'الذي تصمد إليه الخلائق في حاجاتها.','فاطر':'خالق ومبدع على غير مثال سابق.','يؤفكون':'يُصرفون عن الحق أو يُكذبون، بحسب السياق.','الفتنة':'تأتي بمعانٍ متعددة بحسب السياق، منها الابتلاء والاختبار.','الروح':'لفظ تتعدد دلالاته في القرآن، ويحدد السياق المقصود.','الهدى':'الدلالة إلى الحق والطريق المستقيم.','الرحمة':'الإحسان والرأفة واللطف، وتفصيل معناها بحسب السياق.','الغفور':'كثير المغفرة لعباده التائبين.','الرزاق':'الذي يرزق الخلق ويتولى أقواتهم.','اللطيف':'الرفيق بعباده، العالم بدقائق الأمور، ويأتي بمعانٍ يوضحها السياق.'
};
function sheetOpen(data){
 sheetContext=data;$('#knowledgeTitle').textContent=data.title||'شرح المحتوى';$('#knowledgeSource').textContent=data.source||'';
 $('#knowledgeSheet').hidden=false;$('#knowledgeShade').hidden=false;document.body.classList.add('sheet-open');
 $('#knowledgeTabs [data-sheet-tab="words"]').hidden=false;$('#knowledgeTabs [data-sheet-tab="reason"]').hidden=false;$('#knowledgeTabs [data-sheet-tab="reason"]').textContent='سبب النزول / المصدر';
 all('#knowledgeTabs button').forEach(b=>b.classList.toggle('active',b.dataset.sheetTab==='meaning'));
 renderSheetTab('meaning');if(navigator.vibrate)navigator.vibrate(16);
}
function sheetClose(){$('#knowledgeSheet').hidden=true;$('#knowledgeShade').hidden=true;document.body.classList.remove('sheet-open');sheetContext=null}
$('#knowledgeClose')?.addEventListener('click',sheetClose);$('#knowledgeShade')?.addEventListener('click',sheetClose);
$('#knowledgeTabs')?.addEventListener('click',e=>{const b=e.target.closest('[data-sheet-tab]');if(!b)return;all('#knowledgeTabs button').forEach(x=>x.classList.toggle('active',x===b));renderSheetTab(b.dataset.sheetTab)});
function renderSheetTab(tab){
 const box=$('#knowledgeBody'),d=sheetContext;if(!d)return;
 if(tab==='meaning'){
  box.innerHTML='<div class="sheet-section"><h3>المعنى والتفسير</h3><p id="sheetMeaning" class="sheet-prose"></p></div>';
  $('#sheetMeaning').textContent=d.meaning||'لا يتوفر شرح موثق لهذا المحتوى بعد.';
  if(d.kind==='verse'&&d.surah&&d.ayah){
   const p=document.createElement('p');p.className='feature-note';p.textContent='جارٍ تحميل التفسير الميسر…';box.appendChild(p);
   fetch(api+'/ayah/'+d.surah+':'+d.ayah+'/ar.muyassar').then(r=>{if(!r.ok)throw Error();return r.json()}).then(j=>{p.textContent='التفسير الميسر: '+j.data.text}).catch(()=>{p.textContent='تعذر تحميل التفسير من الخدمة حالياً.'});
  }
 }else if(tab==='words'){
  box.innerHTML='<h3>معاني الكلمات</h3><p class="feature-note">اضغط على كلمة لعرض معناها المختصر. قد تتغير الدلالة بحسب سياق الآية.</p><div id="sheetWordChips" class="topic-chips"></div><div id="sheetWordMeaning" class="tafsir-box">اختر كلمة من النص.</div>';
  const words=(d.text||'').replace(/[﴿﴾۞]/g,'').split(/\s+/).filter(Boolean);
  const chosen=[...new Set(words)].slice(0,45);
  $('#sheetWordChips').innerHTML=chosen.map((w,i)=>'<button data-word-index="'+i+'"></button>').join('');
  chosen.forEach((w,i)=>$('#sheetWordChips').children[i].textContent=w);
  $('#sheetWordChips').onclick=e=>{const b=e.target.closest('[data-word-index]');if(!b)return;const w=chosen[Number(b.dataset.wordIndex)];$('#sheetWordMeaning').textContent=wordMeanings[w.replace(/[،؛.!؟]/g,'')]||'لا تتوفر مفردة موثقة لهذه الكلمة في المعجم المختصر الحالي. راجع تفسيراً معتمداً لفهمها في سياق الآية.'};
 }else{
  box.innerHTML='<h3>سبب النزول والمصدر</h3><p class="sheet-prose"></p><p class="feature-note"></p>';
  if(d.kind==='verse'){
   box.querySelector('.sheet-prose').textContent='لا يثبت سبب نزول خاص لكل آية. لا تتوفر في مصدر التفسير الحالي بيانات أسباب النزول لهذه الآية، ولذلك لن ننسب إليها سبباً غير موثق.';
   box.querySelector('.feature-note').textContent='للتوسع في أسباب النزول، يُرجع إلى كتب معتمدة مثل «لباب النقول في أسباب النزول» للسيوطي، مع مراجعة صحة الرواية.';
  }else{
   box.querySelector('.sheet-prose').textContent=d.source||'لم يُسجل مصدر تفصيلي لهذا العنصر.';
   box.querySelector('.feature-note').textContent=d.note||'المعنى المختصر للتقريب وليس بديلاً عن الرجوع إلى المرجع الأصلي.';
  }
 }
}
$('#knowledgeActions')?.addEventListener('click',async e=>{
 const b=e.target.closest('[data-sheet-action]');if(!b||!sheetContext)return;
 const d=sheetContext,action=b.dataset.sheetAction;
 if(action==='copy'||action==='share'){
  const text=(d.text||'')+(d.source?'\n'+d.source:'')+'\n— i-Muslim';
  try{if(action==='share'&&navigator.share)await navigator.share({title:d.title||'i-Muslim',text});else{await navigator.clipboard.writeText(text);toast('تم النسخ للمشاركة')}}catch(e){}
 }
 if(action==='read'&&d.kind==='verse'){
  const key=d.surah+':'+d.ayah;if(!dailyReadVerses.includes(key))dailyReadVerses.push(key);
  dailyReadCount=dailyReadVerses.length;await saveLocal('dailyReadDate',todayKey);await saveLocal('dailyReadVerses',dailyReadVerses);updateDailyProgress();toast('تم تسجيل الآية ضمن ورد اليوم');
 }
 if(action==='favorite'&&d.kind==='verse'){
  const fav=await readLocal('favoriteVerses',[]);if(!fav.some(x=>x.surah===d.surah&&Number(x.ayah)===Number(d.ayah))){fav.push({text:d.text,surah:d.surah,ayah:d.ayah});await saveLocal('favoriteVerses',fav)}toast('حُفظت الآية في المفضلة');renderFavorites();
 }
});
/* A tap on verse text opens the sheet instead of navigating or silently marking it read. */
document.addEventListener('click',e=>{
 const el=e.target.closest('.verse');if(!el||e.target.closest('button'))return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 const text=(el.childNodes[0]?.textContent||'').trim(),surah=activeSurah,ayah=Number(el.dataset.ayah);
 sheetOpen({kind:'verse',title:'سورة '+(window.surahs?.[surah-1]?.name||surah)+' · الآية '+ayah,source:'القرآن الكريم · '+surah+':'+ayah,text,surah,ayah});
 $('#knowledgeActions').innerHTML='<button class="feature-btn" data-sheet-action="read">سجّلها مقروءة</button><button class="feature-btn" data-sheet-action="favorite">حفظ</button><button class="feature-btn" data-sheet-action="copy">نسخ</button><button class="feature-btn primary" data-sheet-action="share">مشاركة</button>';
},true);
/* Content explanation is also available for hadith, adhkar and divine names. */
const hadithMeanings=[
'تُظهر النية قيمة العمل ومقصده؛ ويُرجع في تفاصيل الحديث إلى شروحه المعتمدة.',
'النصيحة تشمل إخلاص القصد وإرادة الخير، وتفاصيل الحديث مبسوطة في شروح صحيح مسلم.',
'يدعو الحديث إلى محبة الخير للآخرين كما يحبه المرء لنفسه.',
'يرشد الحديث إلى حفظ اللسان، وقول الخير أو الصمت.',
'الكلمة الطيبة من أبواب الإحسان والصدقة.',
'في الحديث توجيه إلى الرفق والتيسير في الدعوة والمعاملة.'
];
$('#hadithList')?.addEventListener('click',e=>{
 const el=e.target.closest('.feature-item');if(!el||e.target.closest('button'))return;
 const text=el.querySelector('p')?.textContent?.replace(/^«|»$/g,'')||'',source=el.querySelector('small')?.textContent||'',h=hadiths.find(x=>x[0]===text);if(!h)return;
 sheetOpen({kind:'hadith',title:'شرح الحديث',source:source+' · '+h[2],text:h[0],meaning:hadithMeanings[hadiths.indexOf(h)]||'اقرأ الحديث مع مصدره وارجع إلى شروحه المعتمدة.',note:'المصدر والترقيم كما هو معروض في البطاقة، وقد تختلف أرقام الأحاديث بين الطبعات.'});
 $('#knowledgeActions').innerHTML='<button class="feature-btn" data-sheet-action="copy">نسخ الحديث</button><button class="feature-btn primary" data-sheet-action="share">مشاركة</button>';
});
$('#adhkarList')?.addEventListener('click',e=>{
 const el=e.target.closest('.feature-item');if(!el||e.target.closest('button'))return;
 const text=el.querySelector('.arabic')?.textContent||'',count=el.querySelector('small')?.textContent||'';
 sheetOpen({kind:'dhikr',title:'فهم الذكر',source:count,text,meaning:'هذا الذكر يشتمل على ذكر الله ودعائه في هذا الوقت. تختلف الفضائل الخاصة باختلاف النصوص والروايات، ولا ننسب أجراً محدداً هنا من دون توثيق مستقل.',note:'يمكن الرجوع إلى تخريج الذكر ومصدره قبل اعتماد فضيلة مخصوصة.'});
 $('#knowledgeActions').innerHTML='<button class="feature-btn" data-sheet-action="copy">نسخ الذكر</button><button class="feature-btn primary" data-sheet-action="share">مشاركة</button>';
});
/* A curated set of Quranic divine names with concise language-based meanings. */
const divineNames=[
['الله','المعبود بحق، الجامع لصفات الكمال.','إفراد الله بالعبادة والتوكل.'],['الرحمن','واسع الرحمة لجميع الخلق.','الرجاء في رحمة الله والرفق بالناس.'],['الرحيم','المتفضل بالرحمة بعباده.','طلب الرحمة والإحسان إلى الخلق.'],['الملك','المالك المتصرف في خلقه.','التواضع وعدم التعلق بالملك الزائل.'],['القدوس','المنزه عن كل نقص.','تنزيه الله وتعظيمه.'],['السلام','السالم من كل عيب ونقص.','سؤال الله السلامة ونشر السلام.'],['المؤمن','الذي يؤمّن عباده ويصدق رسله.','الثقة بوعد الله.'],['المهيمن','الرقيب الحافظ الشهيد على خلقه.','استشعار مراقبة الله.'],['العزيز','الغالب الذي لا يُغلب.','طلب العزة بطاعة الله.'],['الجبار','العالي القاهر، وجابر كسر عباده.','الافتقار إلى جبر الله ورحمته.'],['المتكبر','المتفرد بالعظمة والكبرياء.','ترك الكبر على الناس.'],['الخالق','الذي أوجد الخلق وقدرهم.','التفكر في خلق الله.'],['البارئ','الذي خلق الخلق بريئاً من التفاوت.','التأمل في بديع صنعه.'],['المصور','الذي أعطى كل مخلوق صورته.','شكر الله على نعمه.'],['الغفار','كثير المغفرة.','الإكثار من التوبة والاستغفار.'],['القهار','الذي قهر كل شيء بقدرته.','عدم الاغترار بالقوة.'],['الوهاب','كثير العطاء بلا عوض.','سؤال الله من فضله.'],['الرزاق','الذي يرزق الخلق.','الأخذ بالأسباب مع التوكل.'],['الفتاح','الذي يفتح أبواب الرحمة والحكم والرزق.','سؤال الله الفرج والهداية.'],['العليم','المحيط بكل شيء علماً.','مراقبة الله في السر والعلن.'],['السميع','الذي يسمع كل الأصوات.','الإكثار من الدعاء.'],['البصير','الذي يرى كل شيء.','الإحسان في العمل.'],['اللطيف','الرفيق بعباده، العالم بدقائق الأمور.','حسن الظن بلطف الله.'],['الخبير','العالم ببواطن الأمور.','إصلاح السريرة.'],['الحليم','الذي لا يعاجل بالعقوبة.','الحلم والأناة.'],['العظيم','الذي له العظمة والكمال.','تعظيم الله في القلب.'],['الغفور','واسع المغفرة.','عدم اليأس من التوبة.'],['الشكور','الذي يثيب على العمل القليل الثواب الكثير.','شكر النعم والمداومة على الخير.'],['العلي','المتعالي فوق خلقه.','رفع الهمة بالطاعة.'],['الكبير','العظيم الذي كل شيء دونه.','التواضع لله.'],['الحفيظ','الحافظ لكل شيء.','الاستيداع والدعاء بالحفظ.'],['الكريم','كثير الخير والعطاء.','الكرم مع الخلق.'],['الرقيب','المطلع الذي لا يغيب عنه شيء.','مراقبة الأقوال والأعمال.'],['المجيب','الذي يجيب دعاء من دعاه بحكمته.','الإلحاح في الدعاء مع حسن الظن.'],['الواسع','الذي وسعت رحمته وعلمه كل شيء.','عدم القنوط من فضل الله.'],['الحكيم','الذي يضع الأمور مواضعها.','التسليم لحكمة الله.'],['الودود','المحب لعباده المؤمنين والمحبوب لهم.','محبة الله واتباع ما يرضيه.'],['المجيد','العظيم الواسع الكرم والشرف.','تعظيم الله والثناء عليه.'],['الوكيل','الكفيل بأمور عباده.','التوكل مع فعل الأسباب.'],['القوي','كامل القوة.','طلب العون من الله.'],['المتين','شديد القوة الذي لا يلحقه ضعف.','الثبات والاستعانة بالله.'],['الولي','الناصر والمتولي لأمور عباده.','موالاة أهل الإيمان والاعتماد على الله.'],['الحميد','المستحق للحمد كله.','حمد الله في السراء والضراء.'],['الحي','كامل الحياة التي لا يلحقها زوال.','دعاء الحي القيوم.'],['القيوم','القائم بنفسه المقيم لغيره.','التوكل على الله القائم على كل نفس.'],['الواحد','المتفرد الذي لا شريك له.','إخلاص العبادة له.'],['الصمد','السيد الذي تصمد إليه الخلائق في حوائجها.','سؤال الله وحده.'],['القادر','الذي لا يعجزه شيء.','الثقة بقدرة الله.'],['الأول والآخر','الأول الذي ليس قبله شيء والآخر الذي ليس بعده شيء.','تعلق القلب بالله الباقي.'],['النور','الذي بنوره يهتدي أهل السماوات والأرض.','طلب نور الهداية.']
];
const namesBox=$('#namesList');
if(namesBox){
 namesBox.innerHTML='<p class="feature-note">أسماء مختارة وردت في القرآن والسنة، مع معانٍ تقريبية وأثر إيماني للتدبر. في تعيين القائمة المشهورة للأسماء الحسنى وجمعها خلاف بين أهل العلم؛ فلا تُعرض هذه المجموعة باعتبارها حصراً نهائياً.</p><input id="divineSearch" class="feature-input" placeholder="ابحث عن اسم أو معنى..."><div id="divineNamesGrid" class="feature-grid"></div>';
 function renderDivineNames(){const q=$('#divineSearch').value.trim();const rows=divineNames.filter(n=>n.join(' ').includes(q));$('#divineNamesGrid').innerHTML=rows.map((n,i)=>'<button class="feature-card divine-name" data-divine="'+i+'"><span class="feature-kpi"></span><small>اضغط لفهم الاسم</small></button>').join('');rows.forEach((n,i)=>$('#divineNamesGrid').children[i].querySelector('.feature-kpi').textContent=n[0]);}
 $('#divineSearch').addEventListener('input',renderDivineNames);renderDivineNames();window.imuslimDivineNames=divineNames;window.imuslimRenderDivineNames=renderDivineNames;
 $('#divineNamesGrid').addEventListener('click',e=>{const b=e.target.closest('[data-divine]');if(!b)return;const n=divineNames.find(x=>x[0]===b.querySelector('.feature-kpi').textContent);if(!n)return;sheetOpen({kind:'name',title:n[0],source:'معنى تقريبي للتدبر',text:n[0],meaning:n[1],note:'أثر إيماني مقترح: '+n[2]});$('#knowledgeTabs [data-sheet-tab="words"]').hidden=true;$('#knowledgeTabs [data-sheet-tab="reason"]').textContent='الأثر الإيماني';$('#knowledgeActions').innerHTML='<button class="feature-btn" data-sheet-action="copy">نسخ</button>'});
}
/* Seasonal engine: Friday, Ramadan and the two Eid days use local Hijri date. */
const festiveHost=$('#home .hero');
if(festiveHost)festiveHost.insertAdjacentHTML('afterend','<section id="festiveBanner" class="feature-card festive-banner" hidden><div class="feature-row"><div><span class="feature-pill" id="festiveTag">مناسبة</span><h3 id="festiveTitle"></h3><p id="festiveMessage" class="muted"></p></div><button id="festiveShare" class="feature-btn">مشاركة</button></div><div class="feature-actions" id="festiveActions"></div></section>');
let festiveInfo=null;
async function seasonalDecor(){
 const friday=new Date().getDay()===5;let hijri=null;
 try{const r=await fetch('https://api.aladhan.com/v1/gToH');if(r.ok)hijri=(await r.json()).data.hijri}catch(e){}
 const month=Number(hijri?.month?.number||0),day=Number(hijri?.day||0);
 let info=null;
 if(month===9&&day>=21){info={tag:'العشر الأواخر',title:'العشر الأواخر من رمضان',message:'اجتهد في القيام والقرآن والدعاء، ولا تجزم بليلة القدر في ليلة بعينها.',actions:[['ورد القرآن','quran'],['دعاء العفو','adhkar']]};}
 else if(month===9){info={tag:'رمضان كريم',title:'رمضان المبارك',message:'اجعل يومك عامراً بالقرآن والذكر والصدقة وصلة الرحم.',actions:[['ورد القرآن','quran'],['أذكار اليوم','adhkar']]};}
 else if(month===10&&day===1){info={tag:'عيد مبارك',title:'عيد الفطر المبارك',message:'تقبل الله منا ومنكم صالح الأعمال.',actions:[['بطاقة تهنئة','greeting'],['التكبيرات','takbeer']]};}
 else if(month===12&&day===10){info={tag:'عيد مبارك',title:'عيد الأضحى المبارك',message:'كل عام وأنتم بخير، تقبل الله الطاعات.',actions:[['بطاقة تهنئة','greeting'],['التكبيرات','takbeer']]};}
 else if(month===12&&day===9){info={tag:'يوم عرفة',title:'يوم عرفة',message:'أكثر من الدعاء والذكر، وتحقق من إعلان بلدك بشأن اليوم.',actions:[['الأذكار','adhkar']]};}
 else if(month===9&&day>=21){info={tag:'العشر الأواخر',title:'العشر الأواخر من رمضان',message:'اجتهد في القيام والقرآن والدعاء، ولا تجزم بليلة القدر في ليلة بعينها.',actions:[['آية اليوم','quran']]};}
 else if(friday){info={tag:'جمعة مباركة',title:'فضائل يوم الجمعة',message:'تذكّر قراءة سورة الكهف، والإكثار من الصلاة على النبي ﷺ، وتحري ساعة الإجابة.',actions:[['سورة الكهف','kahf'],['الصلاة على النبي ﷺ','salawat']]};}
 if(!info)return;
 festiveInfo=info;const banner=$('#festiveBanner');banner.hidden=false;$('#festiveTag').textContent=info.tag;$('#festiveTitle').textContent=info.title;$('#festiveMessage').textContent=info.message;
 document.body.dataset.festival=month===9?'ramadan':(info.title.includes('عيد')?'eid':friday?'friday':'special');
 $('#festiveActions').innerHTML=info.actions.map((a,i)=>'<button class="feature-btn" data-festive-action="'+i+'">'+a[0]+'</button>').join('');
 $('#festiveActions').onclick=e=>{const b=e.target.closest('[data-festive-action]');if(!b)return;const act=info.actions[Number(b.dataset.festiveAction)][1];if(act==='kahf'){window.openSection('quran');window.loadSurah(18)}else if(act==='salawat'){window.openSection('tasbih');$('#tasbihPreset').value='اللهم صل وسلم على نبينا محمد';$('#tasbihPreset').dispatchEvent(new Event('change'))}else if(act==='greeting'){window.openSection('seasons');$('#greetingName')?.focus()}else if(act==='takbeer'){window.openSection('seasons');$('#takbeerPlayer')?.play().catch(()=>{})}else window.openSection(act)};
 $('#festiveShare').onclick=async()=>{const text=info.title+'\n'+info.message+'\n— i-Muslim';try{if(navigator.share)await navigator.share({title:info.title,text});else{await navigator.clipboard.writeText(text);toast('تم نسخ التهنئة')}}catch(e){}};
 if(friday){applyAccent('emerald');const btn=$('#home [data-open="quran"]');if(btn)btn.classList.add('active-card')}
}
seasonalDecor();
/* Eid greeting cards generated locally as a shareable image. */
const seasonGrid=$('#seasons .feature-grid');
if(seasonGrid)seasonGrid.insertAdjacentHTML('beforeend','<article class="feature-card"><h3>بطاقة تهنئة قابلة للمشاركة</h3><input id="greetingName" class="feature-input" maxlength="28" placeholder="اكتب اسمك أو اسم العائلة"><select id="greetingKind" class="feature-select"><option value="عيد مبارك">عيد مبارك</option><option value="رمضان كريم">رمضان كريم</option><option value="جمعة مباركة">جمعة مباركة</option></select><button id="makeGreetingCard" class="feature-btn primary">إنشاء البطاقة</button><canvas id="greetingCanvas" width="1200" height="675" style="width:100%;display:none;border-radius:14px;margin-top:12px"></canvas><button id="shareGreetingCard" class="feature-btn" disabled>مشاركة الصورة</button></article><article class="feature-card"><h3>تكبيرات العيد</h3><p class="arabic">الله أكبر الله أكبر، لا إله إلا الله، الله أكبر الله أكبر، ولله الحمد.</p><input id="takbeerFile" class="feature-input" type="file" accept="audio/*"><audio id="takbeerPlayer" controls class="reader-audio"></audio><p class="feature-note">أضف تسجيلاً تملك حق استخدامه ليعمل مشغل التكبيرات؛ لا نحمّل ملفاً صوتياً مجهول المصدر.</p></article>');
let greetingBlob=null,takbeerUrl=null;
$('#makeGreetingCard')?.addEventListener('click',()=>{
 const c=$('#greetingCanvas'),x=c.getContext('2d'),name=$('#greetingName').value.trim(),kind=$('#greetingKind').value;
 x.fillStyle='#0d2921';x.fillRect(0,0,c.width,c.height);
 const grad=x.createLinearGradient(0,0,c.width,c.height);grad.addColorStop(0,'#214b38');grad.addColorStop(1,'#101d19');x.fillStyle=grad;x.fillRect(18,18,c.width-36,c.height-36);
 x.strokeStyle='#d8b56d';x.lineWidth=4;x.strokeRect(42,42,c.width-84,c.height-84);
 x.textAlign='center';x.fillStyle='#dfc17d';x.font='bold 92px Tahoma';x.fillText('۞',600,175);
 x.fillStyle='#fff4d8';x.font='bold 76px Tahoma';x.fillText(kind,600,320);
 x.fillStyle='#d8c9a6';x.font='40px Tahoma';x.fillText(name?('من '+name):'تقبل الله طاعتكم',600,410);
 x.fillStyle='#e1c47e';x.font='30px Tahoma';x.fillText('i-Muslim',600,520);
 c.style.display='block';c.toBlob(b=>{greetingBlob=b;$('#shareGreetingCard').disabled=!b});
});
$('#shareGreetingCard')?.addEventListener('click',async()=>{if(!greetingBlob)return;const file=new File([greetingBlob],'i-muslim-greeting.png',{type:'image/png'});try{if(navigator.canShare?.({files:[file]}))await navigator.share({files:[file],title:'تهنئة i-Muslim'});else{const url=URL.createObjectURL(greetingBlob),a=document.createElement('a');a.href=url;a.download='i-muslim-greeting.png';a.click();URL.revokeObjectURL(url)}}catch(e){}});
$('#takbeerFile')?.addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;if(takbeerUrl)URL.revokeObjectURL(takbeerUrl);takbeerUrl=URL.createObjectURL(f);$('#takbeerPlayer').src=takbeerUrl;});
/* Haptics, optional soft click sound and tactile ripple. */
settingsExtras?.insertAdjacentHTML('beforeend','<div class="listitem"><label><input id="hapticsToggle" type="checkbox" checked> اهتزازات خفيفة عند اللمس</label></div><div class="listitem"><label><input id="clickSoundToggle" type="checkbox"> صوت نقرة خفيف</label></div>');
let hapticsOn=true,clickSoundOn=false;
readLocal('hapticsOn',true).then(v=>{hapticsOn=!!v;if($('#hapticsToggle'))$('#hapticsToggle').checked=hapticsOn});
readLocal('clickSoundOn',false).then(v=>{clickSoundOn=!!v;if($('#clickSoundToggle'))$('#clickSoundToggle').checked=clickSoundOn});
$('#hapticsToggle')?.addEventListener('change',e=>{hapticsOn=e.target.checked;saveLocal('hapticsOn',hapticsOn)});
$('#clickSoundToggle')?.addEventListener('change',e=>{clickSoundOn=e.target.checked;saveLocal('clickSoundOn',clickSoundOn)});
let clickCtx=null,lastRipple=0;
document.addEventListener('pointerdown',e=>{
 const target=e.target.closest('button,.tile,.feature-card,.feature-item');if(!target||target.closest('.knowledge-sheet'))return;
 const now=Date.now();if(now-lastRipple>30){lastRipple=now;target.classList.add('ripple-touch');setTimeout(()=>target.classList.remove('ripple-touch'),480)}
 if(hapticsOn&&navigator.vibrate&&target.matches('button,.tile'))navigator.vibrate(10);
 if(clickSoundOn){try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;if(!clickCtx)clickCtx=new C();const o=clickCtx.createOscillator(),g=clickCtx.createGain();o.type='sine';o.frequency.value=740;g.gain.setValueAtTime(.0001,clickCtx.currentTime);g.gain.exponentialRampToValueAtTime(.018,clickCtx.currentTime+.008);g.gain.exponentialRampToValueAtTime(.0001,clickCtx.currentTime+.055);o.connect(g);g.connect(clickCtx.destination);o.start();o.stop(clickCtx.currentTime+.06)}catch(e){}}
},{passive:true});
/* 3D beads visualize the tasbih count and move with each count. */
if(tasCard)tasCard.insertAdjacentHTML('beforeend','<div class="bead-rope" id="beadRope" aria-label="مسبحة من 33 حبة">'+Array.from({length:33},(_,i)=>'<span class="bead" data-bead="'+i+'"></span>').join('')+'</div><div class="feature-note center" id="beadProgress">حبات المسبحة: 0 / 33</div>');
function updateBeads(){const c=Number($('#count')?.textContent)||0;all('.bead').forEach((b,i)=>b.classList.toggle('lit',i<c%33));const p=$('#beadProgress');if(p)p.textContent='حبات المسبحة: '+(c%33|| (c?33:0))+' / 33 · الإجمالي '+c;const rope=$('#beadRope');if(rope)rope.style.transform='rotateY('+(c%360)+'deg) rotateX('+(Math.sin(c/5)*3)+'deg)'}
const watchCount=new MutationObserver(updateBeads);if($('#count'))watchCount.observe($('#count'),{childList:true,characterData:true,subtree:true});updateBeads();
/* Hifz vocal practice: browser speech recognition is approximate, not Tajweed grading. */
if(quizTarget)quizTarget.insertAdjacentHTML('beforeend','<div class="feature-card"><h3>التسميع بالصوت – تجريبي</h3><p class="feature-note">اقرأ الآية بصوتك. مطابقة الكلمات تعتمد على التعرف الصوتي في المتصفح وقد تخطئ؛ لا تقيس التجويد أو مخارج الحروف ولا تعتمد عليها لتصحيح التلاوة.</p><div class="feature-actions"><button id="startRecitation" class="feature-btn primary">ابدأ التسميع</button><button id="stopRecitation" class="feature-btn">إيقاف</button></div><div id="recitationTranscript" class="feature-item">افتح سورة وحدد آية، ثم ابدأ التسميع.</div><div class="voice-meter"><div id="voiceMeterFill"></div></div><p id="recitationStatus" class="feature-note"></p></div>');
let recognition=null,micStream=null,micContext=null,micAnalyser=null,micFrame=null,recitationWords=[];
function normalizeArabic(t){return t.normalize('NFD').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/[^\u0621-\u064A\s]/g,'').trim().split(/\s+/).filter(Boolean)}
$('#startRecitation')?.addEventListener('click',()=>{
 const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;if(!Speech)return toast('التعرف على الصوت غير مدعوم في متصفحك');
 const verse=[...all('#surahContent .verse')].find(x=>{const r=x.getBoundingClientRect();return r.top<innerHeight*.7&&r.bottom>100});
 if(!verse)return toast('افتح سورة وأبقِ الآية المراد تسميعها ظاهرة');
 const text=(verse.childNodes[0]?.textContent||'').trim();recitationWords=normalizeArabic(text);
 const rec=new Speech();recognition=rec;rec.lang='ar-SA';rec.continuous=true;rec.interimResults=true;rec.maxAlternatives=1;
 rec.onresult=e=>{
  let spoken='';for(let i=0;i<e.results.length;i++)spoken+=e.results[i][0].transcript+' ';
  const tokens=normalizeArabic(spoken),container=$('#recitationTranscript');container.innerHTML='';
  let cursor=0;recitationWords.forEach(w=>{const span=document.createElement('span');span.textContent=w+' ';const at=tokens.indexOf(w,cursor);if(at>=0){span.className='voice-correct';cursor=at+1}else if(cursor<tokens.length){span.className='voice-wrong';cursor++}else span.className='voice-pending';container.appendChild(span)});
  const hits=recitationWords.filter(w=>matched.has(w)).length;$('#recitationStatus').textContent='مطابقة تقريبية للكلمات: '+hits+' / '+recitationWords.length+'. راجع النص بنفسك، فالتعرف الصوتي قد يخطئ.';
 };
 rec.onerror=()=>$('#recitationStatus').textContent='تعذر التعرف على الصوت؛ تحقق من إذن الميكروفون والاتصال.';
 rec.onend=()=>$('#recitationStatus').textContent+=' · انتهت جلسة التعرف.';
 rec.start();$('#recitationStatus').textContent='جارٍ الاستماع…';
});
$('#stopRecitation')?.addEventListener('click',()=>{recognition?.stop();recognition=null;if(micStream)micStream.getTracks().forEach(t=>t.stop());if(micFrame)cancelAnimationFrame(micFrame);if(micContext)micContext.close().catch(()=>{});$('#voiceMeterFill').style.width='0%'});
/* Microphone level meter is only a level indicator, not a recitation quality or Tajweed score. */
async function startMicMeter(){
 try{micStream=await navigator.mediaDevices.getUserMedia({audio:true});const C=window.AudioContext||window.webkitAudioContext;micContext=new C();const src=micContext.createMediaStreamSource(micStream);micAnalyser=micContext.createAnalyser();micAnalyser.fftSize=256;src.connect(micAnalyser);const data=new Uint8Array(micAnalyser.frequencyBinCount);const draw=()=>{micAnalyser.getByteTimeDomainData(data);let sum=0;for(const v of data)sum+=(v-128)**2;const level=Math.min(100,Math.sqrt(sum/data.length)/45*100);$('#voiceMeterFill').style.width=level+'%';micFrame=requestAnimationFrame(draw)};draw()}catch(e){$('#recitationStatus').textContent='لم يسمح المتصفح باستخدام الميكروفون.'}
}
/* enable the live sound level meter after a separate explicit press */
if(quizTarget)quizTarget.insertAdjacentHTML('beforeend','<button id="enableVoiceMeter" class="feature-btn">تفعيل مؤشر مستوى الصوت</button>');
$('#enableVoiceMeter')?.addEventListener('click',startMicMeter);
/* AR-style camera radar uses a compass arrow only; it is not a calibrated AR Kaaba overlay. */
const qiblaPage=$('#qibla .card');
if(qiblaPage)qiblaPage.insertAdjacentHTML('beforeend','<div class="feature-card"><h3>رادار اتجاه القبلة بالكاميرا – تجريبي</h3><video id="qiblaCamera" playsinline muted style="width:100%;border-radius:14px;display:none"></video><div class="feature-actions"><button id="startQiblaCamera" class="feature-btn">فتح الكاميرا</button><button id="stopQiblaCamera" class="feature-btn">إيقاف الكاميرا</button></div><p class="feature-note">يعرض سهم اتجاه تقريبي اعتماداً على مستشعر الهاتف، وليس إسقاطاً ثلاثي الأبعاد للكعبة ولا بديلاً عن معايرة البوصلة.</p></div>');
let qiblaCameraStream=null;
$('#startQiblaCamera')?.addEventListener('click',async()=>{try{qiblaCameraStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});$('#qiblaCamera').srcObject=qiblaCameraStream;$('#qiblaCamera').style.display='block';await $('#qiblaCamera').play()}catch(e){toast('تعذر فتح الكاميرا؛ تحقق من الإذن') }});
$('#stopQiblaCamera')?.addEventListener('click',()=>{qiblaCameraStream?.getTracks().forEach(t=>t.stop());qiblaCameraStream=null;$('#qiblaCamera').pause();$('#qiblaCamera').srcObject=null;$('#qiblaCamera').style.display='none'});
/* Tree and badges are calculated from local, recorded activity. */
const statsCard=$('#stats .feature-card:last-child');
if(statsCard)statsCard.insertAdjacentHTML('afterbegin','<div class="tree-achievement"><div class="tree-crown" id="treeCrown">✦</div><div class="tree-trunk"></div><div class="feature-note" id="treeMessage">ازرع وردك اليومي بالمداومة.</div></div><h3>أوسمة الإنجاز</h3><div id="achievementBadges" class="badge-grid"></div>');
async function renderAchievements(){
 const log=await readLocal('activityLog',{}),days=Object.keys(log).filter(k=>{const v=log[k]||{};return (v.verses||0)+(v.tasbih||0)+(v.adhkar||0)>0}).sort();
 const totalTasbih=Object.values(log).reduce((a,v)=>a+(v.tasbih||0),0);
 const badges=[['قارئ مواظب','سجّل قراءة في 7 أيام مختلفة',days.length>=7],['ألف تسبيحة','أتم 1000 تسبيحة',totalTasbih>=1000],['سلسلة أسبوع','نشاط في 7 أيام متتالية',Number($('#statsStreak')?.textContent)>=7],['قارئ الكهف','فتح سورة الكهف',Number((await readLocal('surah18Opened',0))||0)>0]];
 const unlocked=badges.filter(b=>b[2]).length;
 $('#treeCrown').textContent=['✦','✧','❀','✿','۞'][Math.min(4,Math.floor(unlocked*4/Math.max(1,badges.length)))];
 $('#treeMessage').textContent=unlocked===0?'ابدأ بخطوة صغيرة اليوم؛ تنمو الشجرة مع المداومة.':'أحسنت، أحرزت '+unlocked+' من '+badges.length+' أوسمة.';
 $('#achievementBadges').innerHTML=badges.map(b=>'<div class="badge-item '+(b[2]?'earned':'locked')+'"><b>'+b[0]+'</b><small>'+b[1]+'</small><span>'+(b[2]?'مُكتسب':'قيد الإنجاز')+'</span></div>').join('');
}
const priorRenderStats=renderStats;
renderStats=async function(){await priorRenderStats();await renderAchievements()};
if(typeof window.loadSurah==='function'){
 const previousSurahLoader=window.loadSurah;
 window.loadSurah=async function(n){const r=await previousSurahLoader(n);if(n===18){const v=Number(await readLocal('surah18Opened',0))+1;saveLocal('surah18Opened',v)}return r};
}
/* Activity and badges refresh when the page opens. */
renderAchievements();
/* Universal tap feedback for cards and buttons is optional and respects device settings. */

/* Sun arc follows the same elapsed-prayer percentage as the progress bar. */
function addSunArc(el,id){
 if(!el||el.querySelector('.sun-arc'))return;
 el.insertAdjacentHTML('beforeend','<svg class="sun-arc" id="'+id+'SunArc" viewBox="0 0 260 66" aria-label="قوس حركة الوقت بين الصلاتين"><path d="M18 55 Q130 -26 242 55"/><path class="sun-path" d="M18 55 Q130 -26 242 55" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/><circle id="'+id+'SunDot" cx="18" cy="55" r="5"/></svg>');
}
addSunArc(prayerCountdown,'prayerCountdown');addSunArc(homeCountdown,'prayerCountdownHome');
const oldSunRefresh=refreshPrayer;
refreshPrayer=function(){
 oldSunRefresh();
 const t=nextPrayer();if(!t)return;
 const keys=['Fajr','Dhuhr','Asr','Maghrib','Isha'],i=keys.indexOf(t.key),prev=keys[(i+4)%5],[ph,pm]=timings[prev].split(':').map(Number);
 const start=new Date(t.date);start.setHours(ph,pm,0,0);if(prev==='Isha'&&t.key==='Fajr')start.setDate(start.getDate()-1);
 const pct=Math.max(0,Math.min(100,(Date.now()-start)/Math.max(1,t.date-start)*100)),q=pct/100;
 const x=18+224*q,y=55-162*q*(1-q);
 ['prayerCountdown','prayerCountdownHome'].forEach(id=>{
  const dot=$('#'+id+'SunDot'),path=$('#'+id+'SunArc .sun-path');
  if(dot){dot.setAttribute('cx',x.toFixed(1));dot.setAttribute('cy',y.toFixed(1))}
  if(path)path.style.strokeDashoffset=String(100-pct);
 });
};
/* Approximate word-follow highlight for a single-ayah audio track; timing is not an authored recitation transcript. */
const audioTools=$('#readerTools');
if(audioTools&&!$('#audioSyncLine'))audioTools.insertAdjacentHTML('afterbegin','<div class="audio-sync"><small>متابعة الكلمات أثناء الصوت · توقيت تقريبي</small><div id="audioSyncLine"></div></div>');
let activeAudioVerseEl=null;
$('#surahContent')?.addEventListener('click',e=>{const b=e.target.closest('[data-play-ayah]');if(b)activeAudioVerseEl=b.closest('.verse')},true);
player?.addEventListener('timeupdate',()=>{
 if(!activeAudioVerseEl||!Number.isFinite(player.duration)||player.duration<=0)return;
 const words=(activeAudioVerseEl.childNodes[0]?.textContent||'').trim().split(/\s+/).filter(Boolean);
 if(!words.length)return;
 const weights=words.map(w=>Math.max(1,w.replace(/[،؛.!؟]/g,'').length)),total=weights.reduce((a,b)=>a+b,0),position=player.currentTime/player.duration*total;
 let passed=0,current=0;for(let i=0;i<weights.length;i++){if(position>=passed&&position<passed+weights[i]){current=i;break}passed+=weights[i]}
 $('#audioSyncLine').innerHTML=words.map((w,i)=>'<span class="'+(i===current?'audio-word-active':'')+'"></span>').join('');
 words.forEach((w,i)=>$('#audioSyncLine').children[i].textContent=w+' ');
});
player?.addEventListener('ended',()=>{activeAudioVerseEl=null;$('#audioSyncLine').textContent=''});
/* Make the camera preview carry a compass arrow overlay, not a fictional 3D Kaaba. */
const cam=$('#qiblaCamera');
if(cam){
 const wrap=document.createElement('div');wrap.className='camera-radar-wrap';cam.parentNode.insertBefore(wrap,cam);wrap.appendChild(cam);
 wrap.insertAdjacentHTML('beforeend','<div id="cameraQiblaOverlay" class="camera-qibla-overlay">↑</div>');
}
const oldCompassUpdate=compassUpdate;
compassUpdate=function(){oldCompassUpdate();const degree=Number($('#qiblaDegree')?.textContent.replace('°',''));if(heading!==null&&Number.isFinite(degree)&&$('#cameraQiblaOverlay'))$('#cameraQiblaOverlay').style.transform='translate(-50%,-50%) rotate('+(degree-heading)+'deg)'};
/* 3D bead rope can be rotated by finger drag. */
const beadRope=$('#beadRope');let beadDragX=null,beadRotation=0;
beadRope?.addEventListener('pointerdown',e=>{beadDragX=e.clientX;beadRope.setPointerCapture?.(e.pointerId)});
beadRope?.addEventListener('pointermove',e=>{if(beadDragX===null)return;beadRotation+=(e.clientX-beadDragX)*.7;beadDragX=e.clientX;beadRope.style.transform='rotateY('+beadRotation+'deg) rotateX(8deg)'});
['pointerup','pointercancel','lostpointercapture'].forEach(ev=>beadRope?.addEventListener(ev,()=>{beadDragX=null}));
/* Daily tree uses the real local activity count, not a fabricated global rank. */
const lastReadBadgeNote=$('#treeMessage');
if(lastReadBadgeNote)lastReadBadgeNote.title='النشاط محفوظ على هذا الجهاز فقط';

/* Complete the commonly circulated 99-name enumeration while stating its scholarly caveat. */
const extraDivineNames=[
['القابض','الذي يقبض الرزق أو الأرواح بحكمته.','تذكر أن الأمر كله بيد الله.'],
['الباسط','الذي يبسط الرزق والرحمة لمن يشاء.','اشكر السعة ولا تغتر بها.'],
['الخافض','الذي يخفض من شاء بعدله وحكمته.','اترك التكبر والظلم.'],
['الرافع','الذي يرفع من شاء بالطاعة والفضل.','اطلب الرفعة بالإيمان والعمل الصالح.'],
['المعز','الذي يمنح العزة لمن يشاء.','اطلب العزة بطاعة الله.'],
['المذل','الذي يذل من شاء بعدله.','احذر البغي والغرور.'],
['الحكم','الذي يحكم بالحق ولا معقب لحكمه.','ارضَ بحكم الله.'],
['العدل','المنزه عن الظلم، الذي يضع الأمور مواضعها.','الزم العدل مع الناس.'],
['المقيت','الحافظ الموصل أقوات الخلق، على ما فسره أهل العلم.','توكل على الله في الرزق.'],
['الحسيب','الكافي لعباده والمحاسب لهم.','حاسب نفسك قبل الحساب.'],
['الجليل','العظيم الجليل القدر.','أجِلّ الله في قلبك.'],
['الباعث','الذي يبعث الخلق يوم القيامة.','استعد للبعث والعمل الصالح.'],
['الشهيد','المطلع الذي لا يغيب عنه شيء.','استقم في السر والعلن.'],
['الحق','الثابت الذي لا شك في وجوده ووعده.','تمسك بالحق.'],
['المحصي','الذي أحصى كل شيء عدداً وعلماً.','راقب أعمالك.'],
['المبدئ','الذي بدأ الخلق وأنشأهم.','تأمل بداية الخلق.'],
['المعيد','الذي يعيد الخلق بعد الموت.','تذكر الرجوع إلى الله.'],
['المحيي','الذي يهب الحياة.','اشكر نعمة الحياة.'],
['المميت','الذي يقدر الموت على خلقه.','استعد للقاء الله.'],
['الواجد','الغني الذي لا يفتقر إلى شيء، في شرح الاسم الوارد في القائمة المشهورة.','استشعر غنى الله عن العالمين.'],
['الماجد','العظيم الشريف كثير الإحسان.','أكثر من الثناء على الله.'],
['المقتدر','كامل القدرة الذي لا يعجزه شيء.','لا تيأس من فرج الله.'],
['المقدم','الذي يقدم من شاء بحكمته.','سل الله التوفيق وحسن السبق إلى الخير.'],
['المؤخر','الذي يؤخر من شاء بحكمته.','اصبر على تأخر ما ترجوه.'],
['الظاهر','العالي الذي ليس فوقه شيء، والظاهر بآياته.','تدبر دلائل قدرة الله.'],
['الباطن','القريب المحيط الذي لا يحجبه شيء.','أخلص النية لله.'],
['الوالي','المتولي تدبير الخلق.','فوّض أمرك إلى الله.'],
['المتعالي','المتنزه عن صفات النقص.','نزّه الله وعظّمه.'],
['البر','كثير الإحسان واللطف.','أحسن إلى الخلق.'],
['التواب','الذي يوفق عباده للتوبة ويقبلها.','بادر بالتوبة.'],
['المنتقم','الذي ينتقم من الظالمين بعدله.','لا تظلم ولا تيأس من عدل الله.'],
['العفو','الذي يمحو الذنوب ويتجاوز عن السيئات.','اسأل الله العفو واعفُ عن الناس.'],
['الرؤوف','شديد الرأفة بعباده.','ارفق بالخلق.'],
['مالك الملك','المالك لكل الملك والمتصرف فيه.','لا تتعلق بزينة الدنيا.'],
['ذو الجلال والإكرام','صاحب العظمة والكمال والإنعام.','اجمع بين التعظيم والرجاء.'],
['المقسط','العادل الذي يقيم القسط.','أقم العدل ولو على نفسك.'],
['الجامع','الذي يجمع الخلق ليوم لا ريب فيه.','استعد ليوم الجمع.'],
['الغني','المستغني عن جميع خلقه.','استغنِ بالله عما في أيدي الناس.'],
['المغني','الذي يغني من يشاء من فضله.','اسأل الله الكفاية.'],
['المانع','الذي يمنع بحكمته ما يشاء.','ثق بحكمة المنع والعطاء.'],
['الضار النافع','الذي يقدر الضر والنفع، ولا يقع شيء إلا بإذنه.','لا تتعلق بالأسباب وحدها.'],
['البديع','الذي أبدع الخلق على غير مثال سابق.','تأمل بديع صنع الله.'],
['الباقي','الدائم الذي لا يلحقه فناء.','اعمل لما يبقى.'],
['الوارث','الباقي بعد فناء الخلق، وإليه يرجع الملك.','تذكر أن ما في أيدينا أمانة.'],
['الرشيد','الذي يرشد عباده ويدبر الأمر بحكمة.','اطلب الرشد والهداية.'],
['الصبور','الذي لا يعاجل العصاة بالعقوبة، على ما ورد في القائمة المشهورة.','تحلَّ بالصبر والحلم.']
];
const sharedNames=window.imuslimDivineNames||[];
const presentNames=new Set(sharedNames.map(x=>x[0]));
extraDivineNames.forEach(x=>{if(!presentNames.has(x[0])){sharedNames.push(x);presentNames.add(x[0])}});
if(typeof window.imuslimRenderDivineNames==='function')window.imuslimRenderDivineNames();
const namesNote=$('#namesList .feature-note');
if(namesNote)namesNote.innerHTML='هذه مجموعة مستفادة من القوائم المتداولة مع معانٍ موجزة للتقريب. اختلف أهل العلم في تعيين الأسماء التسعة والتسعين وصحة سرد الترمذي اسماً اسماً؛ فلا تُجعل القائمة حداً لأسماء الله. <a href="https://www.islamweb.net/ar/fatwa/12383/" target="_blank" rel="noopener">اقرأ بيان الخلاف والمصدر</a>.';
/* Optional quick radial access, not a replacement for the side navigation. */
if(!$('#quickFab'))document.body.insertAdjacentHTML('beforeend','<div id="quickFabMenu"><button data-quick-open="tasbih">المسبحة السريعة</button><button data-quick-open="qibla">اتجاه القبلة</button><button data-quick-open="adhkar">دعاء وأذكار</button></div><button id="quickFab" aria-label="الأدوات السريعة">✧</button>');
$('#quickFab')?.addEventListener('click',()=>$('#quickFabMenu').classList.toggle('open'));
$('#quickFabMenu')?.addEventListener('click',e=>{const b=e.target.closest('[data-quick-open]');if(!b)return;$('#quickFabMenu').classList.remove('open');window.openSection(b.dataset.quickOpen)});
/* Halal food search is optional and based on OSM tags, not a certification guarantee. */
const mosqueCard=$('#nearbyMosquesBtn')?.closest('.feature-card');
if(mosqueCard)mosqueCard.insertAdjacentHTML('beforeend','<div class="feature-actions"><button id="nearbyHalalBtn" class="feature-btn">مطاعم مذكور أنها حلال</button></div><div id="nearbyHalalList" class="mosque-list"></div><p class="feature-note">الوسم على الخريطة ليس شهادة اعتماد حلال؛ تحقق من المطعم مباشرة.</p>');
$('#nearbyHalalBtn')?.addEventListener('click',async()=>{
 const out=$('#nearbyHalalList');out.innerHTML='<p class="muted">جارٍ البحث…</p>';
 let c=window.userCoords||null;
 if(!c&&navigator.geolocation){try{const p=await new Promise((ok,no)=>navigator.geolocation.getCurrentPosition(ok,no,{enableHighAccuracy:true,timeout:12000}));c={lat:p.coords.latitude,lon:p.coords.longitude}}catch(e){}}
 if(!c){out.textContent='اسمح بالموقع للبحث عن المطاعم القريبة.';return}
 const q='[out:json][timeout:25];(node["amenity"="restaurant"]["diet:halal"="yes"](around:5000,'+c.lat+','+c.lon+');way["amenity"="restaurant"]["diet:halal"="yes"](around:5000,'+c.lat+','+c.lon+');node["cuisine"~"halal",i](around:5000,'+c.lat+','+c.lon+');way["cuisine"~"halal",i](around:5000,'+c.lat+','+c.lon+'););out center tags;';
 try{const r=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:'data='+encodeURIComponent(q)});if(!r.ok)throw Error();const rows=(await r.json()).elements||[],list=rows.map(x=>{const lat=x.lat??x.center?.lat,lon=x.lon??x.center?.lon;if(!Number.isFinite(lat)||!Number.isFinite(lon))return null;return {name:x.tags?.name||'مطعم بدون اسم مسجل',lat,lon,km:haversine(c.lat,c.lon,lat,lon)}}).filter(Boolean).sort((a,b)=>a.km-b.km).slice(0,12);
 out.innerHTML=list.length?list.map(x=>'<div class="mosque-item"><b></b><br><small></small><br><a target="_blank" rel="noopener">فتح الاتجاهات</a></div>').join(''):'لا توجد مطاعم بوسم حلال ضمن نطاق 5 كم في بيانات الخريطة.';
 list.forEach((x,i)=>{const el=out.children[i];el.querySelector('b').textContent=x.name;el.querySelector('small').textContent=x.km.toFixed(2)+' كم تقريباً';el.querySelector('a').href='https://www.google.com/maps/dir/?api=1&destination='+x.lat+','+x.lon});
 }catch(e){out.textContent='تعذر الوصول إلى بيانات الخريطة حالياً.'}
});
/* A lightweight, approximate pitch indicator; it is not a Tajweed assessment. */
if($('#recitationStatus')&&!$('#voicePitch'))$('#recitationStatus').insertAdjacentHTML('afterend','<div id="voicePitch" class="feature-note">طبقة الصوت التقريبية: —</div>');
async function startMicMeter(){
 try{
  if(!navigator.mediaDevices?.getUserMedia)throw Error();
  micStream=await navigator.mediaDevices.getUserMedia({audio:true});
  const C=window.AudioContext||window.webkitAudioContext;micContext=new C();
  const src=micContext.createMediaStreamSource(micStream);micAnalyser=micContext.createAnalyser();micAnalyser.fftSize=2048;src.connect(micAnalyser);
  const data=new Float32Array(micAnalyser.fftSize),sampleRate=micContext.sampleRate;
  const draw=()=>{
   micAnalyser.getFloatTimeDomainData(data);let sum=0;for(const v of data)sum+=v*v;
   const rms=Math.sqrt(sum/data.length),level=Math.min(100,rms*260);
   if($('#voiceMeterFill'))$('#voiceMeterFill').style.width=level+'%';
   let pitch='—';
   if(rms>.012){
    const minLag=Math.max(2,Math.floor(sampleRate/500)),maxLag=Math.min(data.length/2,Math.floor(sampleRate/70));
    let best=-1,bestLag=0;
    for(let lag=minLag;lag<=maxLag;lag++){let corr=0;for(let i=0;i<data.length-lag;i+=3)corr+=data[i]*data[i+lag];if(corr>best){best=corr;bestLag=lag}}
    if(bestLag)pitch=Math.round(sampleRate/bestLag)+' Hz';
   }
   if($('#voicePitch'))$('#voicePitch').textContent='طبقة الصوت التقريبية: '+pitch+' · لا تقيس صحة التلاوة أو التجويد';
   micFrame=requestAnimationFrame(draw);
  };draw();
 }catch(e){if($('#recitationStatus'))$('#recitationStatus').textContent='لم يسمح المتصفح باستخدام الميكروفون أو لا يدعمه.'}
}

// Interactive learning games: educational practice, not a promise of spiritual reward.
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
const puzzleWords=['قُلْ','هُوَ','اللَّهُ','أَحَدٌ'];
function renderPuzzle(){const host=$('#ayahPuzzle');if(!host)return;host.innerHTML='';shuffle(puzzleWords).forEach((w,i)=>{const b=document.createElement('button');b.className='game-choice';b.textContent=w;b.dataset.word=w;b.title='اضغط لنقل الكلمة إلى آخر الترتيب';b.addEventListener('click',()=>host.appendChild(b));host.appendChild(b)})}
renderPuzzle();
$('#shuffleAyahPuzzle')?.addEventListener('click',()=>{renderPuzzle();$('#ayahPuzzleResult').textContent=''});
$('#checkAyahPuzzle')?.addEventListener('click',()=>{const got=[...$('#ayahPuzzle').children].map(x=>x.dataset.word);$('#ayahPuzzleResult').textContent=got.join('|')===puzzleWords.join('|')?'أحسنت! الترتيب صحيح. سورة الإخلاص، الآية 1.':'ليس هذا ترتيب الآية بعد؛ حاول مرة أخرى.'});
const vocabItems=[{w:'أَفُول',q:['الغياب والزوال','الزيادة والنماء','السفر'],a:0,ex:'ورد وصف الشمس بالأفول في سورة الأنعام (76)، أي غيابها وزوالها.'},{w:'حَصُورًا',q:['كثير المال','ممتنعاً عن الشهوات، كما فسره أهل التفسير','شديد السرعة'],a:1,ex:'وصف يحيى عليه السلام في آل عمران (39)، وللمفسرين تفصيل في تفسيره.'}];
let vocabIndex=0;
function renderVocab(){const x=vocabItems[vocabIndex%vocabItems.length];$('#vocabQuestion').textContent='ما معنى: '+x.w+'؟';$('#vocabOptions').innerHTML=x.q.map((v,i)=>'<button class="game-choice" data-vocab="'+i+'">'+v+'</button>').join('');$('#vocabResult').textContent='';}
renderVocab();
$('#vocabOptions')?.addEventListener('click',e=>{const b=e.target.closest('[data-vocab]');if(!b)return;const x=vocabItems[vocabIndex%vocabItems.length];$('#vocabResult').textContent=Number(b.dataset.vocab)===x.a?'صحيح. '+x.ex:'ليست الإجابة الصحيحة. '+x.ex});
$('#nextVocab')?.addEventListener('click',()=>{vocabIndex++;renderVocab()});
const seerahItems=[{q:'في أي مدينة هاجر النبي ﷺ وأقام الدولة الإسلامية؟',o:['الطائف','المدينة المنورة','بيت المقدس'],a:1,e:'هاجر النبي ﷺ إلى يثرب، وسميت المدينة النبوية.'},{q:'ما اسم الغار الذي نزل فيه الوحي أول مرة؟',o:['غار حراء','غار ثور','غار أحد'],a:0,e:'كان بدء الوحي في غار حراء.'},{q:'في أي سنة هجرية وقعت غزوة بدر؟',o:['السنة الثانية','السنة الخامسة','السنة الثامنة'],a:0,e:'وقعت بدر الكبرى في رمضان من السنة الثانية للهجرة.'}];
let seerahIndex=0;
function renderSeerah(){const x=seerahItems[seerahIndex%seerahItems.length];$('#seerahQuestion').textContent=x.q;$('#seerahOptions').innerHTML=x.o.map((v,i)=>'<button class="game-choice" data-seerah="'+i+'">'+v+'</button>').join('');$('#seerahResult').textContent='';}
renderSeerah();
$('#seerahOptions')?.addEventListener('click',e=>{const b=e.target.closest('[data-seerah]');if(!b)return;const x=seerahItems[seerahIndex%seerahItems.length];$('#seerahResult').textContent=Number(b.dataset.seerah)===x.a?'إجابة صحيحة. '+x.e:'الإجابة الصحيحة: '+x.o[x.a]+'. '+x.e});
$('#nextSeerah')?.addEventListener('click',()=>{seerahIndex++;renderSeerah()});
const nameMatches=[{n:'الرَّحْمٰن',o:['واسع الرحمة','العليم بكل شيء','الخالق'],a:0},{n:'السَّمِيع',o:['الذي يرزق الخلق','الذي يسمع جميع الأصوات','الغفور'],a:1},{n:'الغَفُور',o:['الذي يغفر الذنوب','الذي يحيي الموتى','الذي يخلق'],a:0}];
let nameIndex=0;
function renderNameMatch(){const x=nameMatches[nameIndex%nameMatches.length];$('#nameMatchQuestion').textContent=x.n;$('#nameMatchOptions').innerHTML=x.o.map((v,i)=>'<button class="game-choice" data-name-match="'+i+'">'+v+'</button>').join('');$('#nameMatchResult').textContent='';}
renderNameMatch();
$('#nameMatchOptions')?.addEventListener('click',e=>{const b=e.target.closest('[data-name-match]');if(!b)return;const x=nameMatches[nameIndex%nameMatches.length];$('#nameMatchResult').textContent=Number(b.dataset.nameMatch)===x.a?'صحيح. أحسنت في المراجعة.':'حاول مرة أخرى؛ راجع معنى الاسم.'});
$('#nextNameMatch')?.addEventListener('click',()=>{nameIndex++;renderNameMatch()});
// Prohibition entries: concise definitions, direct Quranic evidence, impact and repentance guidance.
const prohibitions=[
{cat:'اللسان والقلب',n:'الغيبة',d:'ذكر المسلم أخاه بما يكره في غيبته، ولو كان الوصف فيه.',e:'قال تعالى: «ولا يغتب بعضكم بعضاً» (الحجرات: 12).',h:'تهدم الثقة وتؤذي الروابط الاجتماعية.',t:'التوبة بالإقلاع والندم والعزم على عدم العودة، مع إصلاح الضرر. ومسألة إخبار من اغتيب أو طلب مسامحته فيها تفصيل بين أهل العلم بحسب المصلحة ودفع مفسدة أكبر.'},
{cat:'اللسان والقلب',n:'النميمة',d:'نقل الكلام بين الناس بقصد الإفساد أو بما يؤدي إلى الشحناء.',e:'ثبت في الصحيحين الوعيد في النميمة؛ صحيح البخاري وصحيح مسلم، كتاب الإيمان.',h:'تزرع العداوة وتقطع المودة.',t:'ترك النقل، والندم، وإصلاح ما أمكن من الخصومة دون إشعالها.'},
{cat:'اللسان والقلب',n:'الكذب',d:'الإخبار بخلاف الواقع عمداً.',e:'قال تعالى: «إن الله لا يهدي من هو مسرف كذاب» (غافر: 28).',h:'يفقد الناس الثقة ويوقع في الظلم وضياع الحقوق.',t:'التوقف والندم والعزم على الصدق، وتصحيح الخبر ورد الحقوق إن ترتب عليه ضرر.'},
{cat:'المال والمعاملات',n:'الربا',d:'معاملة مالية محرمة لها صور وأحكام تفصيلية يبينها أهل الاختصاص.',e:'قال تعالى: «وأحل الله البيع وحرم الربا» (البقرة: 275).',h:'يوقع في أكل المال بالباطل والاستغلال.',t:'إيقاف المعاملة المحرمة، والندم، وسؤال عالم موثوق عن كيفية التخلص من آثار العقد والحقوق؛ فالتفاصيل تختلف باختلاف الصورة.'},
{cat:'المال والمعاملات',n:'الغش في البيع',d:'إخفاء العيب أو التدليس أو تقديم معلومات مضللة للمشتري.',e:'قال رسول الله ﷺ: «من غش فليس مني» (صحيح مسلم، 102).',h:'يضيّع الحقوق ويقوض الثقة في المعاملات.',t:'التوقف، ورد الحق أو تعويض المتضرر، وبيان العيب حيث يلزم.'},
{cat:'المال والمعاملات',n:'أكل مال اليتيم ظلماً',d:'الاستيلاء على مال اليتيم أو التصرف فيه بغير حق.',e:'قال تعالى: «إن الذين يأكلون أموال اليتامى ظلماً إنما يأكلون في بطونهم ناراً» (النساء: 10).',h:'اعتداء على ضعيف وماله ومستقبله.',t:'رد المال إلى صاحبه أو وليه الشرعي، والندم والتوبة، والاستعانة بالقضاء أو أهل الاختصاص عند تعذر الرد.'},
{cat:'الأخلاق والعلاقات',n:'عقوق الوالدين',d:'إيذاء الوالدين أو الإساءة إليهما أو تضييع حقوقهما الواجبة.',e:'قال تعالى: «فلا تقل لهما أف ولا تنهرهما» (الإسراء: 23).',h:'يؤذي الأسرة ويقطع البر والإحسان.',t:'التوبة، والاعتذار والإحسان، ورد المظالم، مع عدم طاعة أحد في معصية الخالق.'},
{cat:'الأكل والشرب',n:'الخمر والمسكرات',d:'كل ما أسكر العقل يدخل في باب المسكرات المحرمة.',e:'قال تعالى: «إنما الخمر والميسر والأنصاب والأزلام رجس من عمل الشيطان فاجتنبوه» (المائدة: 90).',h:'تضر العقل والصحة والأسرة وقد تقود إلى أضرار أخرى.',t:'الإقلاع وطلب الدعم الطبي أو العلاجي عند الاعتماد، مع التوبة وعدم اليأس من رحمة الله.'},
{cat:'الأكل والشرب',n:'الميتة ولحم الخنزير',d:'أطعمة نص القرآن على تحريمها، مع استثناءات الضرورة المنضبطة شرعاً.',e:'قال تعالى: «حرمت عليكم الميتة والدم ولحم الخنزير» (المائدة: 3).',h:'امتثال أمر الله وحفظ الطهارة والالتزام بأحكام الطعام.',t:'التوبة إن وقع ذلك عن علم وتعمد، ومعرفة أحكام الضرورة من أهل العلم.'}
];
const cats=['الكل',...new Set(prohibitions.map(x=>x.cat))];let selectedProhibitionCat='الكل';
function renderProhibitions(){const c=$('#prohibitionCategories'),l=$('#prohibitionList');if(!c||!l)return;c.innerHTML=cats.map(x=>'<button class="feature-btn '+(x===selectedProhibitionCat?'primary':'')+'" data-prohibition-cat="'+x+'">'+x+'</button>').join('');const rows=prohibitions.filter(x=>selectedProhibitionCat==='الكل'||x.cat===selectedProhibitionCat);l.innerHTML=rows.map((x,i)=>'<button class="prohibition-item" data-prohibition="'+prohibitions.indexOf(x)+'"><b>'+x.n+'</b><small>'+x.cat+'</small><span>عرض الدليل والتفصيل ←</span></button>').join('')}
renderProhibitions();
$('#prohibitionCategories')?.addEventListener('click',e=>{const b=e.target.closest('[data-prohibition-cat]');if(!b)return;selectedProhibitionCat=b.dataset.prohibitionCat;renderProhibitions()});
$('#prohibitionList')?.addEventListener('click',e=>{const b=e.target.closest('[data-prohibition]');if(!b)return;const x=prohibitions[Number(b.dataset.prohibition)];$('#prohibitionTitle').textContent=x.n;$('#prohibitionBody').innerHTML='<h4>التعريف المبسط</h4><p>'+x.d+'</p><h4>الدليل الشرعي</h4><p>'+x.e+'</p><h4>الحكمة والآثار</h4><p>'+x.h+'</p><h4>التوبة والإصلاح</h4><p>'+x.t+'</p><p class="feature-note">المادة للتثقيف العام وليست فتوى في واقعة بعينها. تُراجع المسائل التفصيلية مع عالم موثوق.</p>';$('#prohibitionDetail').hidden=false});
$('#closeProhibition')?.addEventListener('click',()=>$('#prohibitionDetail').hidden=true);
$('#prohibitionDetail')?.addEventListener('click',e=>{if(e.target.id==='prohibitionDetail')e.currentTarget.hidden=true});


// Muslim Hub: practical local-first tools. Shared sync/native alarms are explicitly not simulated.
const hubStore={get(k,d){try{return JSON.parse(localStorage.getItem('imuslim_hub_'+k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem('imuslim_hub_'+k,JSON.stringify(v))}catch(e){}}};
const safeText=s=>String(s??'').replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
// 1) Group khatma: local tracking + shareable invite token; no cross-device sync.
function renderGroup(){const g=hubStore.get('group',null),host=$('#khatmaGroupPanel');if(!host)return;if(!g){host.innerHTML='';return}host.innerHTML='<p><b>'+safeText(g.name)+'</b> · رمز المشاركة: <b>'+g.code+'</b></p><div class="juz-grid">'+Array.from({length:30},(_,i)=>'<label><input type="checkbox" data-juz="'+(i+1)+'" '+(g.done.includes(i+1)?'checked':'')+'> الجزء '+(i+1)+'</label>').join('')+'</div><p class="feature-note">إنجازك المحلي: '+g.done.length+'/30 جزءاً</p><button id="shareGroupCode" class="feature-btn">مشاركة الرمز</button>';
host.querySelectorAll('[data-juz]').forEach(b=>b.addEventListener('change',()=>{const next=hubStore.get('group',g);next.done=b.checked?[...new Set([...next.done,Number(b.dataset.juz)])]:next.done.filter(x=>x!==Number(b.dataset.juz));hubStore.set('group',next);renderGroup()}));
$('#shareGroupCode')?.addEventListener('click',()=>{const text='انضم إلى ختمتنا: '+g.name+' · رمز المجموعة: '+g.code+' · https://seifjaballah77-eng.github.io/Im.muslim/';if(navigator.share)navigator.share({title:'ختمة i-Muslim',text}).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(text).then(()=>alert('تم نسخ دعوة الختمة'))});
}
$('#createKhatmaGroup')?.addEventListener('click',()=>{const name=$('#khatmaGroupName').value.trim();if(!name){$('#khatmaGroupName').focus();return}hubStore.set('group',{name,code:Math.random().toString(36).slice(2,8).toUpperCase(),done:[]});renderGroup()});renderGroup();
// 2) Memorization review.
let memHidden=false;
function renderMemorize(){const v=$('#memorizeVerse').value;$('#memorizePrompt').textContent=memHidden?'••••••••••••••••':v;$('#memorizeResult').textContent=''}
$('#memorizeVerse')?.addEventListener('change',()=>{memHidden=false;renderMemorize()});$('#hideMemVerse')?.addEventListener('click',()=>{memHidden=!memHidden;renderMemorize();$('#hideMemVerse').textContent=memHidden?'إظهار الآية':'إخفاء الآية'});
$('#checkMemorize')?.addEventListener('click',()=>{const expected=$('#memorizeVerse').value.normalize('NFC').replace(/[ًٌٍَُِّْٰـ]/g,''),got=$('#memorizeAnswer').value.normalize('NFC').replace(/[ًٌٍَُِّْٰـ]/g,'').replace(/s+/g,'');$('#memorizeResult').textContent=got===expected.replace(/s+/g,'')?'إجابة مطابقة للنص المختار.':'هناك اختلاف عن النص؛ راجع الرسم والحركات.'});
// 3) Mosque quiet mode.
function setMosqueMode(on){document.body.classList.toggle('mosque-mode',on);hubStore.set('mosque',on);$('#mosqueModeToggle').textContent=on?'إيقاف وضع المسجد':'تفعيل وضع المسجد';$('#mosqueModeStatus').textContent=on?'الوضع الهادئ مفعّل على هذا الجهاز.':'الوضع العادي.'}
setMosqueMode(hubStore.get('mosque',false));$('#mosqueModeToggle')?.addEventListener('click',()=>setMosqueMode(!document.body.classList.contains('mosque-mode')));
// 4) Weekly worship planner.
const planTasks=['الصلاة في وقتها','ورد القرآن','أذكار الصباح والمساء','صلة الرحم','صدقة أو عمل خير','تعلم فائدة شرعية'];
function renderPlan(){const done=hubStore.get('plan',{}),host=$('#weeklyPlan');if(!host)return;host.innerHTML=planTasks.map((x,i)=>'<label class="plan-row"><input type="checkbox" data-plan="'+i+'" '+(done[i]?'checked':'')+'> '+x+'</label>').join('');host.querySelectorAll('[data-plan]').forEach(b=>b.addEventListener('change',()=>{const p=hubStore.get('plan',{});p[b.dataset.plan]=b.checked;hubStore.set('plan',p);renderPlan()}));$('#weeklyPlanProgress').textContent=Object.values(done).filter(Boolean).length+' من '+planTasks.length+' أهداف محددة؛ أعد ضبطها أسبوعياً بنفسك.'}
renderPlan();
// 5) Dua directory with sourced Quranic supplications and common authentic wording.
const duas=[{c:'الكرب',t:'لا إله إلا الله العظيم الحليم، لا إله إلا الله رب العرش العظيم، لا إله إلا الله رب السماوات ورب الأرض ورب العرش الكريم.',s:'صحيح البخاري وصحيح مسلم'},{c:'السفر',t:'سبحان الذي سخر لنا هذا وما كنا له مقرنين وإنا إلى ربنا لمنقلبون.',s:'الزخرف: 13-14'},{c:'الوالدان',t:'رب ارحمهما كما ربياني صغيراً.',s:'الإسراء: 24'},{c:'الهداية',t:'اهدنا الصراط المستقيم.',s:'الفاتحة: 6'},{c:'الدنيا والآخرة',t:'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار.',s:'البقرة: 201'},{c:'العلم',t:'رب زدني علماً.',s:'طه: 114'}];
function renderDuas(){const q=($('#duaSearch')?.value||'').trim();$('#duaLibrary').innerHTML=duas.filter(x=>(x.c+x.t+x.s).includes(q)).map(x=>'<div class="feature-item"><small>'+x.c+' · '+x.s+'</small><p class="arabic">'+x.t+'</p><button class="feature-btn" data-copy-dua="'+duas.indexOf(x)+'">نسخ الدعاء</button></div>').join('')||'<p class="muted">لا توجد نتائج.</p>'}
renderDuas();$('#duaSearch')?.addEventListener('input',renderDuas);$('#duaLibrary')?.addEventListener('click',e=>{const b=e.target.closest('[data-copy-dua]');if(b)navigator.clipboard?.writeText(duas[Number(b.dataset.copyDua)].t)});
// 6) Qiyam reminder while this page remains open.
let qiyamTimer=null,lastQiyamNotice='';
$('#saveQiyam')?.addEventListener('click',async()=>{const time=$('#qiyamTime').value;if(!time)return;hubStore.set('qiyam',time);if('Notification'in window&&Notification.permission==='default'){try{await Notification.requestPermission()}catch(e){}}
if(qiyamTimer)clearInterval(qiyamTimer);
qiyamTimer=setInterval(()=>{const now=new Date();const today=now.toLocaleDateString('en-CA');if(now.getHours()+':'+String(now.getMinutes()).padStart(2,'0')===time&&lastQiyamNotice!==today){lastQiyamNotice=today;if('Notification'in window&&Notification.permission==='granted')new Notification('تذكير قيام الليل',{body:'حان وقت التذكير الذي اخترته.'});else alert('تذكير قيام الليل: '+time);}},20000);
$('#qiyamStatus').textContent='تم حفظ التذكير. سيعمل أثناء بقاء هذه الصفحة مفتوحة فقط؛ المتصفح لا يضمنه بعد الإغلاق.'});
if(hubStore.get('qiyam'))$('#qiyamTime').value=hubStore.get('qiyam');
// 7) Tajweed bite-sized lessons.
const tajweed=[['أحكام النون الساكنة والتنوين','الإظهار: ء هـ ع ح غ خ؛ الإدغام: يرملون؛ الإقلاب: ب؛ والإخفاء في بقية الحروف.'],['المد الطبيعي','يمد بمقدار حركتين، مثل «قال» عند تحقق شروطه.'],['القلقلة','حروفها قطب جد، وتظهر صفتها عند سكون الحرف.'],['الغنة','صوت يخرج من الخيشوم، وتظهر في النون والميم المشددتين.']];
$('#tajweedLessons').innerHTML=tajweed.map((x,i)=>'<details class="lesson-detail"><summary>'+x[0]+'</summary><p>'+x[1]+'</p></details>').join('');
// 8) Historical timeline; dates are presented as commonly cited approximations where needed.
const history=[['مولد النبي ﷺ','عام الفيل؛ ويذكر المؤرخون 570 أو 571م على اختلاف الروايات.'],['بدء الوحي','نحو 610م في غار حراء.'],['الهجرة النبوية','622م؛ بداية التأريخ الهجري.'],['غزوة بدر','2 هـ.'],['فتح مكة','8 هـ.'],['حجة الوداع','10 هـ.']];
$('#historyTimeline').innerHTML=history.map(x=>'<div class="feature-item"><b>'+x[0]+'</b><p>'+x[1]+'</p></div>').join('');
// 9) Personal sadaqah log.
function renderSadaqah(){const rows=hubStore.get('sadaqah',[]);$('#sadaqahList').innerHTML=rows.map((x,i)=>'<div class="feature-item"><b>'+x.amount+'</b> · '+safeText(x.note)+'<small> · '+x.date+'</small> <button class="feature-btn" data-del-sadaqah="'+i+'">حذف</button></div>').join('')||'<p class="muted">لم تسجل صدقات بعد.</p>'}
$('#addSadaqah')?.addEventListener('click',()=>{const amount=Number($('#sadaqahAmount').value),note=$('#sadaqahNote').value.trim();if(!(amount>0)){alert('أدخل مبلغاً صحيحاً.');return}const rows=hubStore.get('sadaqah',[]);rows.unshift({amount,note,date:new Date().toLocaleDateString('ar')});hubStore.set('sadaqah',rows);$('#sadaqahAmount').value='';$('#sadaqahNote').value='';renderSadaqah()});
$('#sadaqahList')?.addEventListener('click',e=>{const b=e.target.closest('[data-del-sadaqah]');if(!b)return;const a=hubStore.get('sadaqah',[]);a.splice(Number(b.dataset.delSadaqah),1);hubStore.set('sadaqah',a);renderSadaqah()});renderSadaqah();
// 10) Travel prayer guidance is intentionally cautious and does not issue a fatwa.
$('#checkTravel')?.addEventListener('click',()=>{const km=Number($('#travelDistance').value);$('#travelGuidance').textContent=km>0?'قد تتحقق رخص السفر عند كثير من الفقهاء بعد مسافة تُقدّر بنحو 80-90 كم، لكن تحديد المسافة ومدة الإقامة وشروط القصر والجمع تختلف بين المذاهب والجهات. اسأل جهة إفتاء موثوقة عن حالتك.':'أدخل المسافة أولاً.'});
// 11) Create a shareable image using canvas.
let cardBlob=null;
$('#makeShareCard')?.addEventListener('click',()=>{const text=$('#cardText').value.trim(),kind=$('#cardKind').value;if(!text){$('#cardText').focus();return}const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=1200;const ctx=canvas.getContext('2d');ctx.fillStyle='#071b18';ctx.fillRect(0,0,1200,1200);ctx.strokeStyle='#d8b56d';ctx.lineWidth=8;ctx.strokeRect(42,42,1116,1116);ctx.fillStyle='#d8b56d';ctx.font='bold 54px Tahoma';ctx.textAlign='center';ctx.fillText(kind,600,190);ctx.fillStyle='#f5f3e9';ctx.font='46px Tahoma';const words=text.split(' ');let lines=[],line='';for(const w of words){const test=line?line+' '+w:w;if(ctx.measureText(test).width>960&&line){lines.push(line);line=w}else line=test}if(line)lines.push(line);lines.slice(0,12).forEach((x,i)=>ctx.fillText(x,600,430+i*72));ctx.fillStyle='#d8b56d';ctx.font='30px Tahoma';ctx.fillText('i-Muslim',600,1080);cardBlob=canvas;$('#shareCardPreview').replaceChildren(canvas);});
$('#downloadShareCard')?.addEventListener('click',()=>{if(!cardBlob){alert('أنشئ البطاقة أولاً.');return}const a=document.createElement('a');a.download='i-muslim-card.png';a.href=cardBlob.toDataURL('image/png');a.click()});
// 12) Daily quiz.
const quiz=[['كم عدد سور القرآن الكريم؟',['110','114','120'],1,'عدد سور القرآن 114 سورة.'],['ما أول شهر في السنة الهجرية؟',['محرم','رمضان','رجب'],0,'أول الشهور الهجرية المحرم.'],['كم عدد أركان الإسلام؟',['خمسة','ستة','سبعة'],0,'أركان الإسلام خمسة.']];
let quizIndex=0;
function renderQuiz(){const q=quiz[quizIndex%quiz.length];$('#dailyQuizQuestion').textContent=q[0];$('#dailyQuizOptions').innerHTML=q[1].map((x,i)=>'<button class="game-choice" data-quiz="'+i+'">'+x+'</button>').join('');$('#dailyQuizResult').textContent=''}
renderQuiz();$('#dailyQuizOptions')?.addEventListener('click',e=>{const b=e.target.closest('[data-quiz]');if(!b)return;const q=quiz[quizIndex%quiz.length];$('#dailyQuizResult').textContent=Number(b.dataset.quiz)===q[2]?'إجابة صحيحة. '+q[3]:'الإجابة الصحيحة: '+q[1][q[2]]+'. '+q[3]});$('#nextDailyQuiz')?.addEventListener('click',()=>{quizIndex++;renderQuiz()});
// 13) Nearby mosque shortcut to the existing locator.
const mosqueShortcut=$('#nearbyMosquesBtn');if(mosqueShortcut)mosqueShortcut.setAttribute('aria-label','البحث عن المساجد القريبة');
// 14) Personal notes and references.
function renderPersonalLibrary(){const rows=hubStore.get('personalLibrary',[]);$('#personalLibraryList').innerHTML=rows.map((x,i)=>'<div class="feature-item"><b>'+safeText(x.title)+'</b><p>'+safeText(x.body)+'</p><button class="feature-btn" data-del-library="'+i+'">حذف</button></div>').join('')||'<p class="muted">مكتبتك فارغة حالياً.</p>'}
$('#savePersonalLibrary')?.addEventListener('click',()=>{const title=$('#personalLibraryTitle').value.trim(),body=$('#personalLibraryText').value.trim();if(!title||!body){alert('اكتب العنوان والمحتوى.');return}const rows=hubStore.get('personalLibrary',[]);rows.unshift({title,body});hubStore.set('personalLibrary',rows);$('#personalLibraryTitle').value='';$('#personalLibraryText').value='';renderPersonalLibrary()});
$('#personalLibraryList')?.addEventListener('click',e=>{const b=e.target.closest('[data-del-library]');if(!b)return;const a=hubStore.get('personalLibrary',[]);a.splice(Number(b.dataset.delLibrary),1);hubStore.set('personalLibrary',a);renderPersonalLibrary()});renderPersonalLibrary();
// 15) Serenity mode: distraction-free local screen.
function setSerenity(on){document.body.classList.toggle('serenity-mode',on);hubStore.set('serenity',on);$('#serenityModeToggle').textContent=on?'إيقاف وضع السكينة':'تشغيل وضع السكينة';}
setSerenity(hubStore.get('serenity',false));$('#serenityModeToggle')?.addEventListener('click',()=>setSerenity(!document.body.classList.contains('serenity-mode')));

/* Calm breathing glow in Focus Mode. */

})();