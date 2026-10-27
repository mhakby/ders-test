# Ders Test

Telefonda kısa aralıklarla test çözmek için çevrimdışı çalışan bir web uygulaması (PWA).
Şartname: [SPEC.md](SPEC.md).

- **İSG:** 500 resmi soru, 5 test.
- **Test Engineering (CEN315):** 13 haftalık slayttan üretilmiş İngilizce, 5 şıklı sorular.
  Ders ana ekranındaki kutucuklarla hangi haftaların karma teste ve tekrar listelerine gireceği seçilir.

## Komutlar

```bash
npm install
npm run dev          # geliştirme; aynı Wi-Fi'daki telefondan Network adresiyle açılır
npm run validate     # tüm ders dosyalarını doğrular (build öncesi otomatik çalışır)
npm run build
```

`main` dalına her push GitHub Pages'e otomatik yayınlanır.

## Test Engineering soruları

1. `npm run fetch-te` slaytları `sources/test-engineering/pptx/` altına indirir.
2. `python -I scripts/pptx_to_text.py sources/test-engineering/pptx sources/test-engineering/_text`
   slayt metnini ve görsel ağırlıklı slaytların görsellerini çıkarır.
3. Sorular `sources/test-engineering/_questions/weekNN.json` dosyalarında
   ([QUESTION_GUIDE.md](sources/test-engineering/QUESTION_GUIDE.md)); orada `options[0]` her zaman doğru cevaptır.
4. `npm run build-te` bunları `data/courses/test-engineering.json`'a birleştirir ve doğru şıkkı A–E arasında dengeli dağıtır.

## Yeni ders eklemek

`data/courses/` altına şemaya uyan bir JSON koy ve `data/courses/index.json`'a bir satır ekle. Kod değişikliği gerekmez.
