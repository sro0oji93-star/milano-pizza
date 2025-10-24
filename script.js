console.log('📌 Script loaded');
console.log('Firebase object:', typeof firebase);

// ========== FIREBASE CONFIGURATION ==========
const firebaseConfig = {
  apiKey: "AIzaSyAJI1xWGkO-AwYY8mtWZgFuqzw6J_zXPEE",
  authDomain: "milano-4a598.firebaseapp.com",
  projectId: "milano-4a598",
  storageBucket: "milano-4a598.firebasestorage.app",
  messagingSenderId: "994151481133",
  appId: "1:994151481133:web:1d6c7275b5b17704c2dda4",
  measurementId: "G-45YBDH4H8N"
};

// Initialize Firebase
let db = null;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
}

// ========== FIRESTORE FUNCTIONS ==========
// Save order to Firestore
async function saveOrderToFirestore(order) {
    try {
        if (!db) throw new Error('Firestore not initialized');
        
        const docRef = await db.collection('orders').add({
            items: order.items,
            totalPrice: order.totalPrice,
            deliveryCost: order.deliveryCost,
            finalPrice: order.finalPrice,
            timestamp: new Date(),
            status: 'new'
        });
        
        console.log('✅ Order saved:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error saving order:', error);
        return null;
    }
}

// Get all orders from Firestore
async function getOrdersFromFirestore() {
    try {
        if (!db) throw new Error('Firestore not initialized');
        
        const snapshot = await db.collection('orders').orderBy('timestamp', 'desc').get();
        const orders = [];
        
        snapshot.forEach(doc => {
            orders.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log('✅ Orders loaded:', orders.length);
        return orders;
    } catch (error) {
        console.error('❌ Error loading orders:', error);
        return [];
    }
}

// Delete order from Firestore
async function deleteOrderFromFirestore(orderId) {
    try {
        if (!db) throw new Error('Firestore not initialized');
        
        await db.collection('orders').doc(orderId).delete();
        console.log('✅ Order deleted:', orderId);
        return true;
    } catch (error) {
        console.error('❌ Error deleting order:', error);
        return false;
    }
}

// ========== SPEECH RECOGNITION ==========
// Speech Recognition Plugin
let SpeechRecognition = null;
let PermissionStatus = null;
let Permissions = null;

// Try to load Capacitor modules if available
try {
    // This will work if modules are available
    if (typeof window !== 'undefined' && window.capacitor) {
        console.log('Capacitor available');
    }
} catch (error) {
    console.log('Capacitor not available (web environment)');
}

// ========== PERMISSION REQUEST FUNCTION ==========
async function requestMicrophonePermission() {
    try {
        if (!Permissions) {
            console.log('Permissions API not available in web environment');
            return false;
        }
        const permission = await Permissions.query({ name: Permissions.RECORD_AUDIO });
        
        if (permission.state === PermissionStatus.GRANTED) {
            return true;
        } else if (permission.state === PermissionStatus.PROMPT) {
            const result = await Permissions.request({ name: Permissions.RECORD_AUDIO });
            return result.state === PermissionStatus.GRANTED;
        } else {
            console.warn('Microphone permission denied');
            return false;
        }
    } catch (error) {
        console.error('Permission check error:', error);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const categoriesData = [
        {
            name: "Pizza 🍕",
            id: "pizza",
            items: [
                { name: "Margherita", prices: [{ size: "26cm", price: 7.00 }, { size: "30cm", price: 9.00 }, { size: "45*32cm", price: 17.00 }, { size: "40*60cm", price: 22.50 }] },
                { name: "Mozzarella", prices: [{ size: "26cm", price: 7.50 }, { size: "30cm", price: 9.50 }, { size: "45*32cm", price: 18.50 }, { size: "40*60cm", price: 23.50 }] },
                { name: "Formaggi", prices: [{ size: "26cm", price: 7.50 }, { size: "30cm", price: 9.50 }, { size: "45*32cm", price: 18.50 }, { size: "40*60cm", price: 23.50 }] },
                { name: "Fungi", prices: [{ size: "26cm", price: 7.20 }, { size: "30cm", price: 8.50 }, { size: "45*32cm", price: 19.00 }, { size: "40*60cm", price: 24.50 }] },
                { name: "Salami", prices: [{ size: "26cm", price: 8.00 }, { size: "30cm", price: 9.50 }, { size: "45*32cm", price: 19.50 }, { size: "40*60cm", price: 25.00 }] },
                { name: "Prosciutto", prices: [{ size: "26cm", price: 8.00 }, { size: "30cm", price: 9.50 }, { size: "45*32cm", price: 19.50 }, { size: "40*60cm", price: 25.00 }] },
                { name: "Salami Fungi", prices: [{ size: "26cm", price: 8.50 }, { size: "30cm", price: 9.80 }, { size: "45*32cm", price: 20.00 }, { size: "40*60cm", price: 25.00 }] },
                { name: "Prosciutto Fungi", prices: [{ size: "26cm", price: 8.50 }, { size: "30cm", price: 9.80 }, { size: "45*32cm", price: 20.00 }, { size: "40*60cm", price: 25.00 }] },
                { name: "Prosciutto Salami", prices: [{ size: "26cm", price: 8.50 }, { size: "30cm", price: 9.80 }, { size: "45*32cm", price: 20.00 }, { size: "40*60cm", price: 25.00 }] },
                { name: "Milano", prices: [{ size: "26cm", price: 8.50 }, { size: "30cm", price: 9.80 }, { size: "45*32cm", price: 20.00 }, { size: "40*60cm", price: 25.00 }] },
                { name: "Italia", prices: [{ size: "26cm", price: 8.00 }, { size: "30cm", price: 9.50 }, { size: "45*32cm", price: 18.90 }, { size: "40*60cm", price: 24.50 }] },
                { name: "Capri", prices: [{ size: "26cm", price: 8.00 }, { size: "30cm", price: 9.50 }, { size: "45*32cm", price: 18.90 }, { size: "40*60cm", price: 24.50 }] },
                { name: "Santorini", prices: [{ size: "26cm", price: 8.90 }, { size: "30cm", price: 10.50 }, { size: "45*32cm", price: 20.50 }, { size: "40*60cm", price: 25.50 }] },
                { name: "Ilo", prices: [{ size: "26cm", price: 9.10 }, { size: "30cm", price: 10.40 }, { size: "45*32cm", price: 20.50 }, { size: "40*60cm", price: 25.50 }] },
                { name: "Hawaii", prices: [{ size: "26cm", price: 8.50 }, { size: "30cm", price: 9.80 }, { size: "45*32cm", price: 20.00 }, { size: "40*60cm", price: 25.50 }] },
                { name: "Tonno", prices: [{ size: "26cm", price: 9.00 }, { size: "30cm", price: 10.80 }, { size: "45*32cm", price: 21.90 }, { size: "40*60cm", price: 26.40 }] },
                { name: "Madridi", prices: [{ size: "26cm", price: 9.00 }, { size: "30cm", price: 10.80 }, { size: "45*32cm", price: 21.90 }, { size: "40*60cm", price: 26.40 }] },
                { name: "Scampi", prices: [{ size: "26cm", price: 9.50 }, { size: "30cm", price: 11.30 }, { size: "45*32cm", price: 22.40 }, { size: "40*60cm", price: 26.90 }] },
                { name: "Frutti de Mare", prices: [{ size: "26cm", price: 9.50 }, { size: "30cm", price: 11.30 }, { size: "45*32cm", price: 22.40 }, { size: "40*60cm", price: 26.90 }] },
                { name: "Veggie", prices: [{ size: "26cm", price: 9.00 }, { size: "30cm", price: 10.50 }, { size: "45*32cm", price: 19.70 }, { size: "40*60cm", price: 25.40 }] },
                { name: "Palermo", prices: [{ size: "26cm", price: 8.50 }, { size: "30cm", price: 9.80 }, { size: "45*32cm", price: 20.00 }, { size: "40*60cm", price: 25.50 }] },
                { name: "Hähnchenbrust", prices: [{ size: "26cm", price: 9.40 }, { size: "30cm", price: 10.60 }, { size: "45*32cm", price: 18.90 }, { size: "40*60cm", price: 26.40 }] },
                { name: "Classico", prices: [{ size: "26cm", price: 8.50 }, { size: "30cm", price: 9.80 }, { size: "45*32cm", price: 20.00 }, { size: "40*60cm", price: 25.50 }] },
                { name: "Miami", prices: [{ size: "26cm", price: 8.80 }, { size: "30cm", price: 10.40 }, { size: "45*32cm", price: 20.50 }, { size: "40*60cm", price: 26.40 }] },
                { name: "Island", prices: [{ size: "26cm", price: 9.00 }, { size: "30cm", price: 10.50 }, { size: "45*32cm", price: 20.60 }, { size: "40*60cm", price: 26.80 }] },
                { name: "Paris", prices: [{ size: "26cm", price: 10.00 }, { size: "30cm", price: 11.80 }, { size: "45*32cm", price: 22.90 }, { size: "40*60cm", price: 27.40 }] },
                { name: "Rucola", prices: [{ size: "26cm", price: 9.50 }, { size: "30cm", price: 10.30 }, { size: "45*32cm", price: 19.90 }, { size: "40*60cm", price: 25.40 }] },
                { name: "Bacon", prices: [{ size: "26cm", price: 9.50 }, { size: "30cm", price: 11.30 }, { size: "45*32cm", price: 22.40 }, { size: "40*60cm", price: 26.90 }] },
                { name: "Chicken Curry", prices: [{ size: "26cm", price: 8.50 }, { size: "30cm", price: 9.80 }, { size: "45*32cm", price: 20.00 }, { size: "40*60cm", price: 25.50 }] },
                { name: "Istanbul", prices: [{ size: "26cm", price: 8.50 }, { size: "30cm", price: 10.80 }, { size: "45*32cm", price: 18.40 }, { size: "40*60cm", price: 24.50 }] },
                { name: "Hot Salami", prices: [{ size: "26cm", price: 8.50 }, { size: "30cm", price: 9.50 }, { size: "45*32cm", price: 19.00 }, { size: "40*60cm", price: 25.50 }] },
                { name: "Emira", prices: [{ size: "26cm", price: 8.40 }, { size: "30cm", price: 9.40 }, { size: "45*32cm", price: 18.90 }, { size: "40*60cm", price: 25.40 }] },
                { name: "Wunsch", prices: [{ size: "26cm", price: 10.00 }, { size: "30cm", price: 12.00 }, { size: "45*32cm", price: 19.00 }, { size: "40*60cm", price: 26.50 }] },
                { name: "Pizza Homestyle", prices: [{ size: "26cm", price: 8.00 }, { size: "30cm", price: 9.50 }, { size: "45*32cm", price: 21.00 }, { size: "40*60cm", price: 27.50 }] },
                { name: "Pizza Della Casa", prices: [{ size: "26cm", price: 8.20 }, { size: "30cm", price: 10.40 }, { size: "45*32cm", price: 20.80 }, { size: "40*60cm", price: 26.90 }] },
                { name: "Pizza UFO", prices: [{ size: "26cm", price: 9.40 }, { size: "30cm", price: 10.60 }, { size: "45*32cm", price: 18.90 }, { size: "40*60cm", price: 26.40 }] },
                { name: "Pizza Spezial", prices: [{ size: "26cm", price: 8.80 }, { size: "30cm", price: 10.10 }, { size: "45*32cm", price: 20.50 }, { size: "40*60cm", price: 26.10 }] },
                { name: "Pizza Hot Dog", prices: [{ size: "26cm", price: 8.40 }, { size: "30cm", price: 10.20 }, { size: "45*32cm", price: 20.90 }, { size: "40*60cm", price: 26.40 }] },
                { name: "Pizza Sucuk", prices: [{ size: "26cm", price: 8.50 }, { size: "30cm", price: 10.50 }, { size: "45*32cm", price: 21.90 }, { size: "40*60cm", price: 27.00 }] },
                { name: "Pizza Hot Beef", prices: [{ size: "26cm", price: 7.90 }, { size: "30cm", price: 10.50 }, { size: "45*32cm", price: 20.50 }, { size: "40*60cm", price: 26.40 }] },
                { name: "Pizza Spinat", prices: [{ size: "26cm", price: 8.50 }, { size: "30cm", price: 9.80 }, { size: "45*32cm", price: 20.90 }, { size: "40*60cm", price: 26.00 }] },
                { name: "Pizza Luna", prices: [{ size: "26cm", price: 8.70 }, { size: "30cm", price: 10.30 }, { size: "45*32cm", price: 21.80 }, { size: "40*60cm", price: 26.20 }] },
                { name: "Pizza Gyros", prices: [{ size: "26cm", price: 9.40 }, { size: "30cm", price: 10.60 }, { size: "45*32cm", price: 20.50 }, { size: "40*60cm", price: 26.90 }] },
                { name: "Extra Zutaten", prices: [{ size: "26cm", price: 1.50 }, { size: "30cm", price: 2.00 }, { size: "45*32cm", price: 3.50 }, { size: "40*60cm", price: 4.00 }] },
                { name: "Käse Rand", prices: [{ size: "26cm", price: 2.00 }, { size: "30cm", price: 2.50 }, { size: "45*32cm", price: 4.00 }, { size: "40*60cm", price: 4.90 }] }
            ]
        },
        {
            name: "Burger 🍔",
            id: "burger",
            items: [
                { name: "Hamburger", price: 5.50 },
                { name: "Cheeseburger", price: 6.00 },
                { name: "Chicken Burger", price: 6.50 },
                { name: "Bacon Burger", price: 7.00 },
                { name: "Champignon Burger", price: 6.50 },
                { name: "Crispy Chicken Burger", price: 7.00 },
                { name: "Italian Burger", price: 6.50 },
                { name: "Jumbo Cheeseburger", price: 8.50 },
                { name: "Jumbo Hamburger", price: 8.00 },
                { name: "Jumbo Chicken Burger", price: 9.00 },
                { name: "Mexico Burger", price: 7.00 },
                { name: "Chili Cheeseburger", price: 6.50 },
                { name: "Menü1: Hamburger", price: 9.00 },
                { name: "Menü2: Cheeseburger", price: 9.50 },
                { name: "Menü3: Jumbo Cheeseburger", price: 11.00 },
                { name: "Menü4: Jumbo Chicken", price: 11.50 }
            ]
        },
        {
            name: "Croque 🥪",
            id: "croque",
            items: [
                { name: "Croque Madame", price: 7.50 },
                { name: "Croque Camembert", price: 8.50 },
                { name: "Croque Schinken", price: 9.00 },
                { name: "Croque Salami Champignons", price: 9.00 },
                { name: "Croque Salami", price: 9.00 },
                { name: "Croque Hawaii", price: 8.50 },
                { name: "Croque Thunfisch", price: 10.00 },
                { name: "Croque Hähnchenbrust", price: 9.00 },
                { name: "Croque Sucuk", price: 8.50 }
            ]
        },
        {
            name: "Salat 🥗",
            id: "salat",
            items: [
                { name: "Gemischter Salat", price: 5.00 },
                { name: "Thunfisch Salat", price: 6.50 },
                { name: "Miista", price: 5.00 },
                { name: "Ma Balla", price: 5.90 },
                { name: "Tonno", price: 6.50 },
                { name: "Scampi", price: 7.50 },
                { name: "Chef", price: 6.50 },
                { name: "Della Casa", price: 7.00 },
                { name: "Guken Salat", price: 7.50 },
                { name: "Gyros", price: 7.50 }
            ]
        },
        {
            name: "Pasta 🍝",
            id: "pasta",
            items: [
                { name: "Alla Panna", price: 7.00 },
                { name: "Carbonara", price: 7.50 },
                { name: "pastore", price: 7.50 },
                { name: "Toscana", price: 7.50 },
                { name: "Alla Milano", price: 8.00 },
                { name: "Italia", price: 8.30 },
                { name: "Della Casa", price: 8.90 },
                { name: "Pesto und Put", price: 8.90 },
                { name: "Bolognese", price: 7.50 },
                { name: "scampi", price: 9.50 },
                { name: "Wunsch", price: 10.00 },
                { name: "Pasta Classico", price: 7.90 },
                { name: "käse überbacken", price: 1.50 }
            ]
        },
        {
            name: "Schnitzel 🥩",
            id: "schnitzel",
            items: [
                { name: "Wiener Schnitzel", price: 9.00 },
                { name: "Jägerschnitzel", price: 10.50 },
                { name: "Zigeunerschnitzel", price: 10.50 },
                { name: "Schnitzel Hollandise", price: 10.50 }
            ]
        },
        {
            name: "Snacks 🍟",
            id: "snacks",
            items: [
                { name: "käsebröchen", price: 5.50 },
                { name: "Pizzabröchen", price: 6.00 },
                { name: "American Piyyabrot", price: 7.50 },
                { name: "Knoblauch Brot", price: 4.00 },
                { name: "käse Knoblauch Brot", price: 5.00 }
            ]
        },
        {
            name: "Beilagen 🍞",
            id: "beilagen",
            items: [
                { name: "Süsskartoffeln-Pommes", price: 4.50 },
                { name: "Chili Cheese Pommes", price: 5.00 },
                { name: "Pommes", price: 3.00 },
                { name: "Country Fries", price: 4.00 },
                { name: "Twister", price: 4.00 },
                { name: "Chili Pommes", price: 5.00 },
                { name: "Kroketten", price: 5.00 },
                { name: "Gegrillte Champignons", price: 4.50 },
                { name: "Gegrilltes Gemüse", price: 5.00 },
                { name: "BBQ Pommes", price: 5.00 },
                { name: "BBQ Twister", price: 5.00 },
                { name: "Chili Twister", price: 5.00 }
            ]
        },
        {
            name: "Fingerfood 🍗",
            id: "fingerfood",
            items: [
                { name: "Chicken Nuggets", prices: [{ size: "6 Stk.", price: 6.50 }, { size: "12 Stk.", price: 8.50 }] },
                { name: "Chicken Wings", prices: [{ size: "6 Stk.", price: 7.00 }, { size: "12 Stk.", price: 10.00 }] },
                { name: "crispy Chicken Fingers", prices: [{ size: "6 Stk.", price: 7.50 }, { size: "12 Stk.", price: 10.00 }] },
                { name: "Chili Cheese Nuggets", prices: [{ size: "6 Stk.", price: 6.50 }, { size: "12 Stk.", price: 8.50 }] },
                { name: "Moyyerella Sticks", prices: [{ size: "6 Stk.", price: 6.50 }, { size: "12 Stk.", price: 8.50 }] },
                { name: "Michbox", price: 17.50 },
                { name: "Curry Wurst", price: 7.90 }
            ]
        },
        {
            name: "Angebote 💥",
            id: "angebote",
            items: [
                { name: "A1 Supper Familienangebot", price: 26.90 },
                { name: "A2 Pizzblech", price: 27.90 },
                { name: "A3 3* Pizza", price: 22.90 }
            ]
        },
        {
            name: "Gyros 🥙",
            id: "gyros",
            items: [
                { name: "Gyros Mista", price: 9.00 },
                { name: "Gyros Italia", price: 10.00 },
                { name: "Gyros Athen", price: 10.50 },
                { name: "Gyros Auflauf", price: 11.50 },
                { name: "Gyros Curry", price: 10.50 },
                { name: "Gyros hot", price: 10.00 }
            ]
        },
        {
            name: "Getränke 🥤",
            id: "getraenke",
            items: [
                { name: "Cola 1Liter", price: 3.00 },
                { name: "Cola 0.33L", price: 2.00 },
                { name: "Redbull", price: 2.50 },
                { name: "Durstlöscher", price: 2.00 },
                { name: "Fanta (0.33l)", price: 2.50 },
                { name: "Wasser (0.5l)", price: 2.00 }
            ]
        },
        {
            name: "Snack Rolls 🌮",
            id: "snackrolls",
            items: [
                { name: "Salami", prices: [{ size: "6 Stück", price: 6.00 }, { size: "12 Stück", price: 10.50 }] },
                { name: "Schinken", prices: [{ size: "6 Stück", price: 6.00 }, { size: "12 Stück", price: 10.50 }] },
                { name: "Thunfisch", prices: [{ size: "6 Stück", price: 6.50 }, { size: "12 Stück", price: 11.00 }] },
                { name: "Hähnchen", prices: [{ size: "6 Stück", price: 6.00 }, { size: "12 Stück", price: 10.50 }] },
                { name: "Puter", prices: [{ size: "6 Stück", price: 6.00 }, { size: "12 Stück", price: 10.50 }] },
                { name: "Hot Chicken", prices: [{ size: "6 Stück", price: 6.50 }, { size: "12 Stück", price: 11.00 }] },
                { name: "Hawaii Roll", price: 6.00 },
                { name: "Überaschung", price: 19.00 },
                { name: "Feuerring", price: 6.80 },
                { name: "Käse Ring+dip", price: 6.00 }
            ]
        }
    ];

    let cart = [];
    let savedInvoices = JSON.parse(localStorage.getItem('savedInvoices')) || [];
    let currentInvoiceData = null;

    const categoryList = document.getElementById('categoryList');
    const currentCategoryTitle = document.getElementById('currentCategoryTitle');
    const menuItemsContainer = document.getElementById('menuItems');
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceSpan = document.getElementById('totalPrice');
    const finalPriceSpan = document.getElementById('finalPrice');
    const deliveryCostsInput = document.getElementById('deliveryCostsInput');
    const newOrderBtn = document.getElementById('newOrderBtn');
    const sendOrderBtn = document.getElementById('sendOrderBtn');
    const savedInvoicesBtn = document.getElementById('savedInvoicesBtn');
    // const payBtn = document.getElementById('payBtn'); // تم إزالة زر الدفع
    const invoiceModal = document.getElementById('invoiceModal');
    const closeModalBtn = invoiceModal ? invoiceModal.querySelector('.close-button') : null;
    const invoiceDetails = document.getElementById('invoiceDetails');
    const printInvoiceBtn = document.getElementById('printInvoiceBtn');
    const savePdfBtn = document.getElementById('savePdfBtn');
    const saveInvoiceBtn = document.getElementById('saveInvoiceBtn');
    const savedInvoicesModal = document.getElementById('savedInvoicesModal');
    const closeSavedInvoicesBtn = document.getElementById('closeSavedInvoices');
    const savedInvoicesList = document.getElementById('savedInvoicesList');
    
    console.log('DOMContentLoaded event fired');
    console.log('DOM Elements loaded:', { 
        categoryList: categoryList ? 'found' : 'NULL', 
        menuItemsContainer: menuItemsContainer ? 'found' : 'NULL',
        invoiceModal: invoiceModal ? 'found' : 'NULL',
        i18n: typeof i18n !== 'undefined' ? 'loaded' : 'NOT LOADED'
    });

    // Check for critical elements
    if (!categoryList || !menuItemsContainer) {
        console.error('CRITICAL: Required DOM elements not found!', {
            categoryList: !!categoryList,
            menuItemsContainer: !!menuItemsContainer
        });
        return;
    }

    // Render Categories
    function renderCategories() {
        console.log('🔍 renderCategories called');
        if (!categoryList) {
            console.error('❌ categoryList is null, cannot render categories');
            return;
        }
        
        if (!categoriesData || categoriesData.length === 0) {
            console.error('❌ categoriesData is empty');
            console.log('Available data:', { categoriesData });
            return;
        }
        
        categoryList.innerHTML = '';
        console.log(`✅ Rendering ${categoriesData.length} categories:`, categoriesData.map(c => c.name));
        
        categoriesData.forEach((category, index) => {
            try {
                const li = document.createElement('li');
                const categoryName = (typeof i18n !== 'undefined' && i18n.getCategoryName) 
                    ? i18n.getCategoryName(category.name) 
                    : category.name;
                li.innerHTML = `<span>${categoryName}</span>`;
                li.dataset.categoryId = category.id;
                li.style.animationDelay = `${index * 0.05}s`;
                li.classList.add('category-item');
                li.addEventListener('click', () => {
                    console.log(`📍 Clicked category: ${category.name}`);
                    // Remove active class from all categories
                    document.querySelectorAll('.category-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    // Add active class to selected category
                    li.classList.add('active');
                    selectCategory(category);
                });
                categoryList.appendChild(li);
                console.log(`✅ Category ${index + 1}: ${categoryName} added`);
            } catch (error) {
                console.error(`❌ Error rendering category ${category.name}:`, error);
            }
        });
        console.log('✅ Categories rendered successfully');
    }

    // Update Menu Display when language changes
    window.updateMenuDisplay = function() {
        renderCategories();
        currentCategoryTitle.innerHTML = `<i class="fas fa-utensils"></i> <span>${i18n.t('selectCategory')}</span>`;
        // Re-render current category to update translations
        if (menuItemsContainer.innerHTML.trim() !== '') {
            const currentCategoryEl = document.querySelector('.category-item.active');
            if (currentCategoryEl) {
                const categoryId = currentCategoryEl.dataset.categoryId;
                const category = categoriesData.find(c => c.id === categoryId);
                if (category) {
                    selectCategory(category);
                }
            }
        }
        renderCart();
        
        // Update voice language when main language changes
        if (recognition) {
            const currentLang = i18n.currentLanguage;
            voiceLanguage = currentLang === 'ar' ? 'ar-SA' : 'de-DE';
            localStorage.setItem('voiceLanguage', voiceLanguage);
            recognition.lang = voiceLanguage;
            console.log('Voice language updated to:', voiceLanguage);
        }
    };

    // Update Cart Display when language changes
    window.updateCartDisplay = function() {
        renderCart();
    };

    // Select Category and Render Menu Items
    function selectCategory(category) {
        console.log(`🎯 selectCategory called with:`, category);
        if (!category) {
            console.error('❌ selectCategory: category is null or undefined');
            return;
        }
        const categoryName = i18n.getCategoryName(category.name);
        console.log(`✅ selectCategory: categoryName = ${categoryName}`);
        currentCategoryTitle.innerHTML = `<i class="fas fa-utensils"></i> <span>${categoryName}</span>`;
        
        // Update pizza category reference and show/hide search container
        const searchContainer = document.getElementById('searchContainer');
        const pizzaSearch = document.getElementById('pizzaSearch');
        if (category.id === 'pizza') {
            window.updateCurrentPizzaCategory(category);
            searchContainer.style.display = 'flex';
            pizzaSearch.value = ''; // Clear search
            setTimeout(() => pizzaSearch.focus(), 100);
        } else {
            searchContainer.style.display = 'none';
            pizzaSearch.value = '';
        }
        
        menuItemsContainer.innerHTML = '';
        renderCategoryItems(category, category.items);
    }

    // Render Category Items (with filter support for search)
    function renderCategoryItems(category, items) {
        console.log(`📦 renderCategoryItems called for category: ${category.name}, items count: ${items.length}`);
        menuItemsContainer.innerHTML = '';
        items.forEach((item, itemIndex) => {
            try {
                const div = document.createElement('div');
                div.classList.add('menu-item');
                let priceHtml = '';
                // Get translated product name
                let translatedProductName = item.name; // Start with original name
                
                // If Arabic, look up the translation from i18n
                if (i18n.currentLanguage === 'ar') {
                    // Look up in i18n.translations.ar
                    translatedProductName = i18n.translations.ar[item.name] || item.name;
                }
                // If German, keep the original name (no translation)
                if ((category.id === 'pizza' || category.id === 'fingerfood' || category.id === 'snackrolls') && item.prices) {
                    priceHtml = item.prices.map(p => {
                        let displaySize = p.size;
                        // Translate size for fingerfood
                        if (category.id === 'fingerfood') {
                            if (p.size === '6 Stk.' && i18n.currentLanguage === 'ar') {
                                displaySize = i18n.t('inchArabic');
                            } else if (p.size === '12 Stk.' && i18n.currentLanguage === 'ar') {
                                displaySize = i18n.t('inch12Arabic');
                            }
                        }
                        return `<button class="pizza-size-btn" data-size="${p.size}" data-price="${p.price.toFixed(2)}">${displaySize}: ${p.price.toFixed(2)}€</button>`;
                    }).join('');
                    div.innerHTML = `
                        <h3>${translatedProductName}</h3>
                        <div class="pizza-prices">${priceHtml}</div>
                    `;
                    div.querySelectorAll('.pizza-size-btn').forEach(button => {
                        button.addEventListener('click', (event) => {
                            event.stopPropagation(); // Prevent category click
                            const selectedPrice = parseFloat(event.target.dataset.price);
                            const selectedSize = event.target.dataset.size;
                            console.log(`🛒 Pizza item clicked: ${translatedProductName} (${selectedSize})`);
                            addItemToCart({ name: `${translatedProductName} (${selectedSize})`, price: selectedPrice });
                        });
                    });
                } else {
                    div.innerHTML = `
                        <h3>${translatedProductName}</h3>
                        <p>${item.price.toFixed(2)}€</p>
                    `;
                    div.addEventListener('click', () => {
                        console.log(`🛒 Regular item clicked: ${translatedProductName}`);
                        addItemToCart({ name: translatedProductName, price: item.price });
                    });
                }
                menuItemsContainer.appendChild(div);
                console.log(`✅ Item ${itemIndex + 1}: ${translatedProductName} added`);
            } catch (error) {
                console.error(`❌ Error rendering item ${item.name}:`, error);
            }
        });
        console.log(`✅ ${items.length} category items rendered successfully`);
    }

    // Add Item to Cart
    function addItemToCart(item) {
        // Check if item with same name already exists
        const existingItem = cart.find(cartItem => cartItem.name === item.name && cartItem.price === item.price);
        
        if (existingItem) {
            // Increase quantity if item exists
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            // Add new item with quantity 1
            item.quantity = 1;
            cart.push(item);
        }
        renderCart();
        calculateTotals();
    }

    // Increase Item Quantity
    function increaseQuantity(index) {
        if (cart[index]) {
            cart[index].quantity = (cart[index].quantity || 1) + 1;
            renderCart();
            calculateTotals();
        }
    }

    // Decrease Item Quantity
    function decreaseQuantity(index) {
        if (cart[index]) {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                // Remove item if quantity reaches 0
                cart.splice(index, 1);
            }
            renderCart();
            calculateTotals();
        }
    }

    // Remove Item from Cart
    function removeItemFromCart(index) {
        cart.splice(index, 1);
        renderCart();
        calculateTotals();
    }

    // Render Cart Items
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p style="text-align: center; color: #777; padding: 20px;"><i class="fas fa-shopping-basket" style="font-size: 24px; margin-bottom: 10px; display: block;"></i> ${i18n.t('noItemsInCart')}</p>`;
            return;
        }
        cart.forEach((item, index) => {
            const quantity = item.quantity || 1;
            const itemTotal = (item.price * quantity).toFixed(2);
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="cart-item-details">
                    <div>
                        <span class="item-name">${item.name}</span>
                        <span class="item-price">${item.price.toFixed(2)}€</span>
                    </div>
                    <div class="quantity-controls">
                        <button class="qty-btn qty-decrease" data-index="${index}">−</button>
                        <span class="qty-display">${quantity}</span>
                        <button class="qty-btn qty-increase" data-index="${index}">+</button>
                        <span class="qty-total">${itemTotal}€</span>
                    </div>
                </div>
                <button class="remove-item-btn" data-index="${index}"><i class="fas fa-trash-alt"></i> ${i18n.t('removeItem')}</button>
            `;
            cartItemsContainer.appendChild(li);
        });

        document.querySelectorAll('.qty-increase').forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const index = parseInt(event.target.dataset.index);
                increaseQuantity(index);
            });
        });

        document.querySelectorAll('.qty-decrease').forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const index = parseInt(event.target.dataset.index);
                decreaseQuantity(index);
            });
        });

        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = parseInt(event.target.dataset.index);
                removeItemFromCart(index);
            });
        });
    }

    // Calculate Totals
    function calculateTotals() {
        const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        const deliveryCostsValue = deliveryCostsInput.value.trim();
        const deliveryCosts = deliveryCostsValue === '' ? 0 : parseFloat(deliveryCostsValue) || 0;
        const finalTotal = total + deliveryCosts;

        totalPriceSpan.textContent = `${total.toFixed(2)}€`;
        finalPriceSpan.textContent = `${finalTotal.toFixed(2)}€`;
    }

    // Pizza Search Functionality
    const pizzaSearch = document.getElementById('pizzaSearch');
    let currentPizzaCategory = null;

    // Update currentPizzaCategory when pizza category is selected
    window.updateCurrentPizzaCategory = function(category) {
        if (category.id === 'pizza') {
            currentPizzaCategory = category;
        }
    };

    pizzaSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        // Get pizza category from categoriesData
        if (!currentPizzaCategory) {
            currentPizzaCategory = categoriesData.find(cat => cat.id === 'pizza');
        }

        if (!currentPizzaCategory) return;

        // Filter pizzas based on search term
        let filteredPizzas = currentPizzaCategory.items;
        if (searchTerm) {
            filteredPizzas = currentPizzaCategory.items.filter(pizza => {
                const pizzaName = pizza.name.toLowerCase();
                const translatedName = (i18n.translations.ar && i18n.translations.ar[pizza.name]) ? 
                    i18n.translations.ar[pizza.name].toLowerCase() : '';
                
                return pizzaName.includes(searchTerm) || translatedName.includes(searchTerm);
            });
        }

        // Re-render items with filtered results
        renderCategoryItems(currentPizzaCategory, filteredPizzas);

        // Show "no results" message if needed
        if (filteredPizzas.length === 0 && searchTerm) {
            menuItemsContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px; color: #999;">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px; display: block; opacity: 0.5;"></i>
                    <p>${i18n.currentLanguage === 'ar' ? 'لم يتم العثور على نتائج' : 'Keine Ergebnisse gefunden'}</p>
                </div>
            `;
        }
    });

    // New Order
    newOrderBtn.addEventListener('click', () => {
        cart = [];
        renderCart();
        calculateTotals();
        currentCategoryTitle.innerHTML = `<i class="fas fa-utensils"></i> <span>${i18n.t('selectCategory')}</span>`;
        menuItemsContainer.innerHTML = '';
    });

    // Close Modal
    closeModalBtn.addEventListener('click', () => {
        invoiceModal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            invoiceModal.style.display = 'none';
        }, 300);
    });

    window.addEventListener('click', (event) => {
        if (event.target === invoiceModal) {
            invoiceModal.style.display = 'none';
        }
    });

    // Print Invoice
    printInvoiceBtn.addEventListener('click', () => {
        const printContent = invoiceDetails.innerHTML;
        const originalContent = document.body.innerHTML;

        // إنشاء ورقة أنماط للطباعة
        const printStyles = `
            <style>
                @media print {
                    @page {
                        size: A4;
                        margin: 1cm;
                    }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        margin: 0;
                        padding: 20px;
                        color: #333;
                        line-height: 1.5;
                    }
                    .invoice-container {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    }
                    h3 {
                        text-align: center;
                        margin-bottom: 25px;
                        color: #2c3e50;
                        font-size: 28px;
                        font-weight: bold;
                    }
                    p {
                        margin: 8px 0;
                        font-size: 16px;
                    }
                    hr {
                        border: 0;
                        height: 1px;
                        background-color: #ddd;
                        margin: 15px 0;
                    }
                    .invoice-item {
                        display: flex;
                        justify-content: space-between;
                        padding: 8px 0;
                        font-size: 16px;
                        border-bottom: 1px dashed #eee;
                    }
                    .invoice-item:last-of-type {
                        border-bottom: none;
                    }
                    .invoice-total {
                        font-weight: bold;
                        font-size: 18px;
                        margin-top: 15px;
                        padding-top: 10px;
                        display: flex;
                        justify-content: space-between;
                        border-top: 2px solid #333;
                    }
                    h4 {
                        font-size: 20px;
                        color: #2c3e50;
                        margin-top: 20px;
                        margin-bottom: 15px;
                    }
                }
            </style>
        `;

        // إنشاء محتوى الطباعة
        const printDocument = `
            <html>
            <head>
                <title>Rechnung</title>
                ${printStyles}
            </head>
            <body>
                <div class="invoice-container">
                    ${printContent}
                </div>
            </body>
            </html>
        `;

        // فتح نافذة جديدة للطباعة
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printDocument);
        printWindow.document.close();

        // انتظار تحميل المحتوى قبل الطباعة
        printWindow.onload = function() {
            printWindow.print();
            printWindow.close();
        };
    });

    // Save as PDF (Browser's print to PDF functionality)
    savePdfBtn.addEventListener('click', () => {
        alert(i18n.t('pdfInstructions'));
        printInvoiceBtn.click(); // Trigger print to open print dialog
    });

    // تم إزالة وظيفة زر الدفع


    // Event listener for delivery costs input
    deliveryCostsInput.addEventListener('input', calculateTotals);

    // ========== VOICE RECOGNITION FUNCTIONALITY ==========
    const voiceBtn = document.getElementById('voiceBtn');
    let isListening = false;
    let permissionGranted = localStorage.getItem('microphonePermissionGranted') === 'true';
    let voiceLanguage = localStorage.getItem('voiceLanguage') || 'ar-SA'; // Default to Arabic
    
    // Initialize Web Speech API
    const webSpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    
    if (webSpeechRecognition) {
        recognition = new webSpeechRecognition();
        // Support both Arabic and English for better recognition
        recognition.lang = voiceLanguage; // Can be 'ar-SA' or 'en-US'
        recognition.continuous = false;
        recognition.interimResults = true; // Show interim results
        recognition.maxAlternatives = 5; // Get multiple results for better matching
        
        // Increase listening time
        recognition.maxSpeechStart = 10000; // 10 seconds to start speaking
        recognition.maxSilenceStart = 5000; // 5 seconds of silence is acceptable
        
        // ===== SET UP RECOGNITION EVENT HANDLERS (ONCE) =====
        recognition.onstart = () => {
            console.log('🎤 Voice recognition started - listening now...');
        };
        
        recognition.onresult = (event) => {
            console.log('📝 Recognition result received:', event.results.length, 'results');
            let transcript = '';
            let allTranscripts = []; // Try all available results
            let isFinal = false;
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                isFinal = result.isFinal;
                
                console.log(`  Result ${i}: "${result[0].transcript}" (confidence: ${result[0].confidence.toFixed(2)})`);
                
                // Get the primary result
                if (i === event.resultIndex) {
                    transcript += result[0].transcript;
                }
                // Collect all alternatives for fallback matching
                if (result[0]) {
                    allTranscripts.push(result[0].transcript);
                }
                // Also try other alternatives if available
                if (result[1]) {
                    allTranscripts.push(result[1].transcript);
                }
            }
            
            console.log('📢 Transcript:', transcript, '(Final:', isFinal, ')');
            console.log('🔄 Alternatives:', allTranscripts);
            
            if (transcript && isFinal) {
                // Try primary transcript first, then alternatives
                handleVoiceInput(transcript, allTranscripts);
            }
        };
        
        recognition.onerror = (event) => {
            let errorMsg = 'فشل التعرف على الصوت';
            if (event.error === 'no-speech') {
                errorMsg = '❌ لم يتم التقاط صوت - تأكد من الميكروفون والقرب من الجهاز';
            } else if (event.error === 'network') {
                errorMsg = '❌ خطأ في الاتصال';
            } else if (event.error === 'not-allowed') {
                errorMsg = '❌ الرجاء السماح بالوصول إلى الميكروفون من إعدادات المتصفح';
            } else if (event.error === 'audio-capture') {
                errorMsg = '❌ لا يمكن الوصول إلى الميكروفون - هل تم رفض الإذن؟';
            } else if (event.error === 'network-timeout') {
                errorMsg = '❌ انقطع الاتصال - حاول مرة أخرى';
            }
            console.error('❌ Recognition error:', event.error);
            showVoiceNotification(errorMsg, 'error');
        };
        
        recognition.onend = () => {
            console.log('✓ Voice recognition ended');
            voiceBtn.classList.remove('listening');
            isListening = false;
        };
    }
    
    // Note: Web Speech API will handle microphone permission directly
    // No need for explicit getUserMedia call on local files
    
    voiceBtn.addEventListener('click', async () => {
        try {
            if (isListening) {
                // Stop listening
                if (recognition) {
                    recognition.stop();
                }
                isListening = false;
                voiceBtn.classList.remove('listening');
            } else {
                // Check if browser supports Web Speech API
                if (!recognition) {
                    showVoiceNotification('المتصفح لا يدعم التعرف على الكلام', 'error');
                    return;
                }
                
                // Request microphone permission first
                console.log('🎤 Requesting microphone permission...');
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    console.log('✓ Microphone permission granted');
                    // Close the stream - we only needed to check permission
                    stream.getTracks().forEach(track => track.stop());
                } catch (permError) {
                    console.error('❌ Microphone permission denied:', permError);
                    showVoiceNotification('❌ الرجاء السماح بالوصول إلى الميكروفون', 'error');
                    return;
                }
                
                // Update recognition language in case it changed
                recognition.lang = voiceLanguage;
                
                // Start listening
                isListening = true;
                voiceBtn.classList.add('listening');
                let listeningMsg = i18n.t('voiceListeningMsg');
                let langIndicator = voiceLanguage === 'ar-SA' ? ' (العربية)' : ' (Deutsch)';
                showVoiceNotification(listeningMsg + langIndicator, 'info');
                
                console.log('🎤 Starting voice recognition with language:', voiceLanguage);
                recognition.start();
            }
        } catch (error) {
            console.error('❌ Voice recognition error:', error);
            let errorMsg = `❌ خطأ: ${error.message || 'فشل التعرف على الصوت'}`;
            showVoiceNotification(errorMsg, 'error');
            voiceBtn.classList.remove('listening');
            isListening = false;
        }
    });
    
    // Arabic to English product name translation
    const arabicProductTranslation = {
        // ===== PIZZA =====
        'ميلانو': 'Milano',
        'ميلان': 'Milano',
        'ميلان بيتزا': 'Milano',
        'بيتزا ميلانو': 'Milano',
        'مارجريتا': 'Margherita',
        'مارجريتة': 'Margherita',
        'مرغريتا': 'Margherita',
        'مرغريتة': 'Margherita',
        'ماركاريتا': 'Margherita',
        'بيتزا مارجريتا': 'Margherita',
        'موتزاريلا': 'Mozzarella',
        'موزاريلا': 'Mozzarella',
        'مرتزاريلا': 'Mozzarella',
        'بيتزا موتزاريلا': 'Mozzarella',
        'فورماجي': 'Formaggi',
        'فورما': 'Formaggi',
        'بيتزا فورماجي': 'Formaggi',
        'فنجي': 'Fungi',
        'الفنجي': 'Fungi',
        'الفطر': 'Fungi',
        'فطر': 'Fungi',
        'بيتزا فنجي': 'Fungi',
        'سلامي': 'Salami',
        'السلامي': 'Salami',
        'بيتزا سلامي': 'Salami',
        'بروشوتو': 'Prosciutto',
        'البروشوتو': 'Prosciutto',
        'شينكن': 'Prosciutto',
        'بيتزا بروشوتو': 'Prosciutto',
        'سلامي فنجي': 'Salami Fungi',
        'فنجي سلامي': 'Salami Fungi',
        'بيتزا سلامي فنجي': 'Salami Fungi',
        'بروشوتو فنجي': 'Prosciutto Fungi',
        'فنجي بروشوتو': 'Prosciutto Fungi',
        'بيتزا بروشوتو فنجي': 'Prosciutto Fungi',
        'بروشوتو سلامي': 'Prosciutto Salami',
        'سلامي بروشوتو': 'Prosciutto Salami',
        'بيتزا بروشوتو سلامي': 'Prosciutto Salami',
        'إيطاليا': 'Italia',
        'بيتزا إيطاليا': 'Italia',
        'كابري': 'Capri',
        'بيتزا كابري': 'Capri',
        'سانتوريني': 'Santorini',
        'بيتزا سانتوريني': 'Santorini',
        'إيلو': 'Ilo',
        'بيتزا إيلو': 'Ilo',
        'هاواي': 'Hawaii',
        'بيتزا هاواي': 'Hawaii',
        'تونو': 'Tonno',
        'بيتزا تونو': 'Tonno',
        'مدريدي': 'Madridi',
        'بيتزا مدريدي': 'Madridi',
        'إسكامبي': 'Scampi',
        'بيتزا إسكامبي': 'Scampi',
        'فروتي ماري': 'Frutti de Mare',
        'فروتي': 'Frutti de Mare',
        'بيتزا فروتي': 'Frutti de Mare',
        'فيجي': 'Veggie',
        'بيتزا فيجي': 'Veggie',
        'خضار': 'Veggie',
        'بيتزا خضار': 'Veggie',
        'باليرمو': 'Palermo',
        'بيتزا باليرمو': 'Palermo',
        'هاهنشن': 'Hähnchenbrust',
        'دجاج': 'Hähnchenbrust',
        'بيتزا دجاج': 'Hähnchenbrust',
        'كلاسيكو': 'Classico',
        'بيتزا كلاسيكو': 'Classico',
        'ميامي': 'Miami',
        'بيتزا ميامي': 'Miami',
        'آيلاند': 'Island',
        'بيتزا آيلاند': 'Island',
        'باريس': 'Paris',
        'بيتزا باريس': 'Paris',
        'روكولا': 'Rucola',
        'بيتزا روكولا': 'Rucola',
        'بيكون': 'Bacon',
        'بيتزا بيكون': 'Bacon',
        'تشكن كاري': 'Chicken Curry',
        'كاري تشكن': 'Chicken Curry',
        'بيتزا كاري': 'Chicken Curry',
        'إسطنبول': 'Istanbul',
        'بيتزا إسطنبول': 'Istanbul',
        'هوت سلامي': 'Hot Salami',
        'سلامي هوت': 'Hot Salami',
        'بيتزا هوت سلامي': 'Hot Salami',
        'إمارة': 'Emira',
        'بيتزا إمارة': 'Emira',
        'وانش': 'Wunsch',
        'بيتزا وانش': 'Wunsch',
        'هوم ستايل': 'Pizza Homestyle',
        'هومستايل': 'Pizza Homestyle',
        'هوم': 'Pizza Homestyle',
        'ديلا كاسا': 'Pizza Della Casa',
        'ديلا': 'Pizza Della Casa',
        'كاسا': 'Pizza Della Casa',
        'يوفو': 'Pizza UFO',
        'بيتزا يوفو': 'Pizza UFO',
        'سبيشال': 'Pizza Spezial',
        'بيتزا سبيشال': 'Pizza Spezial',
        'هوت دوغ': 'Pizza Hot Dog',
        'دوغ هوت': 'Pizza Hot Dog',
        'بيتزا هوت دوغ': 'Pizza Hot Dog',
        'سوجوك': 'Pizza Sucuk',
        'بيتزا سوجوك': 'Pizza Sucuk',
        'هوت بيف': 'Pizza Hot Beef',
        'بيف هوت': 'Pizza Hot Beef',
        'بيتزا هوت بيف': 'Pizza Hot Beef',
        'سبانخ': 'Pizza Spinat',
        'بيتزا سبانخ': 'Pizza Spinat',
        'لونا': 'Pizza Luna',
        'بيتزا لونا': 'Pizza Luna',
        'جيروس': 'Pizza Gyros',
        'بيتزا جيروس': 'Pizza Gyros',
        'زيادة': 'Extra Zutaten',
        'إضافية': 'Extra Zutaten',
        'جبنة رند': 'Käse Rand',
        'رند جبنة': 'Käse Rand',
        'رند': 'Käse Rand',
        
        // ===== BURGER =====
        'هامبرجر': 'Hamburger',
        'تشيز برجر': 'Cheeseburger',
        'شيز برجر': 'Cheeseburger',
        'برجر تشيز': 'Cheeseburger',
        'برجر شيز': 'Cheeseburger',
        'تشكن برجر': 'Chicken Burger',
        'دجاج برجر': 'Chicken Burger',
        'برجر تشكن': 'Chicken Burger',
        'برجر دجاج': 'Chicken Burger',
        'برجر الدجاج': 'Chicken Burger',
        'بيكون برجر': 'Bacon Burger',
        'برجر بيكون': 'Bacon Burger',
        'شامبينيون برجر': 'Champignon Burger',
        'مشروم برجر': 'Champignon Burger',
        'برجر شامبينيون': 'Champignon Burger',
        'برجر مشروم': 'Champignon Burger',
        'كريسبي تشكن': 'Crispy Chicken Burger',
        'إيطالي برجر': 'Italian Burger',
        'برجر إيطالي': 'Italian Burger',
        'جمبو تشيز': 'Jumbo Cheeseburger',
        'جمبو هامبرجر': 'Jumbo Hamburger',
        'جمبو تشكن': 'Jumbo Chicken Burger',
        'ميكسيكو برجر': 'Mexico Burger',
        'برجر ميكسيكو': 'Mexico Burger',
        'تشيلي تشيز': 'Chili Cheeseburger',
        'برجر تشيلي': 'Chili Cheeseburger',
        
        // ===== CROQUE =====
        'كروك': 'Croque',
        'كروك مدام': 'Croque Madame',
        'مدام كروك': 'Croque Madame',
        'كروك كاممبير': 'Croque Camembert',
        'كاممبير كروك': 'Croque Camembert',
        'كروك شينكن': 'Croque Schinken',
        'شينكن كروك': 'Croque Schinken',
        'كروك سلامي': 'Croque Salami',
        'سلامي كروك': 'Croque Salami',
        'كروك هاواي': 'Croque Hawaii',
        'هاواي كروك': 'Croque Hawaii',
        'كروك تونة': 'Croque Thunfisch',
        'تونة كروك': 'Croque Thunfisch',
        'كروك دجاج': 'Croque Hähnchenbrust',
        'دجاج كروك': 'Croque Hähnchenbrust',
        'كروك سوجوك': 'Croque Sucuk',
        'سوجوك كروك': 'Croque Sucuk',
        
        // ===== SALAD =====
        'سلطة مختلطة': 'Gemischter Salat',
        'مختلطة سلطة': 'Gemischter Salat',
        'سلطة': 'Salat',
        'سلطة تونة': 'Thunfisch Salat',
        'تونة سلطة': 'Thunfisch Salat',
        'ميستا': 'Miista',
        'سلطة ميستا': 'Miista',
        'ما بلا': 'Ma Balla',
        'سلطة ما بلا': 'Ma Balla',
        'توننو': 'Tonno',
        'إسكامبي': 'Scampi',
        'شيف': 'Chef',
        'سلطة شيف': 'Chef',
        'ديلا كاسا': 'Della Casa',
        'جوكن سلطة': 'Guken Salat',
        'سلطة جوكن': 'Guken Salat',
        'جيروس': 'Gyros',
        'سلطة جيروس': 'Gyros',
        
        // ===== PASTA =====
        'باستا': 'Pasta',
        'ألا بانا': 'Alla Panna',
        'بانا ألا': 'Alla Panna',
        'كاربونارا': 'Carbonara',
        'باستوري': 'pastore',
        'توسكانا': 'Toscana',
        'ألا ميلانو': 'Alla Milano',
        'ميلانو ألا': 'Alla Milano',
        'إيطاليا': 'Italia',
        'ديلا كاسا': 'Della Casa',
        'كاسا ديلا': 'Della Casa',
        'بيستو': 'Pesto',
        'باستا بيستو': 'Pesto',
        'بولونيز': 'Bolognese',
        'باستا بولونيز': 'Bolognese',
        'سكامبي': 'scampi',
        'باستا سكامبي': 'scampi',
        'وانش': 'Wunsch',
        'باستا وانش': 'Wunsch',
        'باستا كلاسيكو': 'Pasta Classico',
        'كلاسيكو باستا': 'Pasta Classico',
        'كاسي': 'käse überbacken',
        'باستا كاسي': 'käse überbacken',
        'جبن مشوي': 'käse überbacken',
        'باستا جبن': 'käse überbacken',
        
        // ===== SCHNITZEL =====
        'شنتزل': 'Schnitzel',
        'شنتزل فيينر': 'Wiener Schnitzel',
        'فيينر شنتزل': 'Wiener Schnitzel',
        'جاغر شنتزل': 'Jägerschnitzel',
        'شنتزل جاغر': 'Jägerschnitzel',
        'زيجونر': 'Zigeunerschnitzel',
        'شنتزل زيجونر': 'Zigeunerschnitzel',
        'شنتزل هولندايز': 'Schnitzel Hollandise',
        'هولندايز شنتزل': 'Schnitzel Hollandise',
        
        // ===== SNACKS =====
        'كاسي رولز': 'käsebröchen',
        'رولز كاسي': 'käsebröchen',
        'بيتزا رولز': 'Pizzabröchen',
        'رولز بيتزا': 'Pizzabröchen',
        'أمريكي': 'American Piyyabrot',
        'ثوم خبز': 'Knoblauch Brot',
        'خبز ثوم': 'Knoblauch Brot',
        'كاسي ثوم خبز': 'käse Knoblauch Brot',
        'كاسي خبز ثوم': 'käse Knoblauch Brot',
        'خبز ثوم كاسي': 'käse Knoblauch Brot',
        
        // ===== SIDES (BEILAGEN) =====
        'بطاطا حلوة': 'Süsskartoffeln-Pommes',
        'حلوة بطاطا': 'Süsskartoffeln-Pommes',
        'تشيلي تشيز بطاطس': 'Chili Cheese Pommes',
        'تشيز تشيلي بطاطس': 'Chili Cheese Pommes',
        'بطاطس تشيلي تشيز': 'Chili Cheese Pommes',
        'بطاطس': 'Pommes',
        'فرايز': 'Pommes',
        'كانتري فرايز': 'Country Fries',
        'فرايز كانتري': 'Country Fries',
        'تويستر': 'Twister',
        'تشيلي بطاطس': 'Chili Pommes',
        'بطاطس تشيلي': 'Chili Pommes',
        'كروكيت': 'Kroketten',
        'مشروم مشوي': 'Gegrillte Champignons',
        'مشوي مشروم': 'Gegrillte Champignons',
        'خضار مشوي': 'Gegrilltes Gemüse',
        'مشوي خضار': 'Gegrilltes Gemüse',
        'بيبيكيو بطاطس': 'BBQ Pommes',
        'بطاطس بيبيكيو': 'BBQ Pommes',
        'بيبيكيو تويستر': 'BBQ Twister',
        'تويستر بيبيكيو': 'BBQ Twister',
        'بيبيكيو تشيلي': 'Chili Twister',
        'تشيلي بيبيكيو': 'Chili Twister',
        
        // ===== FINGERFOOD =====
        'ناجتس': 'Chicken Nuggets',
        'تشكن ناجتس': 'Chicken Nuggets',
        'ناجتس تشكن': 'Chicken Nuggets',
        'أجنحة': 'Chicken Wings',
        'تشكن وينجز': 'Chicken Wings',
        'وينجز تشكن': 'Chicken Wings',
        'فينجرز': 'crispy Chicken Fingers',
        'تشكن فينجرز': 'crispy Chicken Fingers',
        'فينجرز تشكن': 'crispy Chicken Fingers',
        'تشيلي تشيز ناجتس': 'Chili Cheese Nuggets',
        'تشيز تشيلي ناجتس': 'Chili Cheese Nuggets',
        'ناجتس تشيلي تشيز': 'Chili Cheese Nuggets',
        'موتزاريلا': 'Moyyerella Sticks',
        'موتزاريلا ستيكس': 'Moyyerella Sticks',
        'ستيكس موتزاريلا': 'Moyyerella Sticks',
        'ميش بوكس': 'Michbox',
        'كاري': 'Curry Wurst',
        'كاري وورست': 'Curry Wurst',
        'وورست كاري': 'Curry Wurst',
        
        // ===== OFFERS (ANGEBOTE) =====
        'عرض عائلي': 'A1 Supper Familienangebot',
        'عائلي عرض': 'A1 Supper Familienangebot',
        'بيتزا صفيحة': 'A2 Pizzblech',
        'صفيحة بيتزا': 'A2 Pizzblech',
        'ثلاث بيتزا': 'A3 3* Pizza',
        'بيتزا ثلاث': 'A3 3* Pizza',
        
        // ===== GYROS =====
        'جيروس ميستا': 'Gyros Mista',
        'ميستا جيروس': 'Gyros Mista',
        'جيروس إيطاليا': 'Gyros Italia',
        'إيطاليا جيروس': 'Gyros Italia',
        'جيروس أثينا': 'Gyros Athen',
        'أثينا جيروس': 'Gyros Athen',
        'جيروس أوفلاوف': 'Gyros Auflauf',
        'أوفلاوف جيروس': 'Gyros Auflauf',
        'جيروس كاري': 'Gyros Curry',
        'كاري جيروس': 'Gyros Curry',
        'جيروس هوت': 'Gyros hot',
        'هوت جيروس': 'Gyros hot',
        
        // ===== DRINKS (GETRÄNKE) =====
        'كولا': 'Cola',
        'كولا لتر': 'Cola 1Liter',
        'لتر كولا': 'Cola 1Liter',
        'كولا لتر واحد': 'Cola 1Liter',
        'لتر واحد كولا': 'Cola 1Liter',
        'كولا ثلث': 'Cola 0.33L',
        'ثلث كولا': 'Cola 0.33L',
        'ريد بول': 'Redbull',
        'دورست': 'Durstlöscher',
        'فانتا': 'Fanta',
        'ماء': 'Wasser',
        'ماء نصف': 'Wasser (0.5l)',
        'نصف ماء': 'Wasser (0.5l)'
    };
    
    // Handle voice input with size detection
    function handleVoiceInput(transcript, alternatives = []) {
        transcript = transcript.trim();
        // For non-Arabic text, convert to lowercase for better matching
        const transcriptLower = transcript.toLowerCase();
        console.log('===== handleVoiceInput CALLED =====');
        console.log('Voice input:', transcript);
        console.log('Alternatives:', alternatives);
        
        // DEBUG: Check if categoriesData is accessible
        if (!categoriesData || categoriesData.length === 0) {
            console.error('❌ ERROR: categoriesData is not accessible!', categoriesData);
            showVoiceNotification('خطأ: لا يمكن الوصول إلى قائمة المنتجات', 'error');
            return;
        }
        console.log('✓ categoriesData accessible. Number of categories:', categoriesData.length);
        
        // Try main transcript first, then alternatives
        let allTranscriptsToTry = [transcript, ...alternatives].filter(t => t && t.trim());
        
        // Map size keywords (Arabic + German) to prices index - ordered by priority
        const sizeKeywords = [
            // Large sizes (40*60cm) - Party/Family size
            { keyword: 'parte', index: 3 },      // German
            { keyword: 'part', index: 3 },       // German
            { keyword: 'بارتي', index: 3 },      // Arabic
            { keyword: 'عائلي', index: 3 },      // Arabic "family"
            { keyword: 'عملاق', index: 3 },      // Arabic "giant"
            { keyword: 'ستين', index: 3 },      // Arabic 60
            { keyword: '60', index: 3 },         // Numeric
            
            // XL sizes (45*32cm)
            { keyword: 'gross', index: 2 },      // German
            { keyword: 'großer', index: 2 },     // German
            { keyword: 'كبير', index: 2 },       // Arabic "large"
            { keyword: 'لارج', index: 2 },       // Arabic "large"
            { keyword: 'خمسة وأربعين', index: 2 }, // Arabic 45
            { keyword: '45', index: 2 },         // Numeric
            
            // Medium sizes (30cm)
            { keyword: 'mete', index: 1 },       // German
            { keyword: 'mittel', index: 1 },     // German
            { keyword: 'medium', index: 1 },     // English
            { keyword: 'وسط', index: 1 },        // Arabic "medium"
            { keyword: 'متوسط', index: 1 },      // Arabic "medium"
            { keyword: 'تلاتين', index: 1 },     // Arabic 30
            { keyword: 'ثلاتين', index: 1 },     // Arabic 30 (alternative)
            { keyword: 'ثلاثين', index: 1 },     // Arabic 30 (alternative)
            { keyword: '30', index: 1 },         // Numeric
            
            // Small sizes (26cm)
            { keyword: 'klein', index: 0 },      // German
            { keyword: 'صغير', index: 0 },       // Arabic "small"
            { keyword: 'ميني', index: 0 },       // Arabic "mini"
            { keyword: 'ستة وعشرين', index: 0 }, // Arabic 26
            { keyword: '26', index: 0 }          // Numeric
        ];
        
        // Function to extract product name from a transcript
        function extractProductName(transcriptToProcess) {
            let words = transcriptToProcess.split(' ');
            let wordsLower = transcriptToProcess.toLowerCase().split(' ');
            
            // Find size keyword in transcript
            let selectedSizeIndex = null;
            let sizeWordIndex = null;
            
            for (let sizeObj of sizeKeywords) {
                for (let i = 0; i < wordsLower.length; i++) {
                    if (wordsLower[i].includes(sizeObj.keyword)) {
                        selectedSizeIndex = sizeObj.index;
                        sizeWordIndex = i;
                        console.log('Detected size:', sizeObj.keyword, 'Index:', selectedSizeIndex);
                        break;
                    }
                }
                if (selectedSizeIndex !== null) break;
            }
            
            // Extract product name (remove the size word completely)
            let productName = transcriptToProcess;
            if (sizeWordIndex !== null) {
                words.splice(sizeWordIndex, 1); // Remove the word at that index
                productName = words.join(' ').trim();
            }
            
            return { 
                productName: productName, 
                sizeIndex: selectedSizeIndex 
            };
        }
        
        // Extract product name and size from primary transcript
        let productNameToSearch = transcript;
        let selectedSizeIndex = null;
        let extractInfo = extractProductName(transcript);
        productNameToSearch = extractInfo.productName;
        selectedSizeIndex = extractInfo.sizeIndex;
        
        console.log('Product name to search:', productNameToSearch, 'Size index:', selectedSizeIndex);
        
        // Function to calculate similarity between two strings
        function calculateSimilarity(str1, str2) {
            const s1 = str1.trim().toLowerCase();
            const s2 = str2.trim().toLowerCase();
            
            // Exact match
            if (s1 === s2) return 1;
            
            // Remove diacritics and compare (for Arabic diacritics)
            const removeDiacritics = (str) => str.replace(/[\u064B-\u065F]/g, '');
            const s1Clean = removeDiacritics(s1);
            const s2Clean = removeDiacritics(s2);
            if (s1Clean === s2Clean) return 0.95;
            
            // Check if one contains the other
            if (s1.includes(s2) || s2.includes(s1)) return 0.8;
            
            // Calculate Levenshtein distance
            const len1 = s1.length;
            const len2 = s2.length;
            const maxLen = Math.max(len1, len2);
            
            let distance = 0;
            for (let i = 0; i < Math.max(len1, len2); i++) {
                if (s1[i] !== s2[i]) distance++;
            }
            
            const similarity = 1 - (distance / maxLen);
            return similarity;
        }
        
        // Try multiple search names for each transcript
        let foundProduct = null;
        let foundByExactMatch = false;
        let foundByWordBoundary = false;
        
        // Function to search for product given a search name
        function searchForProduct(searchName) {
            if (!searchName || searchName.trim() === '') {
                console.log('❌ searchForProduct: empty search name');
                return null;
            }
            
            console.log('🔍 Searching for:', searchName);
            let totalItems = 0;
            let bestFuzzyMatch = null;
            let bestFuzzyScore = 0;
            
            for (let category of categoriesData) {
                for (let item of category.items) {
                    totalItems++;
                    const itemNameLower = item.name.toLowerCase();
                    const searchNameLower = searchName.toLowerCase();
                    
                    // Strategy 1: Exact match (complete word match)
                    if (itemNameLower === searchNameLower) {
                        console.log('✓ Found product (exact match):', item.name);
                        return { product: item, matchType: 'exact', originalName: searchName };
                    }
                    
                    // Strategy 2: Word boundary matching (full word, not substring)
                    const itemWords = itemNameLower.split(/\W+/).filter(w => w);
                    const searchWords = searchNameLower.split(/\W+/).filter(w => w);
                    
                    const exactWordMatch = itemWords.some(word => word === searchNameLower);
                    const allWordsMatch = searchWords.length > 0 && searchWords.every(searchWord => 
                        itemWords.some(itemWord => itemWord === searchWord)
                    );
                    
                    if (exactWordMatch || allWordsMatch) {
                        console.log('Found product (word match):', item.name);
                        return { product: item, matchType: 'word', originalName: searchName };
                    }
                    
                    // Strategy 3: Substring match
                    if (itemNameLower.includes(searchNameLower) ||
                        searchNameLower.includes(itemNameLower)) {
                        console.log('✓ Found product (substring match):', item.name);
                        return { product: item, matchType: 'substring', originalName: searchName };
                    }
                    
                    // Strategy 4: Fuzzy matching with 70% threshold
                    const similarity = calculateSimilarity(searchName, item.name);
                    if (similarity > bestFuzzyScore) {
                        bestFuzzyScore = similarity;
                        bestFuzzyMatch = { product: item, matchType: 'fuzzy', score: similarity, originalName: searchName };
                    }
                }
            }
            
            // Return fuzzy match if score is above 70% threshold
            if (bestFuzzyMatch && bestFuzzyScore >= 0.70) {
                console.log('✓ Found product (fuzzy match):', bestFuzzyMatch.product.name, 'Score:', bestFuzzyScore);
                return bestFuzzyMatch;
            }
            
            console.log('❌ No product found. Searched through', totalItems, 'items with search term:', searchName);
            return null;
        }
        
        // Try translations for each transcript alternative
        for (let transcriptAlt of allTranscriptsToTry) {
            // Extract product name and size for this transcript
            let extractInfoAlt = extractProductName(transcriptAlt);
            let productNameAlt = extractInfoAlt.productName;
            if (!productNameAlt || productNameAlt.trim() === '') continue;
            
            let searchNames = [productNameAlt]; // Start with original
            
            // Try exact match in translation dictionary
            if (arabicProductTranslation[productNameAlt]) {
                searchNames.unshift(arabicProductTranslation[productNameAlt]);
            }
            
            // Try fuzzy matching in translation dictionary
            let bestMatch = null;
            let bestMatchScore = 0.70; // 70% threshold for fuzzy matching
            for (let arabicName in arabicProductTranslation) {
                const similarity = calculateSimilarity(productNameAlt, arabicName);
                if (similarity > bestMatchScore) {
                    bestMatch = arabicProductTranslation[arabicName];
                    bestMatchScore = similarity;
                }
            }
            if (bestMatch && !searchNames.includes(bestMatch)) {
                searchNames.unshift(bestMatch);
            }
            
            // Try searching with each search name
            for (let searchName of searchNames) {
                let result = searchForProduct(searchName);
                if (result) {
                    if (!foundProduct) {
                        foundProduct = result.product;
                        foundByExactMatch = result.matchType === 'exact';
                        foundByWordBoundary = result.matchType === 'word';
                        // Update size index if found in this transcript
                        if (extractInfoAlt.sizeIndex !== null) {
                            selectedSizeIndex = extractInfoAlt.sizeIndex;
                        }
                        // Log correction info
                        if (result.matchType === 'fuzzy') {
                            console.log(`🔄 Correction applied: "${result.originalName}" → "${result.product.name}" (${(result.score * 100).toFixed(0)}% match)`);
                        }
                    }
                    if (foundByExactMatch || foundByWordBoundary) break;
                }
            }
            
            if (foundByExactMatch || foundByWordBoundary) break;
        }
        
        if (foundProduct) {
            // Check if fuzzy correction was applied
            let correctionMsg = '';
            if (foundByExactMatch || foundByWordBoundary) {
                // No correction needed for exact or word boundary matches
                correctionMsg = '';
            } else {
                // Correction was applied via fuzzy matching
                correctionMsg = ` (تم التصحيح من: "${productNameToSearch}")`;
            }
            
            // If product has multiple prices (pizza, fingerfood, snackrolls)
            if (foundProduct.prices && foundProduct.prices.length > 0) {
                // Use selected size or default to first size
                const priceIndex = selectedSizeIndex !== null ? selectedSizeIndex : 0;
                
                // Make sure index is valid
                let finalIndex = priceIndex;
                if (finalIndex >= foundProduct.prices.length) {
                    finalIndex = foundProduct.prices.length - 1;
                }
                
                const selectedPrice = foundProduct.prices[finalIndex];
                
                if (selectedPrice) {
                    addItemToCart({
                        name: `${foundProduct.name} (${selectedPrice.size})`,
                        price: selectedPrice.price
                    });
                    showVoiceNotification(`✓ تم إضافة: ${foundProduct.name} - ${selectedPrice.size}${correctionMsg}`, 'success');
                } else {
                    const defaultPrice = foundProduct.prices[0];
                    addItemToCart({
                        name: `${foundProduct.name} (${defaultPrice.size})`,
                        price: defaultPrice.price
                    });
                    showVoiceNotification(`✓ تم إضافة: ${foundProduct.name} (${defaultPrice.size})${correctionMsg}`, 'success');
                }
            } else {
                // Single price product
                addItemToCart(foundProduct);
                showVoiceNotification(`✓ تم إضافة: ${foundProduct.name}${correctionMsg}`, 'success');
            }
        } else {
            // Show what was recognized and searched for in the error message
            let displayName = productNameToSearch;
            if (arabicProductTranslation[productNameToSearch]) {
                displayName = `${productNameToSearch} (${arabicProductTranslation[productNameToSearch]})`;
            }
            let errorMsg = `لم يتم العثور على: "${displayName}"`;
            if (transcript && transcript !== productNameToSearch) {
                errorMsg += ` (تم التعرف على: "${transcript}")`;
            }
            showVoiceNotification(errorMsg, 'error');
            
            // Log for debugging
            console.log('❌ Product not found:', {
                recognized: transcript,
                productNameToSearch: productNameToSearch,
                alternatives: alternatives
            });
        }
    }
    
    // Show voice notification
    function showVoiceNotification(message, type = 'info') {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.voice-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `voice-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInUp 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ======== SAVED INVOICES FUNCTIONALITY ========
    
    // Save current invoice
    saveInvoiceBtn.addEventListener('click', () => {
        if (!currentInvoiceData) return;
        
        // Add timestamp
        currentInvoiceData.savedAt = new Date().toLocaleString(i18n.currentLanguage === 'ar' ? 'ar-SA' : 'de-DE');
        
        // Add to saved invoices
        savedInvoices.unshift(currentInvoiceData);
        localStorage.setItem('savedInvoices', JSON.stringify(savedInvoices));
        
        // Show success message
        showVoiceNotification('✓ تم حفظ الفاتورة بنجاح / Rechnung gespeichert', 'success');
        
        // Close the modal
        invoiceModal.style.display = 'none';
    });

    // Open saved invoices modal
    savedInvoicesBtn.addEventListener('click', () => {
        savedInvoicesModal.style.display = 'flex';
        renderSavedInvoices();
    });

    // Close saved invoices modal
    closeSavedInvoicesBtn.addEventListener('click', () => {
        savedInvoicesModal.style.display = 'none';
    });

    // Close saved invoices modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === savedInvoicesModal) {
            savedInvoicesModal.style.display = 'none';
        }
    });

    // Render saved invoices list
    function renderSavedInvoices() {
        savedInvoicesList.innerHTML = '';
        
        if (savedInvoices.length === 0) {
            savedInvoicesList.innerHTML = `
                <div class="empty-invoices">
                    <i class="fas fa-inbox"></i>
                    <p>${i18n.currentLanguage === 'ar' ? 'لا توجد فواتير محفوظة' : 'Keine gespeicherten Rechnungen'}</p>
                </div>
            `;
            return;
        }

        savedInvoices.forEach((invoice, index) => {
            const invoiceDiv = document.createElement('div');
            invoiceDiv.className = 'saved-invoice-item';
            
            const items = invoice.items.map(item => `${item.name} (${item.quantity}x)`).join(', ');
            
            invoiceDiv.innerHTML = `
                <div class="saved-invoice-item-info">
                    <div class="saved-invoice-item-header">
                        <span class="invoice-number">#${invoice.invoiceNumber}</span>
                        <span class="invoice-date">${invoice.invoiceDate}</span>
                    </div>
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 8px;">
                        ${items}
                    </div>
                    <div>
                        <span style="color: #999; font-size: 0.85em;">${i18n.currentLanguage === 'ar' ? 'محفوظة في: ' : 'Gespeichert: '}${invoice.savedAt}</span>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div class="invoice-total">${invoice.total.toFixed(2)}€</div>
                    <div class="saved-invoice-actions">
                        <button class="invoice-view-btn" data-index="${index}"><i class="fas fa-eye"></i> ${i18n.currentLanguage === 'ar' ? 'عرض' : 'Anzeigen'}</button>
                        <button class="invoice-delete-btn" data-index="${index}"><i class="fas fa-trash-alt"></i> ${i18n.currentLanguage === 'ar' ? 'حذف' : 'Löschen'}</button>
                    </div>
                </div>
            `;
            
            savedInvoicesList.appendChild(invoiceDiv);
        });

        // Add event listeners for view and delete buttons
        document.querySelectorAll('.invoice-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                viewSavedInvoice(index);
            });
        });

        document.querySelectorAll('.invoice-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(e.currentTarget.dataset.index);
                deleteSavedInvoice(index);
            });
        });
    }

    // View saved invoice
    function viewSavedInvoice(index) {
        const invoice = savedInvoices[index];
        if (!invoice) return;

        let invoiceHtml = `
            <h3>${i18n.t('headerTitle')}</h3>
            <p><strong>${i18n.currentLanguage === 'ar' ? 'رقم الفاتورة' : 'Rechnungsnummer'}:</strong> ${invoice.invoiceNumber}</p>
            <p><strong>${i18n.currentLanguage === 'ar' ? 'التاريخ' : 'Datum'}:</strong> ${invoice.invoiceDate}</p>
            <hr>
            <h4>${i18n.currentLanguage === 'ar' ? 'المطلوبات' : 'Bestellte Artikel'}:</h4>
        `;

        invoice.items.forEach(item => {
            invoiceHtml += `
                <div class="invoice-item">
                    <span>${item.name} (${item.quantity}x)</span>
                    <span>${item.itemTotal}€</span>
                </div>
            `;
        });

        invoiceHtml += `
            <div class="invoice-item">
                <span>${i18n.t('deliveryCosts')}:</span>
                <span>${invoice.deliveryCosts.toFixed(2)}€</span>
            </div>
            <hr>
            <div class="invoice-total">
                <span>${i18n.t('totalPrice')}:</span>
                <span>${invoice.total.toFixed(2)}€</span>
            </div>
            <div class="invoice-total">
                <span>${i18n.t('finalPrice')}:</span>
                <span>${invoice.finalTotal.toFixed(2)}€</span>
            </div>
        `;

        invoiceDetails.innerHTML = invoiceHtml;
        invoiceModal.style.display = 'flex';
        invoiceModal.style.animation = 'fadeIn 0.3s ease';
        
        // Close the saved invoices modal
        savedInvoicesModal.style.display = 'none';
    }

    // Delete saved invoice
    function deleteSavedInvoice(index) {
        if (confirm(i18n.currentLanguage === 'ar' ? 'هل تريد حذف هذه الفاتورة؟' : 'Möchten Sie diese Rechnung löschen?')) {
            savedInvoices.splice(index, 1);
            localStorage.setItem('savedInvoices', JSON.stringify(savedInvoices));
            renderSavedInvoices();
            showVoiceNotification('✓ تم حذف الفاتورة / Rechnung gelöscht', 'success');
        }
    }

    // ========== WHATSAPP ORDER FUNCTION ==========
    function sendOrderViaWhatsApp() {
        if (cart.length === 0) {
            alert(i18n.t('noItemsInCart'));
            return;
        }

        // Create a form for customer data
        const isArabic = i18n.currentLanguage === 'ar';
        
        const customerName = prompt(isArabic ? 'أدخل اسمك:' : 'Geben Sie Ihren Namen ein:');
        if (!customerName) return;

        const tableNumber = prompt(isArabic ? 'أدخل رقم الطاوله:' : 'Geben Sie die Tischnummer ein:');
        if (!tableNumber) return;

        try {
            // Calculate totals
            const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
            const deliveryCostsValue = deliveryCostsInput.value.trim();
            const deliveryCosts = deliveryCostsValue === '' ? 0 : parseFloat(deliveryCostsValue) || 0;
            const finalTotal = total + deliveryCosts;

            // Build WhatsApp message
            let message = isArabic ? '🍕 *طلب جديد من Milano Pizza* 🍕\n\n' : '🍕 *Neue Bestellung von Milano Pizza* 🍕\n\n';
            
            // Customer info
            message += isArabic ? `👤 *الاسم:* ${customerName}\n` : `👤 *Name:* ${customerName}\n`;
            message += isArabic ? `🪑 *رقم الطاوله:* ${tableNumber}\n` : `🪑 *Tischnummer:* ${tableNumber}\n`;

            message += '\n';
            message += isArabic ? '🛒 *تفاصيل الطلب:*\n' : '🛒 *Bestelldetails:*\n';
            message += '-'.repeat(40) + '\n';

            // Add items
            cart.forEach((item, index) => {
                const itemTotal = (item.price * (item.quantity || 1)).toFixed(2);
                const qty = item.quantity || 1;
                message += `${index + 1}. ${item.name}`;
                if (item.size) {
                    message += ` (${item.size})`;
                }
                message += ` x${qty} = €${itemTotal}\n`;
            });

            message += '-'.repeat(40) + '\n';
            message += isArabic 
                ? `💰 *السعر الكلي:* €${total.toFixed(2)}\n` 
                : `💰 *Gesamtpreis:* €${total.toFixed(2)}\n`;

            if (deliveryCosts > 0) {
                message += isArabic 
                    ? `🚚 *تكاليف التوصيل:* €${deliveryCosts.toFixed(2)}\n` 
                    : `🚚 *Lieferkosten:* €${deliveryCosts.toFixed(2)}\n`;
            }

            message += isArabic 
                ? `📋 *السعر النهائي:* €${finalTotal.toFixed(2)}\n` 
                : `📋 *Endsumme:* €${finalTotal.toFixed(2)}\n`;

            message += '\n';
            message += isArabic ? '⏰ *الوقت:*' : '⏰ *Zeit:*';
            message += ` ${new Date().toLocaleString(isArabic ? 'ar-SA' : 'de-DE')}\n`;

            // Encode message for URL
            const encodedMessage = encodeURIComponent(message);
            
            // WhatsApp number (German: +49 157 306 54181)
            const whatsappNumber = '004915730654181';
            
            // Create WhatsApp link
            const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            // Save order to Firebase (optional - for your records)
            const items = cart.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity || 1,
                size: item.size || '',
                itemTotal: ((item.price * (item.quantity || 1)).toFixed(2))
            }));

            const orderData = {
                items: items,
                totalPrice: parseFloat(total.toFixed(2)),
                deliveryCost: parseFloat(deliveryCosts.toFixed(2)),
                finalPrice: parseFloat(finalTotal.toFixed(2)),
                customerName: customerName,
                tableNumber: tableNumber,
                timestamp: new Date(),
                status: 'pending_whatsapp',
                language: i18n.currentLanguage
            };

            // Save to Firebase
            saveOrderToFirestore(orderData);

            // Show success message and open WhatsApp
            const successMsg = isArabic 
                ? `✅ تم تحضير طلبك!\nسيتم فتح WhatsApp الآن...` 
                : `✅ Ihre Bestellung ist vorbereitet!\nWhatsApp wird gleich geöffnet...`;
            
            alert(successMsg);
            
            // Open WhatsApp
            window.open(whatsappLink, '_blank');

            // Clear cart
            cart = [];
            deliveryCostsInput.value = '';
            renderCart();
            calculateTotals();

            console.log('✅ Order sent to WhatsApp successfully');

        } catch (error) {
            console.error('Error sending order via WhatsApp:', error);
            const errorMsg = i18n.currentLanguage === 'ar' 
                ? '❌ حدث خطأ: ' + error.message
                : '❌ Fehler: ' + error.message;
            alert(errorMsg);
        }
    }

    // Send order to Firebase or WhatsApp
    sendOrderBtn.addEventListener('click', async function() {
        sendOrderViaWhatsApp();
    });

    // Initial render
    console.log('Starting initial render...');
    console.log('i18n initialized:', typeof i18n !== 'undefined', i18n?.currentLanguage);
    renderCategories();
    console.log('Categories rendered');
    renderCart();
    console.log('Cart rendered');
    calculateTotals();
    
    // ========== QR CODE GENERATION ==========
    // Download QR code as image
    async function downloadQRCode() {
        const qrContainer = document.getElementById('qrCodeContainer');
        if (!qrContainer) {
            console.error('QR code container not found');
            alert('❌ الباركود لم يتم إنشاؤه / QR-Code nicht gefunden');
            return;
        }
        
        try {
            console.log('Starting QR code download...');
            
            // Use html2canvas to capture the QR code container
            const canvas = await html2canvas(qrContainer, {
                backgroundColor: '#ffffff',
                scale: 2
            });
            
            // Convert canvas to blob and download
            canvas.toBlob((blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'Milano-Pizza-QR-Code.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                
                console.log('✅ QR Code downloaded successfully');
                alert('✅ تم تحميل الصورة / Bild heruntergeladen');
            });
        } catch (error) {
            console.error('❌ Error downloading QR code:', error);
            alert('❌ خطأ في تحميل الصورة / Fehler beim Herunterladen\n' + error.message);
        }
    }
    
    // Generate QR code for the website URL
    function generateQRCode() {
        try {
            let currentUrl = window.location.href;
            
            // Fix URL for localhost or file:// protocol - use IP address for mobile phones
            if (currentUrl.includes('localhost') || currentUrl.startsWith('file://')) {
                // Get the port from current URL if exists
                const portMatch = currentUrl.match(/:(\d+)/);
                const port = portMatch ? portMatch[1] : '8080';
                
                // Get local IP address or use 192.168.x.x format
                currentUrl = `http://192.168.1.100:${port}`;
                console.log('🌐 Using IP for QR code:', currentUrl);
            }
            
            const qrDiv = document.getElementById('qrCode');
            const qrContainer = document.getElementById('qrCodeContainer');
            
            if (!qrDiv) {
                console.error('QR code div not found');
                return;
            }
            
            // Clear previous QR code
            qrDiv.innerHTML = '';
            
            // Generate new QR code
            new QRCode(qrDiv, {
                text: currentUrl,
                width: 120,
                height: 120,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
            
            // Add download button functionality
            const downloadBtn = document.getElementById('downloadQrBtn');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    downloadQRCode();
                });
            }
            
            // Add click to copy functionality for QR code itself
            if (qrDiv) {
                qrDiv.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(currentUrl);
                        alert(`✅ رابط النسخ / Link copied:\n${currentUrl}`);
                    } catch (err) {
                        console.error('Failed to copy:', err);
                        // Fallback for older browsers
                        const textarea = document.createElement('textarea');
                        textarea.value = currentUrl;
                        document.body.appendChild(textarea);
                        textarea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textarea);
                        alert(`✅ رابط النسخ / Link copied:\n${currentUrl}`);
                    }
                });
            }
            
            console.log('✅ QR Code generated:', currentUrl);
        } catch (error) {
            console.error('❌ Error generating QR code:', error);
        }
    }
    
    // Generate QR code on page load
    setTimeout(generateQRCode, 500);
    
    console.log('App initialized successfully');
});
