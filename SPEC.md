# Ders test uygulaması: şartname

Bu belge Claude Code için yazıldı. Önce tamamını oku, sonra uygula. Belirsiz bir nokta olursa aşağıdaki "Kararlar" bölümündeki varsayılanları kullan, kullanıcıya sadece gerçekten engelleyen sorular için dön.

## Amaç

Telefonda, gün içinde kısa aralıklarla test çözmek için bir uygulama. Birden fazla ders desteklenecek:

1. **İSG (İş Sağlığı ve Güvenliği):** 500 hazır soru, resmi cevap anahtarı var. Veri hazır: `data/courses/isg.json`.
2. **Test Engineering:** Hazır soru yok. Ders dokümanlarından (PDF, slayt vb.) soru üretilecek ve aynı formatta uygulamaya eklenecek.
3. İleride başka dersler de aynı yolla eklenebilmeli. Yeni ders eklemek kod değişikliği gerektirmemeli, sadece yeni bir JSON dosyası ve manifest kaydı.

## Kararlar (varsayılanlar)

- **Platform:** Statik web uygulaması + PWA (ana ekrana eklenebilir, çevrimdışı çalışır). Sunucu yok, hesap yok. Gerekçe: telefona kurmak için mağaza, imzalama veya debug kablosu gerekmez; bir link ve "Ana ekrana ekle" yeterli.
- **Teknoloji:** Vite + React + TypeScript, `vite-plugin-pwa`. Stil için düz CSS veya CSS modules; ağır UI kütüphanesi gerekmez.
- **Yayın:** GitHub Pages (veya Netlify). Geliştirirken telefonda denemek için `npm run dev -- --host` ile aynı Wi-Fi üzerinden aç.
- **Kayıt:** İlerleme `localStorage`'da tutulur. Cihaz değişimi ve yedek için ilerlemeyi JSON olarak dışa/içe aktarma butonu olur.
- **Arayüz dili:** Türkçe.

## Klasör yapısı

```
/data/courses/index.json        # ders listesi (manifest)
/data/courses/isg.json          # hazır (bu şartnameyle birlikte verildi)
/data/courses/test-engineering.json   # üretilecek
/sources/isg/                   # orijinal docx/pdf (sadece referans)
/sources/test-engineering/      # Test Engineering dokümanları (kullanıcı koyacak)
/scripts/validate.ts            # tüm ders dosyalarını şemaya göre doğrular
/src/...
```

`index.json` örneği:

```json
{
  "courses": [
    { "id": "isg", "file": "isg.json" },
    { "id": "test-engineering", "file": "test-engineering.json" }
  ]
}
```

## Veri şeması (tüm dersler için ortak)

```json
{
  "schemaVersion": 1,
  "id": "isg",
  "title": "İş Sağlığı ve Güvenliği",
  "languages": { "primary": "tr", "secondary": "en" },
  "origin": "official",
  "sourceNote": "serbest metin",
  "sets": [
    {
      "id": "test-1",
      "title": "Test 1",
      "questions": [
        {
          "id": "isg-1",
          "number": "1",
          "prompt":  { "tr": "Soru metni", "en": "Question text" },
          "options": { "tr": ["...", "...", "...", "..."], "en": ["...", "...", "...", "..."] },
          "answer": ["D"],
          "explanation": { "tr": "Neden doğru (isteğe bağlı)" },
          "note": "Serbest uyarı metni (isteğe bağlı)",
          "source": { "file": "hafta3.pdf", "page": 12 }
        }
      ]
    }
  ]
}
```

Kurallar:

- `origin`: `"official"` (resmi soru ve anahtar) veya `"generated"` (dokümandan üretilmiş). Arayüz üretilmiş derslerde bunu küçük bir etiketle belirtir.
- `languages.secondary` isteğe bağlı. Bir soruda ikincil dil yoksa o sorunun dil butonu pasif görünür.
- Şık sayısı 2 ile 5 arası olabilir. Harfler sıradan türetilir (A, B, C…). `prompt` ve `options` içinde her dilin şık sayısı aynı olmalı.
- `answer` bir dizi: birden fazla doğru şık kabul edilebilir (İSG'de 431 numaralı iki soru böyle).
- `explanation`, `note`, `source` isteğe bağlı. Üretilmiş sorularda `explanation` ve `source` zorunlu.
- `id` tüm uygulamada benzersiz olmalı; ilerleme kaydı bu id'ye bağlanır, bu yüzden bir soru yayına girdikten sonra id'si değişmemeli.
- Metinlerde satır sonu (`\n`) olabilir (ör. I., II., III. maddeli sorular); arayüz bunu korumalı (`white-space: pre-line`).

`scripts/validate.ts` bu kuralları kontrol etsin; `npm run validate` hata varsa soru id'si ile birlikte raporlasın. Build öncesi otomatik çalışsın.

## Ekranlar ve davranış

### Ders seçimi
- Manifestteki dersler listelenir: ders adı, toplam soru, çözülen sayısı, doğru oranı.
- Tek ders varsa bu ekran atlanabilir; iki ve üzeri derste gösterilir.

### Ders ana ekranı
- Üstte özet: çözülen / toplam, doğru oranı, kaydedilen soru sayısı.
- Büyük "Kaldığın yerden devam et" butonu: son açılan set ve sorunun konumunu gösterir (ör. "Test 2, 34. soru / 100").
- "Soru sırası: Sıralı | Karışık" seçici.
- Set listesi (Test 1, Test 2…): her satırda çözülen sayısı, doğru ve yanlış sayısı ve her soru için küçük bir şeritle (yeşil doğru, kırmızı yanlış, gri çözülmedi) ilerleme görünümü.
- Tekrar listeleri: **Kaydettiklerim**, **Yanlışlarım** (son cevabı yanlış olanlar), **Tüm sorular** (dersin bütün soruları tek listede).
- Altta: ilerlemeyi dışa aktar, içe aktar, tüm ilerlemeyi sıfırla. Sıfırlama iki adımlı onayla yapılır.

### Soru ekranı
- Üst çubuk: geri, set adı, sıralı/karışık değiştirici, soru haritası butonu; altında ince ilerleme çubuğu.
- Soru numarası, kaydet (bayrak) butonu, dil butonu.
- **Dil:** Soru her zaman birincil dilde (Türkçe) açılır. Dil butonuna basınca aynı yerde soru ve şıklar ikincil dile (İngilizce) döner, tekrar basınca geri gelir. Sonraki soruya geçince yine Türkçe açılır. İkincil dil yoksa buton pasif, basılınca "Bu sorunun İngilizcesi yok" mesajı.
- **Cevaplama:** Şıkka dokununca anında sonuç: seçilen yanlışsa kırmızı, doğru şık yeşil, diğerleri soluk. Altında "Doğru." ya da "Yanlış. Doğru cevap C: …" satırı. Varsa `explanation` ve `note` gösterilir. Bu sorunun kaç kez yanlış cevaplandığı da küçük notla görünür.
- Cevaplanmış soruya geri dönüldüğünde önceki cevap ve sonuç görünür. "Bu soruyu tekrar çöz" bağlantısı cevabı temizler.
- Alt çubuk (sabit, başparmakla erişilebilir): Önceki, konum (34 / 100), Sonraki. Cevap verildikten sonra Sonraki vurgulanır.
- Sağa/sola kaydırma ile soru değişir. Klavyede 1–4 veya A–D şık seçer, oklar gezinir, E dil değiştirir, S kaydeder.
- **Soru haritası:** Alttan açılan panelde setin tüm soruları renkli kutular halinde; dokununca o soruya gider. Kaydedilenler küçük işaretle görünür.
- **Hatalı soru bildirimi:** Özellikle üretilmiş sorular için "Bu soruda sorun var" butonu. İşaretlenen sorular yerelde tutulur, dışa aktarılan dosyada listelenir ki sonradan düzeltilebilsin.
- Set sonunda özet ekranı: doğru, yanlış, boş sayıları; "Yanlışları tekrar çöz", "Seti sıfırla ve baştan çöz" (iki adımlı onay), "Geri dön".

### Sıralı ve karışık mod
- Sıralı: veri dosyasındaki sıra.
- Karışık: set karıştırılır ve **karıştırılmış sıra kaydedilir**, böylece uygulama kapanıp açılınca aynı sırada kalınan yerden devam edilir. Çözülmemiş sorular önce gelir.
- Mod değiştirildiğinde ekrandaki soru korunur.

### İlerleme ve kayıt
- Her cevap, her gezinme ve her kaydetme anında `localStorage`'a yazılır. Uygulama aniden kapansa da kalınan yer kaybolmaz.
- Kayıt yapısı ders bazında ayrılır: `progress[courseId] = { answers, wrongCount, saved, flagged, decks, lastDeck, mode, updatedAt }`.
  - `answers[questionId] = { choice: "C", correct: true, at: timestamp }` (son cevap)
  - `decks[deckId] = { order: [questionId…], pos, mode, done }` (tekrar listelerinde o turdaki cevaplar `done` içinde tutulur, böylece liste tekrar çözülebilir)
- Veri dosyasında olmayan id'lere ait kayıtlar sessizce yok sayılır (soru silinirse uygulama bozulmaz).
- Dışa aktar: tek JSON dosyası. İçe aktar: `updatedAt` daha yeni olan ders kaydı kazanır.

### Görünüm
- Önce mobil, en fazla ~640 px genişlikte ortalanmış içerik.
- Açık ve koyu tema (sistem ayarına göre). Renkleri CSS değişkenleri olarak tanımla.
- İSG için önerilen görsel dil: iş güvenliği işaretlerinden alınan renkler; sarı (#F2B705) vurgu ve kaydedilenler, yeşil (#0B7A4B) doğru, kırmızı (#BC1F2E) yanlış, mavi (#1D5DA6) dil butonu. Ders başlığının üstünde ince sarı-siyah çapraz şerit. Yazı tipi olarak Barlow ve numaralar/başlıklar için Barlow Condensed uygun.
- Dokunma hedefleri en az 44 px. iPhone'da çentik ve alt çubuk için `viewport-fit=cover` ve `env(safe-area-inset-*)` kullan.
- Animasyonlar az ve `prefers-reduced-motion` dikkate alınsın.

## İSG verisi hakkında bilinmesi gerekenler

`data/courses/isg.json` hazır ve doğrulandı; yeniden ayrıştırmaya gerek yok. Kaynak belgelerdeki tuhaflıklar ve verideki karşılıkları:

- Kapsam ilk 500 soru: Test 1–5, her biri 100 soru (1–100, 101–200, …, 401–500). PDF cevap anahtarı 1200 soruya kadar gidiyor, 500 sonrası kullanılmıyor.
- Belgelerin sonundaki cevap anahtarı bir EMF görseli ve PDF'in ilk sayfasıyla aynı.
- **414 numaralı soru belgede yok**, anahtarda da boş. Buna karşılık **iki ayrı 431. soru var** ve anahtarda 431 için "C-D" yazıyor. Veride bunlar `isg-431` ve `isg-431b`; ikisinde de C ve D doğru kabul ediliyor ve `note` alanında açıklanıyor. Sonuçta Test 5 yine 100 soru, toplam 500.
- **İngilizce belgede 211–284 arası sorular yok.** Bu 74 sorunun `en` alanı boş; toplam 426 soruda İngilizce var. İngilizce belgede numarasız sorular (290, 334, 353, 423, 493) sıraya göre eşleştirildi. İngilizce metin belgeden geldiği gibi, makine çevirisi kalitesinde.
- Türkçe metindeki bozuk kesme işaretleri (`dB?dir` gibi) düzeltildi.

## Test Engineering: dokümandan soru üretimi

Bu dersin hazır sorusu yok. Kullanıcı ders dokümanlarını `sources/test-engineering/` klasörüne koyacak. Soruları sen (Claude Code) üreteceksin; uygulama içinde yapay zekâ çağrısı yok, üretim bir kez yapılıp JSON'a yazılıyor.

İş akışı:

1. Klasördeki dosyaları metne çevir (PDF için `pdftotext -layout`, PPTX için `python-pptx`, DOCX için `pandoc`). Sayfa/slayt numaralarını koru. Çıktıyı `sources/test-engineering/_text/` altına yaz.
2. İçeriği konu başlıklarına göre böl. Her doküman veya bölüm bir `set` olsun (ör. "Hafta 3: Black-box test teknikleri"). Set başına yaklaşık 15–25 soru; dokümanın yoğunluğuna göre ayarla.
3. Soruları partiler halinde üret ve her partiden sonra `npm run validate` çalıştır.
4. Bittiğinde set başına soru sayısını ve kapsanan konuları özetle.

Soru yazma kuralları:

- Her soru dokümandaki bir bilgiye dayanmalı; `source` alanına dosya adı ve sayfa/slayt numarasını yaz. Dokümanda olmayan bilgiden soru üretme.
- 4 şık, tek doğru cevap. Çeldiriciler aynı konudan, makul ve yaklaşık aynı uzunlukta olsun. "Hepsi" ve "Hiçbiri" şıklarını az kullan.
- Doğru şıkkın harfi setler boyunca dengeli dağılsın.
- Sadece tanım ezberi değil; kavram ayırt etme, kısa senaryoya uygulama (ör. "bu girdi alanı için hangi sınır değerleri test edilmeli?") ve karşılaştırma soruları da olsun.
- Her soruya 1–2 cümlelik `explanation` yaz: neden doğru, gerekirse en yakın çeldirici neden yanlış.
- Aynı bilgiyi ölçen tekrar soruları ayıkla.
- `origin: "generated"`.
- Dil: birincil ve ikincil dil kullanıcının kararına bağlı (aşağıdaki açık soru). Ders dokümanları İngilizceyse ve sınav İngilizce olacaksa varsayılan `primary: "en"`, `secondary: "tr"`; sınav Türkçe olacaksa tersi. Teknik terimleri (boundary value analysis, equivalence partitioning vb.) Türkçe metinde de parantez içinde orijinal haliyle ver.

## Kabul kriterleri

- [ ] `npm run validate` iki ders dosyasında da hatasız geçiyor.
- [ ] İSG'de 5 set, toplam 500 soru görünüyor; 431 ve 431 (ikinci) ayrı sorular, ikisinde de C ve D doğru sayılıyor.
- [ ] 211–284 arası sorularda dil butonu pasif ve uyarı veriyor; diğerlerinde İngilizceye geçip dönebiliyor.
- [ ] Bir sete girip birkaç soru çöz, sekmeyi kapat, yeniden aç: aynı soruda, önceki cevaplar görünür halde devam ediliyor.
- [ ] Karışık modda kapat-aç sonrası sıra değişmiyor.
- [ ] Kaydet, Yanlışlarım ve Tüm sorular listeleri doğru içerikle açılıyor.
- [ ] Telefonda ana ekrana eklenince tam ekran açılıyor ve uçak modunda çalışıyor.
- [ ] Dışa aktarılan dosya başka tarayıcıda içe aktarılınca ilerleme geliyor.
- [ ] Yeni bir ders eklemek sadece JSON dosyası + manifest satırı gerektiriyor.

## Açık soru (kullanıcıya sorulacak)

- Test Engineering sınavı hangi dilde olacak? Bu, üretilecek soruların birincil dilini belirliyor.
