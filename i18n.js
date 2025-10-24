// Internationalization (i18n) - عربي و ألماني
const i18n = {
    currentLanguage: localStorage.getItem('language') || 'de', // Default to German
    
    translations: {
        de: {
            // Header
            headerTitle: 'Milano Pizza',
            voiceBtn: 'Sprache',
            voiceBtnArabic: 'صوت',
            newOrder: 'Neue Bestellung',
            savedInvoices: 'Speichern',
            languageToggle: 'العربية',
            
            // Sidebar
            categories: 'Kategorien',
            categoriesArabic: 'الفئات',
            
            // Main Content
            selectCategory: 'Wählen Sie eine Kategorie',
            selectCategoryArabic: 'اختر الفئة',
            
            // Cart
            cart: 'Warenkorb',
            cartArabic: 'السلة',
            totalPrice: 'Gesamtpreis',
            totalPriceArabic: 'السعر الإجمالي',
            deliveryCosts: 'Lieferkosten',
            deliveryCostsArabic: 'تكاليف التوصيل',
            finalPrice: 'Endpreis',
            finalPriceArabic: 'السعر النهائي',
            createInvoice: 'Rechnung erstellen',
            createInvoiceArabic: 'إنشاء فاتورة',
            removeItem: 'Entfernen',
            removeItemArabic: 'إزالة',
            
            // Invoice
            invoiceTitle: 'Rechnung',
            print: 'Drucken',
            savePdf: 'Als PDF speichern',
            
            // Messages
            productNotFound: 'Produkt nicht gefunden',
            productNotFoundArabic: 'المنتج غير موجود',
            noItemsInCart: 'Keine Artikel im Warenkorb',
            noItemsInCartArabic: 'لا توجد عناصر في السلة',
            itemAdded: 'zum Warenkorb hinzugefügt',
            itemAddedArabic: 'تمت إضافته إلى السلة',
            selectSize: 'Bitte wählen Sie eine Größe',
            selectSizeArabic: 'يرجى اختيار الحجم',
            
            // Sizes
            klein: 'Klein (26cm)',
            klein_arabic: 'صغير (26 سم)',
            medium: 'Medium (30cm)',
            medium_arabic: 'وسط (30 سم)',
            gross: 'Groß (45*32cm)',
            gross_arabic: 'كبير (45*32 سم)',
            party: 'Party (40*60cm)',
            party_arabic: 'حفلة (40*60 سم)',
            
            // Additional UI Elements
            deliveryCostsPlaceholder: '0.00',
            voiceListeningMsg: '🎤 Höre zu... Sagen Sie (Milano Tisch) oder (Margherita)',
            pdfInstructions: 'Bitte verwenden Sie die Druckfunktion Ihres Browsers und wählen Sie "Als PDF speichern".',
            invoiceNumber: 'Rechnungsnummer',
            invoiceNumberArabic: 'رقم الفاتورة',
            invoiceDate: 'Datum',
            invoiceDateArabic: 'التاريخ',
            orderedItems: 'Bestellte Artikel',
            orderedItemsArabic: 'العناصر المطلوبة',
            inch: '6 Stk.',
            inchArabic: '6 قطع',
            inch12: '12 Stk.',
            inch12Arabic: '12 قطعة',
            
            // Voice Recognition
            listening: 'Höre zu...',
            listeningArabic: 'استمع...',
            voiceError: 'Fehler bei der Spracherkennung',
            voiceErrorArabic: 'خطأ في التعرف على الكلام',
            tryAgain: 'Erneut versuchen',
            tryAgainArabic: 'حاول مرة أخرى',
            
            // Pizza Categories in German
            'Pizza 🍕': 'Pizza 🍕',
            'Burger 🍔': 'Burger 🍔',
            'Croque 🥪': 'Croque 🥪',
            'Salat 🥗': 'Salat 🥗',
            'Pasta 🍝': 'Pasta 🍝',
            'Schnitzel 🥩': 'Schnitzel 🥩',
            'Snacks 🍟': 'Snacks 🍟',
            'Beilagen 🍞': 'Beilagen 🍞',
            'Fingerfood 🍗': 'Fingerfood 🍗',
            'Angebote 💥': 'Angebote 💥',
            'Gyros 🥙': 'Gyros 🥙',
            'Getränke 🥤': 'Getränke 🥤',
            
            // Pizza Categories in Arabic
            'Pizza 🍕Arabic': 'البيتزا 🍕',
            'Burger 🍔Arabic': 'البرجر 🍔',
            'Croque 🥪Arabic': 'الكروك 🥪',
            'Salat 🥗Arabic': 'السلطات 🥗',
            'Pasta 🍝Arabic': 'الباستا 🍝',
            'Schnitzel 🥩Arabic': 'الشنتزل 🥩',
            'Snacks 🍟Arabic': 'السناكس 🍟',
            'Beilagen 🍞Arabic': 'الأطباق الجانبية 🍞',
            'Fingerfood 🍗Arabic': 'الفينجرفود 🍗',
            'Angebote 💥Arabic': 'العروض 💥',
            'Gyros 🥙Arabic': 'الجيروس 🥙',
            'Getränke 🥤Arabic': 'المشروبات 🥤',
        },
        ar: {
            // Header
            headerTitle: 'ميلانو بيتزا',
            voiceBtn: 'صوت',
            voiceBtnArabic: 'صوت',
            newOrder: 'طلب جديد',
            savedInvoices: 'حفظ',
            languageToggle: 'Deutsch',
            
            // Sidebar
            categories: 'الفئات',
            categoriesArabic: 'الفئات',
            
            // Main Content
            selectCategory: 'اختر فئة',
            selectCategoryArabic: 'اختر الفئة',
            
            // Cart
            cart: 'السلة',
            cartArabic: 'السلة',
            totalPrice: 'السعر الإجمالي',
            totalPriceArabic: 'السعر الإجمالي',
            deliveryCosts: 'تكاليف التوصيل',
            deliveryCostsArabic: 'تكاليف التوصيل',
            finalPrice: 'السعر النهائي',
            finalPriceArabic: 'السعر النهائي',
            createInvoice: 'إنشاء فاتورة',
            createInvoiceArabic: 'إنشاء فاتورة',
            removeItem: 'إزالة',
            removeItemArabic: 'إزالة',
            
            // Invoice
            invoiceTitle: 'الفاتورة',
            invoiceTitleArabic: 'الفاتورة',
            print: 'طباعة',
            printArabic: 'طباعة',
            savePdf: 'حفظ كـ PDF',
            savePdfArabic: 'حفظ كـ PDF',
            
            // Messages
            productNotFound: 'المنتج غير موجود',
            productNotFoundArabic: 'المنتج غير موجود',
            noItemsInCart: 'لا توجد عناصر في السلة',
            noItemsInCartArabic: 'لا توجد عناصر في السلة',
            itemAdded: 'تمت إضافته إلى السلة',
            itemAddedArabic: 'تمت إضافته إلى السلة',
            selectSize: 'يرجى اختيار الحجم',
            selectSizeArabic: 'يرجى اختيار الحجم',
            
            // Sizes
            klein: 'صغير (26 سم)',
            klein_arabic: 'صغير (26 سم)',
            medium: 'وسط (30 سم)',
            medium_arabic: 'وسط (30 سم)',
            gross: 'كبير (45*32 سم)',
            gross_arabic: 'كبير (45*32 سم)',
            party: 'حفلة (40*60 سم)',
            party_arabic: 'حفلة (40*60 سم)',
            
            // Additional UI Elements
            deliveryCostsPlaceholder: '0.00',
            voiceListeningMsg: '🎤 استمع... قل (ميلانو تلاتين) أو (مرغريتا)',
            pdfInstructions: 'استخدم وظيفة الطباعة في المتصفح واختر "حفظ كـ PDF".',
            invoiceTitle: 'الفاتورة',
            invoiceNumber: 'رقم الفاتورة',
            invoiceNumberArabic: 'رقم الفاتورة',
            invoiceDate: 'التاريخ',
            invoiceDateArabic: 'التاريخ',
            orderedItems: 'العناصر المطلوبة',
            orderedItemsArabic: 'العناصر المطلوبة',
            inch: '6 قطع',
            inchArabic: '6 قطع',
            inch12: '12 قطعة',
            inch12Arabic: '12 قطعة',
            
            // Voice Recognition
            listening: 'استمع...',
            listeningArabic: 'استمع...',
            voiceError: 'خطأ في التعرف على الكلام',
            voiceErrorArabic: 'خطأ في التعرف على الكلام',
            tryAgain: 'حاول مرة أخرى',
            tryAgainArabic: 'حاول مرة أخرى',
            
            // Pizza Categories in German
            'Pizza 🍕': 'البيتزا 🍕',
            'Burger 🍔': 'البرجر 🍔',
            'Croque 🥪': 'الكروك 🥪',
            'Salat 🥗': 'السلطات 🥗',
            'Pasta 🍝': 'الباستا 🍝',
            'Schnitzel 🥩': 'الشنتزل 🥩',
            'Snacks 🍟': 'السناكس 🍟',
            'Beilagen 🍞': 'الأطباق الجانبية 🍞',
            'Fingerfood 🍗': 'الفينجرفود 🍗',
            'Angebote 💥': 'العروض 💥',
            'Gyros 🥙': 'الجيروس 🥙',
            'Getränke 🥤': 'المشروبات 🥤',
            
            // Pizza Categories in Arabic
            'Pizza 🍕Arabic': 'البيتزا 🍕',
            'Burger 🍔Arabic': 'البرجر 🍔',
            'Croque 🥪Arabic': 'الكروك 🥪',
            'Salat 🥗Arabic': 'السلطات 🥗',
            'Pasta 🍝Arabic': 'الباستا 🍝',
            'Schnitzel 🥩Arabic': 'الشنتزل 🥩',
            'Snacks 🍟Arabic': 'السناكس 🍟',
            'Beilagen 🍞Arabic': 'الأطباق الجانبية 🍞',
            'Fingerfood 🍗Arabic': 'الفينجرفود 🍗',
            'Angebote 💥Arabic': 'العروض 💥',
            'Gyros 🥙Arabic': 'الجيروس 🥙',
            'Getränke 🥤Arabic': 'المشروبات 🥤',
            
            // Pizza Products
            'Margherita': 'مرغريتا',
            'Mozzarella': 'موتزاريلا',
            'Formaggi': 'فورماجي',
            'Fungi': 'فونجي',
            'Salami': 'سلامي',
            'Prosciutto': 'بروشوتو',
            'Salami Fungi': 'سلامي وفونجي',
            'Prosciutto Fungi': 'بروشوتو وفونجي',
            'Prosciutto Salami': 'بروشوتو وسلامي',
            'Milano': 'ميلانو',
            'Italia': 'إيطاليا',
            'Capri': 'كابري',
            'Santorini': 'سانتوريني',
            'Ilo': 'إيلو',
            'Hawaii': 'هاواي',
            'Tonno': 'تونو',
            'Madridi': 'مدريدي',
            'Scampi': 'سكامبي',
            'Frutti de Mare': 'فروتي ديل ماري',
            'Veggie': 'نباتي',
            'Palermo': 'باليرمو',
            'Hähnchenbrust': 'صدر دجاج',
            'Classico': 'كلاسيكو',
            'Miami': 'ميامي',
            'Island': 'آيلاند',
            'Paris': 'باريس',
            'Rucola': 'روكولا',
            'Bacon': 'بيكون',
            'Chicken Curry': 'دجاج كاري',
            'Istanbul': 'اسطنبول',
            'Hot Salami': 'سلامي حار',
            'Emira': 'أميرة',
            'Wunsch': 'رغبة',
            'Pizza Homestyle': 'بيتزا منزلية',
            'Pizza Della Casa': 'بيتزا ديلا كاسا',
            'Pizza UFO': 'بيتزا يوفو',
            'Pizza Spezial': 'بيتزا خاصة',
            'Pizza Hot Dog': 'بيتزا هوت دوج',
            'Pizza Sucuk': 'بيتزا سجق',
            'Pizza Hot Beef': 'بيتزا لحم حار',
            'Pizza Spinat': 'بيتزا سبانخ',
            'Pizza Luna': 'بيتزا لونا',
            'Pizza Gyros': 'بيتزا جيروس',
            'Extra Zutaten': 'مكونات إضافية',
            'Käse Rand': 'حافة الجبن',
            
            // Burger Products
            'Hamburger': 'هامبرجر',
            'Cheeseburger': 'تشيزبرجر',
            'Chicken Burger': 'برجر الدجاج',
            'Bacon Burger': 'برجر بيكون',
            'Champignon Burger': 'برجر الفطر',
            'Crispy Chicken Burger': 'برجر الدجاج المقرمش',
            'Italian Burger': 'برجر إيطالي',
            'Jumbo Cheeseburger': 'جامبو تشيزبرجر',
            'Jumbo Hamburger': 'جامبو هامبرجر',
            'Jumbo Chicken Burger': 'جامبو برجر الدجاج',
            'Mexico Burger': 'برجر مكسيكي',
            'Chili Cheeseburger': 'تشيزبرجر تشيلي',
            
            // Croque Products
            'Croque Madame': 'كروك مدام',
            'Croque Camembert': 'كروك كامنبير',
            'Croque Schinken': 'كروك لحم الخنزير',
            'Croque Salami Champignons': 'كروك سلامي وفطر',
            'Croque Salami': 'كروك سلامي',
            'Croque Hawaii': 'كروك هاواي',
            'Croque Thunfisch': 'كروك التونة',
            'Croque Hähnchenbrust': 'كروك صدر الدجاج',
            'Croque Sucuk': 'كروك السجق',
            
            // Salat Products
            'Gemischter Salat': 'سلطة مشكلة',
            'Thunfisch Salat': 'سلطة التونة',
            'Miista': 'ميستا',
            'Ma Balla': 'ما بالا',
            'Chef': 'شيف',
            'Della Casa': 'ديلا كاسا',
            'Guken Salat': 'سلطة الخيار',
            'Gyros': 'جيروس',
            
            // Pasta Products
            'Alla Panna': 'ألا بانا',
            'Carbonara': 'كاربونارا',
            'pastore': 'باستوره',
            'Toscana': 'توسكانا',
            'Alla Milano': 'ألا ميلانو',
            'Pesto und Put': 'بيستو وبوت',
            'Bolognese': 'بولونيز',
            'scampi': 'سكامبي',
            'Pasta Classico': 'باستا كلاسيكو',
            'käse überbacken': 'جبن محمص',
            
            // Schnitzel Products
            'Wiener Schnitzel': 'شنتزل فيينا',
            'Jägerschnitzel': 'شنتزل الصياد',
            'Zigeunerschnitzel': 'شنتزل تسيجوني',
            'Schnitzel Hollandise': 'شنتزل هولانديز',
            
            // Snacks Products
            'käsebröchen': 'خبز بالجبن',
            'Pizzabröchen': 'خبز البيتزا',
            'American Piyyabrot': 'خبز بيتزا أمريكي',
            'Knoblauch Brot': 'خبز بالثوم',
            'käse Knoblauch Brot': 'خبز بالثوم والجبن',
            
            // Beilagen Products
            'Süsskartoffeln-Pommes': 'بطاطس حلوة',
            'Chili Cheese Pommes': 'بطاطس بالتشيلي والجبن',
            'Pommes': 'بطاطس مقلية',
            'Country Fries': 'بطاطس ريفية',
            'Twister': 'تويستر',
            'Chili Pommes': 'بطاطس بالتشيلي',
            'Kroketten': 'كروكيت',
            'Gegrillte Champignons': 'فطر مشوي',
            'Gegrilltes Gemüse': 'خضار مشوي',
            'BBQ Pommes': 'بطاطس بصلصة باربيكيو',
            'BBQ Twister': 'تويستر بصلصة باربيكيو',
            'Chili Twister': 'تويستر بالتشيلي',
            
            // Fingerfood Products
            'Chicken Nuggets': 'قطع الدجاج',
            'Chicken Wings': 'أجنحة الدجاج',
            'crispy Chicken Fingers': 'أصابع الدجاج المقرمشة',
            'Chili Cheese Nuggets': 'قطع دجاج بالتشيلي والجبن',
            'Moyyerella Sticks': 'عصا الموتزاريلا',
            'Michbox': 'ميك بوكس',
            'Curry Wurst': 'كاري فورست',
            
            // Angebote Products
            'A1 Supper Familienangebot': 'أ1 عرض العائلة الفاخر',
            'A2 Pizzblech': 'أ2 ورقة البيتزا',
            'A3 3* Pizza': 'أ3 3 بيتزات',
            
            // Gyros Products
            'Gyros Mista': 'جيروس ميستا',
            'Gyros Italia': 'جيروس إيطاليا',
            'Gyros Athen': 'جيروس أثينا',
            'Gyros Auflauf': 'جيروس طاجين',
            'Gyros Curry': 'جيروس كاري',
            'Gyros hot': 'جيروس حار',
            
            // Getränke Products
            'Cola 1Liter': 'كولا 1 لتر',
            'Cola 0.33L': 'كولا 0.33 لتر',
            'Redbull': 'ريد بول',
            'Durstlöscher': 'ديرست لوشر',
            'Fanta (0.33l)': 'فانتا 0.33 لتر',
            'Wasser (0.5l)': 'ماء 0.5 لتر',
        }
    },
    
    // Get translated text
    t: function(key) {
        return this.translations[this.currentLanguage][key] || key;
    },
    
    // Get translated category name
    getCategoryName: function(categoryName) {
        const key = this.currentLanguage === 'ar' ? categoryName + 'Arabic' : categoryName;
        return this.translations[this.currentLanguage][key] || categoryName;
    },
    
    // Get translated product name
    getProductName: function(productName) {
        // If German, return the original product name (don't translate)
        if (this.currentLanguage === 'de') {
            return productName;
        }
        
        // If Arabic, look up in Arabic translations from script.js
        if (this.currentLanguage === 'ar') {
            // Try to find the product in Arabic translation dictionary from script.js
            // Fall back to original name if not found
            return productName;
        }
        
        return productName;
    },
    
    // Switch language
    switchLanguage: function() {
        this.currentLanguage = this.currentLanguage === 'de' ? 'ar' : 'de';
        localStorage.setItem('language', this.currentLanguage);
        this.applyLanguage();
    },
    
    // Apply language to page
    applyLanguage: function() {
        // Set document direction and language
        document.documentElement.lang = this.currentLanguage;
        document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
        document.body.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
        
        // Update page title
        document.title = this.t('headerTitle');
        
        // Update HTML elements
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });
        
        // Update placeholder attributes
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });
        
        // Update all text content (for dynamic elements)
        if (typeof updateMenuDisplay === 'function') {
            updateMenuDisplay();
        }
        if (typeof updateCartDisplay === 'function') {
            updateCartDisplay();
        }
    },
    
    // Initialize
    init: function() {
        this.applyLanguage();
        // Add event listener to language toggle button
        const langBtn = document.getElementById('languageToggle');
        if (langBtn) {
            langBtn.addEventListener('click', () => {
                this.switchLanguage();
            });
        }
    }
};

// Initialize i18n when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
    i18n.init();
}