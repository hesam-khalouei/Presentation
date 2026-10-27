# Ewano B2B Interactive Presentation

پرزنتیشن تعاملی راهکارهای سازمانی و اعتباری اوانو.

## ساختار پروژه
Ewano Presentation/
├── index.html # Entry point
├── README.md
├── .gitignore
│
├── assets/
│ ├── fonts/ # فونت IRANYekanX (Light, Regular, Bold)
│ ├── images/
│ │ ├── logos/ # لوگوی اصلی اوانو و شرکا
│ │ │ └── partners/ # ۵۷ لوگوی شریک تجاری
│ │ ├── cards/ # کارت‌های اعتباری، ووچرها
│ │ └── vouchers/
│ └── icons/ # آیکون‌های SVG
│
├── css/
│ ├── main.css # تمام استایل‌ها (متغیرها، اسلایدها، کامپوننت‌ها)
│ ├── slides.css # (placeholder — برای جداسازی آینده)
│ ├── components.css # (placeholder — برای جداسازی آینده)
│ └── responsive.css # (placeholder — برای جداسازی آینده)
│
├── js/
│ ├── navigation.js # منطق اسلاید، ماشین‌حساب، drawer
│ ├── calculator.js # (placeholder — برای جداسازی آینده)
│ ├── animations.js # (placeholder — برای جداسازی آینده)
│ └── main.js # Bootstrap
│
└── data/
└── slides.json # (placeholder — برای آینده)

## ویژگی‌ها

- 🎨 طراحی بر اساس برندبوک اوانو (Persian Green / Persian Orange)
- 📱 Responsive برای دسکتاپ، تبلت و موبایل
- ⌨️ ناوبری با کیبورد (`←` `→` `F` برای fullscreen)
- 🧮 ماشین‌حساب اعتبار تعاملی
- 🎬 ۲۱ اسلاید تعاملی
- 🖼️ پشتیبانی از تصاویر و لوگوهای شرکا

## اجرا

### گزینه ۱: Live Server (VS Code)
1. افزونه [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) نصب کن
2. روی `index.html` راست‌کلیک → **Open with Live Server**
3. مرورگر باز می‌شه روی `http://127.0.0.1:5500`

### گزینه ۲: Python
```bash
python3 -m http.server 8000# Presentation
