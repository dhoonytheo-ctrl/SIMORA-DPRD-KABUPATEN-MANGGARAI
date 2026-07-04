/* ============================================
   SIMORA - UTILITY FUNCTIONS
   ============================================ */

// ============================================
// DATE & TIME UTILITIES
// ============================================

function getTahunAnggaran() {
    const tahunSekarang = new Date().getFullYear();
    return {
        realisasi: tahunSekarang - 1,    // Menu 1: Tahun-1
        perubahan: tahunSekarang,         // Menu 2: Tahun Berjalan
        anggaran: tahunSekarang + 1       // Menu 3: Tahun+1
    };
}

function formatDate(date) {
    if (!date) return '--';
    if (typeof date === 'string') date = new Date(date);
    
    const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    return `${hari[date.getDay()]}, ${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDateTime(date) {
    if (!date) return '--';
    if (typeof date === 'string') date = new Date(date);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function formatTime(date) {
    if (!date) return '--:--:--';
    if (typeof date === 'string') date = new Date(date);
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
}

function getISOTimestamp() {
    return new Date().toISOString();
}

// ============================================
// CURRENCY & NUMBER UTILITIES
// ============================================

function formatCurrency(value) {
    if (value === null || value === undefined || value === '') return 'Rp 0';
    
    const num = parseInt(value);
    if (isNaN(num)) return 'Rp 0';
    
    return 'Rp ' + num.toLocaleString('id-ID');
}

function parseCurrency(value) {
    if (!value) return 0;
    const num = parseInt(value.replace(/\D/g, ''));
    return isNaN(num) ? 0 : num;
}

function formatNumber(value) {
    if (value === null || value === undefined || value === '') return '0';
    const num = parseFloat(value);
    return isNaN(num) ? '0' : num.toLocaleString('id-ID', {maximumFractionDigits: 2});
}

function calculatePercentage(realisasi, anggaran) {
    if (!anggaran || anggaran === 0) return 0;
    return Math.round((realisasi / anggaran) * 100);
}

// ============================================
// UUID & ID UTILITIES
// ============================================

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function generateRandomId(length = 8) {
    return Math.random().toString(36).substring(2, length + 2);
}

// ============================================
// FILE UTILITIES
// ============================================

function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

function getFileIcon(filename) {
    const ext = getFileExtension(filename);
    const icons = {
        'pdf': '📄',
        'doc': '📝', 'docx': '📝',
        'xls': '📊', 'xlsx': '📊',
        'ppt': '🎞️', 'pptx': '🎞️',
        'txt': '📃',
        'zip': '📦', 'rar': '📦',
        'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️',
        'mp4': '🎬', 'avi': '🎬',
        'mp3': '🎵', 'wav': '🎵'
    };
    return icons[ext] || '📎';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function validateFileSize(bytes, maxMB = 10) {
    const maxBytes = maxMB * 1024 * 1024;
    return bytes <= maxBytes;
}

// ============================================
// STRING UTILITIES
// ============================================

function ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function truncate(str, length = 50) {
    return str.length > length ? str.substring(0, length) + '...' : str;
}

function capitalizeWords(str) {
    return str.replace(/\b\w/g, function(char) {
        return char.toUpperCase();
    });
}

// ============================================
// VALIDATION UTILITIES
// ============================================

function isValidPIN(pin) {
    return /^\d{4,6}$/.test(pin);
}

function isValidUsername(username) {
    return username && username.trim().length > 2;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============================================
// ARRAY & OBJECT UTILITIES
// ============================================

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function sortArray(arr, key, order = 'asc') {
    return [...arr].sort((a, b) => {
        let aVal = a ? a[key] : undefined;
        let bVal = b ? b[key] : undefined;

        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);
        const aIsNumber = !Number.isNaN(aNum) && aVal !== null && aVal !== undefined;
        const bIsNumber = !Number.isNaN(bNum) && bVal !== null && bVal !== undefined;

        if (aIsNumber && bIsNumber) {
            return order === 'asc' ? aNum - bNum : bNum - aNum;
        }

        aVal = aVal == null ? '' : String(aVal).toLowerCase();
        bVal = bVal == null ? '' : String(bVal).toLowerCase();

        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

function filterArray(arr, predicate) {
    return arr.filter(predicate);
}

function searchArray(arr, searchTerm, ...fields) {
    if (!searchTerm) return arr;
    const term = searchTerm.toLowerCase();
    return arr.filter(item =>
        fields.some(field => 
            String(item[field] || '').toLowerCase().includes(term)
        )
    );
}

function groupBy(arr, key) {
    return arr.reduce((result, item) => {
        const groupKey = item[key];
        if (!result[groupKey]) result[groupKey] = [];
        result[groupKey].push(item);
        return result;
    }, {});
}

// ============================================
// DOM UTILITIES
// ============================================

function toggleClass(element, className) {
    if (element) element.classList.toggle(className);
}

function addClass(element, className) {
    if (element) element.classList.add(className);
}

function removeClass(element, className) {
    if (element) element.classList.remove(className);
}

function show(element) {
    if (element) element.style.display = '';
}

function hide(element) {
    if (element) element.style.display = 'none';
}

function html(element, content) {
    if (!element) return '';
    if (content !== undefined) {
        element.innerHTML = content;
        return element;
    }
    return element.innerHTML;
}

function text(element, content) {
    if (!element) return '';
    if (content !== undefined) {
        element.textContent = content;
        return element;
    }
    return element.textContent;
}

function on(element, event, handler) {
    if (element) element.addEventListener(event, handler);
}

function off(element, event, handler) {
    if (element) element.removeEventListener(event, handler);
}

// ============================================
// MESSAGE & TOAST UTILITIES
// ============================================

function showMessage(element, message, type = 'info') {
    if (!element) return;
    
    element.className = `message-box ${type}`;
    element.textContent = message;
    element.style.display = 'block';
    
    if (type !== 'error') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 4000);
    }
}

function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `message-box ${type}`;
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '9999';
    toast.style.minWidth = '200px';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, duration);
}

// ============================================
// EXPORT & IMPORT UTILITIES
// ============================================

function exportToCSV(data, filename = 'export.csv') {
    if (!Array.isArray(data) || data.length === 0) {
        showToast('Tidak ada data untuk diexport', 'warning');
        return;
    }
    
    const headers = Object.keys(data[0]);
    let csv = headers.join(',') + '\n';
    
    data.forEach(row => {
        csv += headers.map(header => {
            let value = row[header];
            if (typeof value === 'string' && value.includes(',')) {
                value = `"${value}"`;
            }
            return value;
        }).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

function exportToJSON(data, filename = 'export.json') {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// ============================================
// DEBUGGING UTILITIES
// ============================================

function log(message, data = null) {
    if (data) {
        console.log(`[SIMORA] ${message}`, data);
    } else {
        console.log(`[SIMORA] ${message}`);
    }
}

function warn(message, data = null) {
    if (data) {
        console.warn(`[SIMORA] ${message}`, data);
    } else {
        console.warn(`[SIMORA] ${message}`);
    }
}

function error(message, data = null) {
    if (data) {
        console.error(`[SIMORA] ${message}`, data);
    } else {
        console.error(`[SIMORA] ${message}`);
    }
}
