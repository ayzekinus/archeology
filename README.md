# Arkeoloji Anakod Prototip (AAA–ZZZ)

Bu prototip, kazı sahasında kullanılan **anakod** sistemini (AAA'dan ZZZ'ye) sıra ile ve tekrar etmeyecek şekilde üretir.

## Çalıştırma (lokal)

Bu proje ES module kullandığı için dosyayı doğrudan çift tıklayıp açmak yerine küçük bir statik sunucu ile çalıştırın:

```bash
python -m http.server 8080
```

Ardından tarayıcıda açın:

- http://localhost:8080

## Özellikler

- Anakod sadece **Kaydet** işleminden sonra üretilir.
- AAA → AAB → ... → ZZZ sıralaması.
- Verilen kod tekrar verilmez (demo amaçlı reset dışında).
- Kayıt alanları:
  - Buluntu Yeri (select)
  - PlanKare
  - Açıklama
- Kayıtlar localStorage'da tutulur.
- JSON export mevcuttur.

## Buluntu Yeri seçenekleri

`js/core/config.js` dosyasındaki `BULUNTU_YERI_OPTIONS` listesi düzenlenebilir.
