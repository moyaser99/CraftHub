// تهيئة السلة
let cart = [];
try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
} catch (error) {
    console.error('Error loading cart from localStorage:', error);
    cart = [];
}

// تحديث عدد العناصر في السلة
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(el => {
        if (el) {
            el.textContent = cartItems.length;
            el.style.display = cartItems.length > 0 ? 'inline-block' : 'none';
        }
    });

    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = `You have ${cartItems.length} items in your cart`;
    }
}

// إضافة منتج إلى السلة
function addToCart(event) {
    const button = event.target.closest('.add-to-cart');
    if (!button) return;

    const craftId = button.dataset.craftId;
    const craftName = button.dataset.craftName;
    const craftPrice = parseFloat(button.dataset.craftPrice);
    const craftImage = button.dataset.craftImage;

    if (!craftId || !craftName || !craftPrice || !craftImage) {
        console.error('Missing required data attributes on add to cart button');
        return;
    }

    const existingItem = cart.find(item => item.id === craftId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: craftId,
            name: craftName,
            price: craftPrice,
            image: craftImage,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
    showNotification('تمت إضافة المنتج إلى السلة');
}

// حذف منتج من السلة
function removeFromCart(event) {
    const button = event.target.closest('.remove-item');
    if (!button) return;

    const index = parseInt(button.dataset.index);
    if (isNaN(index) || index < 0 || index >= cart.length) {
        console.error('Invalid index for cart item removal');
        return;
    }

    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
    showNotification('تم إزالة المنتج من السلة');
}

// تحديث الكمية في السلة
function updateQuantity(event) {
    const input = event.target;
    if (!input.matches('input[type="number"]')) return;

    const index = parseInt(input.dataset.index);
    const newQuantity = parseInt(input.value);

    if (isNaN(index) || index < 0 || index >= cart.length || isNaN(newQuantity) || newQuantity < 1 || newQuantity > 10) {
        console.error('Invalid quantity update');
        input.value = cart[index].quantity;
        return;
    }

    cart[index].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateOrderSummary();
}

// تحديث عرض السلة
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const checkoutButton = document.querySelector('.cart-actions .btn-primary');
    if (!cartItems) return;

    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        if (checkoutButton) {
            checkoutButton.classList.add('disabled');
            checkoutButton.style.pointerEvents = 'none';
            checkoutButton.style.opacity = '0.5';
        }
        updateCartTotals(0, 0, 0);
        updateCartCount();
        return;
    }

    if (checkoutButton) {
        checkoutButton.classList.remove('disabled');
        checkoutButton.style.pointerEvents = 'auto';
        checkoutButton.style.opacity = '1';
    }

    let subtotal = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <div class="item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="item-quantity">
                <button class="btn-quantity minus" data-index="${index}">-</button>
                <input type="number" value="${item.quantity}" min="1" max="10" data-index="${index}">
                <button class="btn-quantity plus" data-index="${index}">+</button>
            </div>
            <div class="item-total">$${itemTotal.toFixed(2)}</div>
            <button class="remove-item" data-index="${index}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });

    const shipping = getShippingCost();
    const tax = calculateTax(subtotal);
    const total = subtotal + shipping + tax;

    updateCartTotals(subtotal, shipping, total);
    updateCartCount();
}

// تحديث المجاميع في السلة
function updateCartTotals(subtotal, shipping, total) {
    const subtotalElement = document.querySelector('.subtotal .amount');
    const shippingElement = document.querySelector('.shipping .amount');
    const totalElement = document.querySelector('.total .amount');

    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// حساب تكلفة الشحن
function getShippingCost() {
    const shippingOption = document.querySelector('input[name="shipping"]:checked');
    if (!shippingOption) {
        // إذا لم يتم العثور على خيار شحن محدد، استخدم القيمة المحفوظة
        const savedCost = localStorage.getItem('shippingCost');
        return savedCost ? parseFloat(savedCost) : 15.00;
    }

    const priceSpan = shippingOption.nextElementSibling.querySelector('.option-price');
    const cost = priceSpan ? parseFloat(priceSpan.textContent.replace('$', '')) : 15.00;
    
    // حفظ تكلفة الشحن في localStorage
    localStorage.setItem('shippingCost', cost.toString());
    
    return cost;
}

// حساب الضريبة
function calculateTax(subtotal) {
    return subtotal * 0.0865; // 8.65% tax rate
}

// تحديث ملخص الطلب
function updateOrderSummary() {
    const summaryItems = document.querySelector('.summary-items');
    if (!summaryItems) return;

    summaryItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.innerHTML = `
            <div class="item-info">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p>Qty: ${item.quantity}</p>
                </div>
            </div>
            <span class="item-price">$${itemTotal.toFixed(2)}</span>
        `;
        summaryItems.appendChild(summaryItem);
    });

    const shipping = getShippingCost();
    const tax = calculateTax(subtotal);
    const total = subtotal + shipping + tax;

    updateOrderSummaryTotals(subtotal, shipping, tax, total);
}

// تحديث مجاميع ملخص الطلب
function updateOrderSummaryTotals(subtotal, shipping, tax, total) {
    const subtotalElement = document.querySelector('.summary-row:nth-child(1) span:last-child');
    const shippingElement = document.querySelector('.summary-row:nth-child(2) span:last-child');
    const taxElement = document.querySelector('.summary-row:nth-child(3) span:last-child');
    const totalElement = document.querySelector('.summary-row.total span:last-child');

    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// إظهار إشعار
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// التحقق من صحة رقم الهاتف
function validatePhoneNumber(phone) {
    // التحقق من أن رقم الهاتف يحتوي على 10 أرقام على الأقل
    const phoneRegex = /^[0-9]{10,}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

// التحقق من صحة رقم البطاقة
function validateCardNumber(cardNumber) {
    // إزالة المسافات والشرطات
    cardNumber = cardNumber.replace(/\D/g, '');
    // التحقق من أن الرقم يحتوي على 16 رقم
    if (cardNumber.length !== 16) return false;
    // التحقق من أن جميع الأحرف أرقام
    return /^\d{16}$/.test(cardNumber);
}

// التحقق من صحة تاريخ انتهاء الصلاحية
function validateExpiryDate(expiry) {
    // التحقق من الصيغة MM/YY
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    
    const [month, year] = expiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    // التحقق من أن الشهر صالح (1-12)
    if (month < 1 || month > 12) return false;
    
    // التحقق من أن التاريخ لم ينته بعد
    if (year < currentYear || (year === currentYear && month < currentMonth)) return false;
    
    return true;
}

// التحقق من صحة رمز CVV
function validateCVV(cvv) {
    // التحقق من أن الرمز يحتوي على 3 أو 4 أرقام
    return /^\d{3,4}$/.test(cvv);
}

// إضافة هالة حمراء للحقل
function highlightError(input) {
    input.classList.add('error');
    input.style.borderColor = '#ff0000';
    input.style.boxShadow = '0 0 5px rgba(255, 0, 0, 0.5)';
}

// إزالة هالة الخطأ من الحقل
function removeErrorHighlight(input) {
    input.classList.remove('error');
    input.style.borderColor = '';
    input.style.boxShadow = '';
}

// معالجة تقديم نموذج الشيك أوت
document.addEventListener('DOMContentLoaded', () => {
    // تحديث عداد السلة عند تحميل الصفحة
    updateCartCount();
    
    // إضافة مستمعي الأحداث لخيارات الشحن في صفحة السلة
    const shippingInputs = document.querySelectorAll('input[name="shipping"]');
    shippingInputs.forEach(input => {
        input.addEventListener('change', () => {
            const priceSpan = input.nextElementSibling.querySelector('.option-price');
            const cost = priceSpan ? parseFloat(priceSpan.textContent.replace('$', '')) : 15.00;
            localStorage.setItem('shippingCost', cost.toString());
            updateCartDisplay();
            updateOrderSummary();
        });
    });

    // إضافة معالجة خاصة لحقل تاريخ انتهاء الصلاحية
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // إزالة أي شيء غير الأرقام
            
            if (value.length > 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            
            e.target.value = value;
        });
    }

    const checkoutForm = document.querySelector('.checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (cart.length === 0) {
                showNotification('لا يمكن اتمام الطلب مع سلة فارغة');
                return;
            }

            const formData = new FormData(checkoutForm);
            const phoneNumber = formData.get('phone');
            const paymentMethod = formData.get('payment');

            // التحقق من صحة رقم الهاتف
            if (!validatePhoneNumber(phoneNumber)) {
                showNotification('يرجى إدخال رقم هاتف صحيح (10 أرقام على الأقل)');
                const phoneInput = checkoutForm.querySelector('input[name="phone"]');
                if (phoneInput) {
                    highlightError(phoneInput);
                    phoneInput.focus();
                }
                return;
            }

            // التحقق من معلومات البطاقة إذا تم اختيار الدفع بالبطاقة
            if (paymentMethod === 'credit') {
                const cardNumber = formData.get('cardnumber');
                const expiry = formData.get('expiry');
                const cvv = formData.get('cvv');

                let hasError = false;

                if (!validateCardNumber(cardNumber)) {
                    showNotification('يرجى إدخال رقم بطاقة صحيح (16 رقم)');
                    const cardInput = checkoutForm.querySelector('input[name="cardnumber"]');
                    if (cardInput) {
                        highlightError(cardInput);
                        cardInput.focus();
                    }
                    hasError = true;
                }

                if (!validateExpiryDate(expiry)) {
                    showNotification('يرجى إدخال تاريخ انتهاء صالح (MM/YY)');
                    const expiryInput = checkoutForm.querySelector('input[name="expiry"]');
                    if (expiryInput) {
                        highlightError(expiryInput);
                        expiryInput.focus();
                    }
                    hasError = true;
                }

                if (!validateCVV(cvv)) {
                    showNotification('يرجى إدخال رمز CVV صحيح (3 أو 4 أرقام)');
                    const cvvInput = checkoutForm.querySelector('input[name="cvv"]');
                    if (cvvInput) {
                        highlightError(cvvInput);
                        cvvInput.focus();
                    }
                    hasError = true;
                }

                if (hasError) return;
            }

            // حساب المجاميع
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const shipping = getShippingCost();
            const tax = calculateTax(subtotal);
            const total = subtotal + shipping + tax;

            // تجميع بيانات الطلب
            const orderData = {
                orderId: 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                orderDate: new Date().toISOString(),
                customer: {
                    fullName: formData.get('fullname'),
                    phone: phoneNumber,
                    email: formData.get('email'),
                    address: {
                        street: formData.get('address'),
                        city: formData.get('city'),
                        country: formData.get('country'),
                        zip: formData.get('zip')
                    }
                },
                payment: {
                    method: paymentMethod,
                    cardNumber: paymentMethod === 'credit' ? formData.get('cardnumber').replace(/\D/g, '').slice(-4) : null,
                    expiry: paymentMethod === 'credit' ? formData.get('expiry') : null
                },
                shipping: {
                    method: document.querySelector('input[name="shipping"]:checked')?.value || 'standard',
                    cost: shipping
                },
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                    total: item.price * item.quantity
                })),
                totals: {
                    subtotal: subtotal,
                    shipping: shipping,
                    tax: tax,
                    total: total
                },
                status: 'paid'
            };

            // تخزين بيانات الطلب
            localStorage.setItem('currentOrder', JSON.stringify(orderData));
            
            // تفريغ السلة
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            showNotification('تم اتمام الطلب بنجاح!');
            
            // الانتظار لمدة ثانية قبل التوجيه
            setTimeout(() => {
                window.location.href = 'invoice.html';
            }, 1000);
        });

        // إضافة مستمعي الأحداث لإزالة هالة الخطأ عند التعديل
        const inputs = checkoutForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                removeErrorHighlight(input);
            });
        });
    }

    // تحديث عرض السلة عند تحميل الصفحة
    updateCartDisplay();
    updateOrderSummary();

    // إضافة مستمعي الأحداث
    document.addEventListener('click', (event) => {
        if (event.target.closest('.add-to-cart')) {
            addToCart(event);
        } else if (event.target.closest('.remove-item')) {
            removeFromCart(event);
        }
    });

    document.addEventListener('change', (event) => {
        if (event.target.matches('input[type="number"]')) {
            updateQuantity(event);
        } else if (event.target.matches('input[name="shipping"]')) {
            updateCartDisplay();
            updateOrderSummary();
        }
    });
});

// معالجة صفحة الفاتورة
document.addEventListener('DOMContentLoaded', () => {
    const invoiceContainer = document.querySelector('.invoice-container');
    if (invoiceContainer) {
        try {
            const orderData = JSON.parse(localStorage.getItem('currentOrder'));
            if (!orderData) {
                window.location.href = 'index.html';
                return;
            }

            // تحديث معلومات الفاتورة
            document.querySelector('.invoice-info h2').textContent = `Invoice #${orderData.orderId}`;
            document.querySelector('.invoice-details').innerHTML = `
                <div class="detail-group">
                    <label>Date:</label>
                    <span>${new Date(orderData.orderDate).toLocaleDateString()}</span>
                </div>
                <div class="detail-group">
                    <label>Status:</label>
                    <span class="status-badge ${orderData.payment.method === 'credit' ? 'paid' : 'pending'}">
                        ${orderData.payment.method === 'credit' ? 'Paid' : 'Pending Payment'}
                    </span>
                </div>
            `;

            // تحديث معلومات العميل
            document.querySelector('.customer-details').innerHTML = `
                <p><strong>Name:</strong> ${orderData.customer.fullName}</p>
                <p><strong>Phone:</strong> ${orderData.customer.phone}</p>
                <p><strong>Email:</strong> ${orderData.customer.email}</p>
                <p><strong>Address:</strong> ${orderData.customer.address.street}</p>
                <p><strong>City:</strong> ${orderData.customer.address.city}</p>
                <p><strong>Country:</strong> ${orderData.customer.address.country}</p>
                <p><strong>ZIP:</strong> ${orderData.customer.address.zip}</p>
            `;

            // تحديث جدول المنتجات
            const orderItems = document.querySelector('.order-summary table tbody');
            orderItems.innerHTML = orderData.items.map(item => `
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                            <div>
                                <h4 style="margin: 0 0 5px 0;">${item.name}</h4>
                                <p style="margin: 0; color: #666;">Qty: ${item.quantity}</p>
                            </div>
                        </div>
                    </td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>$${item.total.toFixed(2)}</td>
                </tr>
            `).join('');

            // تحديث ملخص الدفع
            document.querySelector('.payment-summary').innerHTML = `
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>$${orderData.totals.subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping</span>
                    <span>$${orderData.totals.shipping.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Tax</span>
                    <span>$${orderData.totals.tax.toFixed(2)}</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span>$${orderData.totals.total.toFixed(2)}</span>
                </div>
            `;

            // تحديث تفاصيل الدفع
            const paymentDetails = document.querySelector('.payment-info');
            if (paymentDetails) {
                paymentDetails.innerHTML = `
                    <div class="payment-method">
                        <i class="fas ${orderData.payment.method === 'credit' ? 'fa-credit-card' : 'fa-money-bill-wave'}"></i>
                        <div>
                            <h4>${orderData.payment.method === 'credit' ? 'Credit Card' : 'Cash on Delivery'}</h4>
                            ${orderData.payment.method === 'credit' ? `
                                <p>Card ending in ${orderData.payment.cardNumber}</p>
                                <p>Expires: ${orderData.payment.expiry}</p>
                            ` : `
                                <p>Payment will be collected upon delivery</p>
                            `}
                        </div>
                    </div>
                `;
            }

            // تحديث عنوان الشحن في أسفل الصفحة
            const shippingAddress = document.querySelector('.shipping-address');
            if (shippingAddress) {
                shippingAddress.innerHTML = `
                    <h3>Shipping Address</h3>
                    <p>${orderData.customer.fullName}</p>
                    <p>${orderData.customer.address.street}</p>
                    <p>${orderData.customer.address.city}, ${orderData.customer.address.country} ${orderData.customer.address.zip}</p>
                    <p>Phone: ${orderData.customer.phone}</p>
                `;
            }

            // إضافة زر عرض في لوحة التحكم
            const invoiceActions = document.querySelector('.invoice-actions');
            if (invoiceActions) {
                invoiceActions.innerHTML = `
                    <button class="btn btn-primary" id="viewInAdmin">
                        <i class="fas fa-external-link-alt"></i>
                        View in Admin Panel
                    </button>
                `;

                document.getElementById('viewInAdmin').addEventListener('click', () => {
                    window.location.href = 'admin-orders.html';
                });
            }

            // Add event listeners for print and download buttons
            const printButton = document.querySelector('.btn-primary');
            const downloadButton = document.querySelector('.btn-outline');

            if (printButton) {
                printButton.addEventListener('click', () => {
                    window.print();
                });
            }

            if (downloadButton) {
                downloadButton.addEventListener('click', async () => {
                    try {
                        // تعطيل الزر أثناء المعالجة
                        downloadButton.disabled = true;
                        downloadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التنزيل...';

                        // الحصول على محتوى الفاتورة
                        const element = document.querySelector('.invoice-container');
                        
                        // تحويل العنصر إلى صورة باستخدام html2canvas
                        const canvas = await html2canvas(element, {
                            scale: 2,
                            useCORS: true,
                            logging: true,
                            backgroundColor: '#ffffff'
                        });

                        // إنشاء كائن PDF جديد
                        const { jsPDF } = window.jspdf;
                        const pdf = new jsPDF('p', 'mm', 'a4');
                        
                        // حساب الأبعاد المناسبة للصفحة
                        const imgWidth = 210; // عرض A4 بالمليمتر
                        const imgHeight = (canvas.height * imgWidth) / canvas.width;
                        
                        // إضافة الصورة إلى PDF
                        pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, imgWidth, imgHeight);
                        
                        // حفظ الملف
                        pdf.save(`invoice-${orderData.orderId}.pdf`);
                        
                        showNotification('تم تنزيل الفاتورة بنجاح');
                    } catch (error) {
                        console.error('Error generating PDF:', error);
                        showNotification('حدث خطأ أثناء تنزيل الفاتورة. يرجى المحاولة مرة أخرى');
                    } finally {
                        // إعادة تفعيل الزر
                        downloadButton.disabled = false;
                        downloadButton.innerHTML = '<i class="fas fa-download"></i> تنزيل PDF';
                    }
                });
            }

        } catch (error) {
            console.error('Error loading invoice:', error);
            showNotification('حدث خطأ أثناء تحميل الفاتورة');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }
});

// Profile Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    // تحميل بيانات المستخدم من localStorage
    const userData = JSON.parse(localStorage.getItem('userData')) || {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 234 567 8900',
        addresses: [
            {
                id: 1,
                type: 'Home',
                street: '123 Main Street',
                apartment: 'Apt 4B',
                city: 'New York',
                country: 'USA',
                zip: '10001'
            }
        ],
        paymentMethods: [
            {
                id: 1,
                type: 'Visa',
                last4: '1234',
                expiry: '12/25'
            }
        ],
        orders: [
            {
                id: 'ORD-2024-001',
                date: '2024-03-15',
                status: 'Delivered',
                items: [
                    {
                        name: 'Handmade Ceramic Vase',
                        quantity: 1,
                        price: 49.99,
                        image: 'images/product1.jpg'
                    }
                ],
                total: 49.99
            }
        ]
    };

    // تحديث معلومات المستخدم في الواجهة
    function updateUserInfo() {
        const userInfo = document.querySelector('.user-info');
        if (userInfo) {
            userInfo.querySelector('h3').textContent = userData.fullName;
            userInfo.querySelector('p').textContent = userData.email;
        }

        // تحديث نموذج الحساب
        const accountForm = document.getElementById('account-form');
        if (accountForm) {
            accountForm.querySelector('#fullname').value = userData.fullName;
            accountForm.querySelector('#email').value = userData.email;
            accountForm.querySelector('#phone').value = userData.phone;
        }

        // تحديث قائمة العناوين
        updateAddressesList();
        // تحديث قائمة طرق الدفع
        updatePaymentMethods();
        // تحديث قائمة الطلبات
        updateOrdersList();
    }

    // تحديث قائمة العناوين
    function updateAddressesList() {
        const addressesList = document.querySelector('.addresses-list');
        if (!addressesList) return;

        const addressCards = userData.addresses.map(address => `
            <div class="address-card" data-id="${address.id}">
                <div class="address-info">
                    <h4>${address.type} Address</h4>
                    <p>${address.street}</p>
                    <p>${address.apartment}</p>
                    <p>${address.city}, ${address.country} ${address.zip}</p>
                </div>
                <div class="address-actions">
                    <button class="btn btn-secondary edit-address" data-id="${address.id}">Edit</button>
                    <button class="btn btn-danger delete-address" data-id="${address.id}">Delete</button>
                </div>
            </div>
        `).join('');

        addressesList.innerHTML = addressCards + `
            <button class="add-address btn btn-primary">
                <i class="fas fa-plus"></i> Add New Address
            </button>
        `;
    }

    // تحديث قائمة طرق الدفع
    function updatePaymentMethods() {
        const paymentMethods = document.querySelector('.payment-methods');
        if (!paymentMethods) return;

        const paymentCards = userData.paymentMethods.map(method => `
            <div class="payment-card" data-id="${method.id}">
                <div class="card-info">
                    <i class="fab fa-cc-${method.type.toLowerCase()}"></i>
                    <span>**** **** **** ${method.last4}</span>
                    <span>Expires: ${method.expiry}</span>
                </div>
                <div class="card-actions">
                    <button class="btn btn-secondary edit-payment" data-id="${method.id}">Edit</button>
                    <button class="btn btn-danger remove-payment" data-id="${method.id}">Remove</button>
                </div>
            </div>
        `).join('');

        paymentMethods.innerHTML = paymentCards + `
            <button class="add-payment btn btn-primary">
                <i class="fas fa-plus"></i> Add New Payment Method
            </button>
        `;
    }

    // تحديث قائمة الطلبات
    function updateOrdersList() {
        const ordersList = document.querySelector('.orders-list');
        if (!ordersList) return;

        const orderCards = userData.orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-id">#${order.id}</span>
                    <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
                    <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="item-details">
                                <h4>${item.name}</h4>
                                <p>Quantity: ${item.quantity}</p>
                                <p class="price">$${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <span class="order-total">Total: $${order.total.toFixed(2)}</span>
                    <button class="btn btn-secondary view-order" data-id="${order.id}">View Details</button>
                </div>
            </div>
        `).join('');

        ordersList.innerHTML = orderCards;
    }

    // معالجة التنقل بين الأقسام
    document.querySelectorAll('.profile-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            
            // تحديث الحالة النشطة
            document.querySelectorAll('.profile-nav a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            
            // إظهار القسم المحدد
            document.querySelectorAll('.profile-section').forEach(section => section.classList.remove('active'));
            document.getElementById(section).classList.add('active');
        });
    });

    // معالجة تحديث معلومات الحساب
    const accountForm = document.getElementById('account-form');
    if (accountForm) {
        accountForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(accountForm);
            userData.fullName = formData.get('fullname');
            userData.email = formData.get('email');
            userData.phone = formData.get('phone');
            
            localStorage.setItem('userData', JSON.stringify(userData));
            updateUserInfo();
            showNotification('تم تحديث معلومات الحساب بنجاح');
        });
    }

    // معالجة تغيير كلمة المرور
    const changePasswordBtn = document.getElementById('change-password');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
            const currentPassword = prompt('أدخل كلمة المرور الحالية:');
            if (!currentPassword) return;

            const newPassword = prompt('أدخل كلمة المرور الجديدة:');
            if (!newPassword) return;

            const confirmPassword = prompt('تأكيد كلمة المرور الجديدة:');
            if (newPassword !== confirmPassword) {
                showNotification('كلمات المرور غير متطابقة');
                return;
            }

            // هنا يمكن إضافة التحقق من كلمة المرور الحالية وتحديث كلمة المرور الجديدة
            showNotification('تم تغيير كلمة المرور بنجاح');
        });
    }

    // معالجة تفعيل/تعطيل المصادقة الثنائية
    const twoFactorToggle = document.getElementById('2fa-toggle');
    if (twoFactorToggle) {
        twoFactorToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                // هنا يمكن إضافة منطق إعداد المصادقة الثنائية
                showNotification('تم تفعيل المصادقة الثنائية');
            } else {
                showNotification('تم تعطيل المصادقة الثنائية');
            }
        });
    }

    // معالجة حذف الحساب
    const deleteAccountBtn = document.getElementById('delete-account');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            if (confirm('هل أنت متأكد من حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.')) {
                // هنا يمكن إضافة منطق حذف الحساب
                localStorage.removeItem('userData');
                window.location.href = 'index.html';
            }
        });
    }

    // معالجة إضافة عنوان جديد
    const addAddressBtn = document.querySelector('.add-address');
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', () => {
            const newAddress = {
                id: Date.now(),
                type: prompt('نوع العنوان (مثال: المنزل، العمل):'),
                street: prompt('الشارع:'),
                apartment: prompt('رقم الشقة (اختياري):'),
                city: prompt('المدينة:'),
                country: prompt('الدولة:'),
                zip: prompt('الرمز البريدي:')
            };

            if (newAddress.type && newAddress.street && newAddress.city && newAddress.country && newAddress.zip) {
                userData.addresses.push(newAddress);
                localStorage.setItem('userData', JSON.stringify(userData));
                updateAddressesList();
                showNotification('تم إضافة العنوان بنجاح');
            }
        });
    }

    // معالجة إضافة طريقة دفع جديدة
    const addPaymentBtn = document.querySelector('.add-payment');
    if (addPaymentBtn) {
        addPaymentBtn.addEventListener('click', () => {
            const newPayment = {
                id: Date.now(),
                type: prompt('نوع البطاقة (Visa, Mastercard, etc.):'),
                last4: prompt('آخر 4 أرقام من البطاقة:'),
                expiry: prompt('تاريخ انتهاء الصلاحية (MM/YY):')
            };

            if (newPayment.type && newPayment.last4 && newPayment.expiry) {
                userData.paymentMethods.push(newPayment);
                localStorage.setItem('userData', JSON.stringify(userData));
                updatePaymentMethods();
                showNotification('تم إضافة طريقة الدفع بنجاح');
            }
        });
    }

    // تحديث معلومات المستخدم عند تحميل الصفحة
    updateUserInfo();
});

document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.querySelector('.nav-actions .btn-login');
    const registerBtn = document.querySelector('.nav-actions .btn-register');
    const profileIcon = document.querySelector('.nav-actions .user-icon');
    const logoutBtn = document.querySelector('.nav-actions .btn-logout');

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (profileIcon) profileIcon.style.display = 'inline-flex';
        if (logoutBtn) logoutBtn.style.display = 'inline-flex';
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-flex';
        if (registerBtn) registerBtn.style.display = 'inline-flex';
        if (profileIcon) profileIcon.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('isLoggedIn');
            if (loginBtn) loginBtn.style.display = 'inline-flex';
            if (registerBtn) registerBtn.style.display = 'inline-flex';
            if (profileIcon) profileIcon.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
        });
    }
});

// Thumbnail click handler for craft details page
function initializeThumbnails() {
    document.querySelectorAll('.thumbnail-images img').forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbnails
            document.querySelectorAll('.thumbnail-images img').forEach(t => t.classList.remove('active'));
            // Add active class to clicked thumbnail
            this.classList.add('active');
            // Update main image
            document.querySelector('.main-image img').src = this.src;
        });
    });
}

// Quantity control functions
function increaseQuantity() {
    const input = document.getElementById('quantity');
    const currentValue = parseInt(input.value);
    if (currentValue < 10) {
        input.value = currentValue + 1;
    }
}

function decreaseQuantity() {
    const input = document.getElementById('quantity');
    const currentValue = parseInt(input.value);
    if (currentValue > 1) {
        input.value = currentValue - 1;
    }
}

// Add to cart function for craft details page
function addToCartFromDetails(event) {
    event.preventDefault();
    const button = event.target.closest('.add-to-cart');
    if (!button) return;

    const craftId = button.dataset.craftId;
    const craftName = button.dataset.craftName;
    const craftPrice = parseFloat(button.dataset.craftPrice);
    const craftImage = button.dataset.craftImage;
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!craftId || !craftName || !craftPrice || !craftImage) {
        console.error('Missing required data attributes on add to cart button');
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === craftId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: craftId,
            name: craftName,
            price: craftPrice,
            image: craftImage,
            quantity: quantity
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('تمت إضافة المنتج إلى السلة');
}

// Initialize profile page
function initializeProfilePage() {
    const name = localStorage.getItem('userName') || '';
    const email = localStorage.getItem('userEmail') || '';
    const nameField = document.querySelector('.profile-name');
    const emailField = document.querySelector('.profile-email');
    if (nameField) nameField.textContent = name;
    if (emailField) emailField.textContent = email;
}

// Initialize checkout page payment methods
function initializeCheckoutPage() {
    const payCredit = document.getElementById('pay-credit');
    const payCash = document.getElementById('pay-cash');
    const creditFields = document.getElementById('credit-fields');
    
    function toggleCreditFields() {
        if (payCredit.checked) {
            creditFields.style.display = '';
            creditFields.querySelectorAll('input').forEach(inp => inp.required = true);
        } else {
            creditFields.style.display = 'none';
            creditFields.querySelectorAll('input').forEach(inp => inp.required = false);
        }
    }
    
    if (payCredit && payCash && creditFields) {
        payCredit.addEventListener('change', toggleCreditFields);
        payCash.addEventListener('change', toggleCreditFields);
        toggleCreditFields();
    }
}

// Initialize all event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initializeThumbnails();
    
    // Add quantity control event listeners
    const increaseBtn = document.querySelector('.quantity-btn.increase');
    const decreaseBtn = document.querySelector('.quantity-btn.decrease');
    if (increaseBtn) increaseBtn.addEventListener('click', increaseQuantity);
    if (decreaseBtn) decreaseBtn.addEventListener('click', decreaseQuantity);

    // Add to cart event listener for craft details page
    const addToCartBtn = document.querySelector('.add-to-cart');
    if (addToCartBtn) addToCartBtn.addEventListener('click', addToCartFromDetails);

    // Initialize profile page if on profile page
    if (document.querySelector('.profile-name')) {
        initializeProfilePage();
    }

    // Initialize checkout page if on checkout page
    if (document.getElementById('pay-credit')) {
        initializeCheckoutPage();
    }

    // Initialize password toggle for login page
    const loginPasswordToggle = document.querySelector('.auth-form .toggle-password');
    if (loginPasswordToggle) {
        loginPasswordToggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    }
});

// Password validation functions
function initializePasswordValidation() {
    const form = document.getElementById('register-form');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const email = document.getElementById('email');
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    const passwordMatchMessage = document.getElementById('password-match-message');

    if (!form || !password || !confirmPassword || !email) return;

    // Email validation function
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Add email validation
    email.addEventListener('input', function() {
        const emailValue = this.value.trim();
        if (emailValue === '') {
            this.setCustomValidity('');
            return;
        }

        if (!validateEmail(emailValue)) {
            this.setCustomValidity('يرجى إدخال بريد إلكتروني صحيح');
        } else {
            this.setCustomValidity('');
        }
    });

    // Password strength requirements
    const requirements = {
        length: /.{8,}/,
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        number: /[0-9]/,
        special: /[!@#$%^&*(),.?":{}|<>]/
    };

    // Update password strength
    function updatePasswordStrength() {
        const value = password.value;
        let strength = 0;
        let messages = [];

        // Check each requirement
        if (requirements.length.test(value)) {
            document.getElementById('length-check').classList.add('met');
            strength += 20;
        } else {
            document.getElementById('length-check').classList.remove('met');
        }

        if (requirements.uppercase.test(value)) {
            document.getElementById('uppercase-check').classList.add('met');
            strength += 20;
        } else {
            document.getElementById('uppercase-check').classList.remove('met');
        }

        if (requirements.lowercase.test(value)) {
            document.getElementById('lowercase-check').classList.add('met');
            strength += 20;
        } else {
            document.getElementById('lowercase-check').classList.remove('met');
        }

        if (requirements.number.test(value)) {
            document.getElementById('number-check').classList.add('met');
            strength += 20;
        } else {
            document.getElementById('number-check').classList.remove('met');
        }

        if (requirements.special.test(value)) {
            document.getElementById('special-check').classList.add('met');
            strength += 20;
        } else {
            document.getElementById('special-check').classList.remove('met');
        }

        // Update strength bar and text
        if (strengthFill) {
            strengthFill.style.width = strength + '%';
            if (strength <= 20) {
                strengthText.textContent = 'قوة كلمة المرور: ضعيفة جداً';
                strengthFill.style.backgroundColor = '#ff4444';
            } else if (strength <= 40) {
                strengthText.textContent = 'قوة كلمة المرور: ضعيفة';
                strengthFill.style.backgroundColor = '#ffbb33';
            } else if (strength <= 60) {
                strengthText.textContent = 'قوة كلمة المرور: متوسطة';
                strengthFill.style.backgroundColor = '#ffeb3b';
            } else if (strength <= 80) {
                strengthText.textContent = 'قوة كلمة المرور: قوية';
                strengthFill.style.backgroundColor = '#00C851';
            } else {
                strengthText.textContent = 'قوة كلمة المرور: قوية جداً';
                strengthFill.style.backgroundColor = '#007E33';
            }
        }
    }

    // Check password match
    function checkPasswordMatch() {
        if (!passwordMatchMessage) return;
        
        if (confirmPassword.value === '') {
            passwordMatchMessage.textContent = '';
            return;
        }
        
        if (password.value === confirmPassword.value) {
            passwordMatchMessage.textContent = 'كلمات المرور متطابقة';
            passwordMatchMessage.style.color = '#00C851';
        } else {
            passwordMatchMessage.textContent = 'كلمات المرور غير متطابقة';
            passwordMatchMessage.style.color = '#ff4444';
        }
    }

    // Add event listeners
    password.addEventListener('input', updatePasswordStrength);
    confirmPassword.addEventListener('input', checkPasswordMatch);

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate email
        if (!validateEmail(email.value.trim())) {
            alert('يرجى إدخال بريد إلكتروني صحيح');
            email.focus();
            return;
        }

        // Check password strength
        const strength = parseInt(strengthFill.style.width);
        if (strength < 60) {
            alert('يرجى اختيار كلمة مرور أقوى');
            return;
        }

        // Check password match
        if (password.value !== confirmPassword.value) {
            alert('كلمات المرور غير متطابقة');
            return;
        }

        const name = document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value;
        const emailValue = email.value.trim();
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', emailValue);
        window.location.href = 'index.html';
    });
}

// Initialize password validation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePasswordValidation();
});
