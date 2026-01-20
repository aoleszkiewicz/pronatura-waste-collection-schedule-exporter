const API_BASE_URL = "https://zs5cv4ng75.execute-api.eu-central-1.amazonaws.com/prod";

const monthMap = {
    'Styczeń': 0, 'Luty': 1, 'Marzec': 2, 'Kwiecień': 3,
    'Maj': 4, 'Czerwiec': 5, 'Lipiec': 6, 'Sierpień': 7,
    'Wrzesień': 8, 'Październik': 9, 'Listopad': 10, 'Grudzień': 11
};

const streetInput = document.getElementById('street-input');
const streetList = document.getElementById('street-list');
const addressInput = document.getElementById('address-input');
const addressList = document.getElementById('address-list');
const downloadBtn = document.getElementById('download-btn');
const statusMessage = document.getElementById('status-message');

let streets = [];
let addresses = [];
let selectedStreet = null;
let selectedAddress = null;

function normalizeText(text) {
    return text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ł/g, "l")
        .replace(/Ł/g, "l");
}

async function init() {
    showStatus('Ładowanie list ulic...', 'loading');
    try {
        const response = await fetch(`${API_BASE_URL}/streets`);
        if (!response.ok) throw new Error('Nie udało się pobrać listy ulic.');
        streets = await response.json();
        streets.sort((a, b) => a.street.localeCompare(b.street));
        showStatus('');
    } catch (error) {
        showStatus('Błąd połączenia. Spróbuj odświeżyć stronę.', 'error');
        console.error(error);
    }
}

// Obsługa wyszukiwania ulicy
streetInput.addEventListener('input', (e) => {
    const term = normalizeText(e.target.value);
    const filtered = streets.filter(s => normalizeText(s.street).includes(term));
    renderList(streetList, filtered, 'street', (item) => selectStreet(item));
});

streetInput.addEventListener('focus', () => {
    if (streets.length > 0) {
        renderList(streetList, streets, 'street', (item) => selectStreet(item));
    }
});

// Obsługa wyszukiwania numeru
addressInput.addEventListener('input', (e) => {
    const term = normalizeText(e.target.value);
    const filtered = addresses.filter(a => 
        normalizeText(a.buildingNumber).includes(term) || 
        (a.name && normalizeText(a.name).includes(term))
    );
    renderList(addressList, filtered, 'address', (item) => selectAddress(item));
});

addressInput.addEventListener('focus', () => {
    if (addresses.length > 0) {
        renderList(addressList, addresses, 'address', (item) => selectAddress(item));
    }
});

function renderList(listElement, items, type, onSelect) {
    listElement.innerHTML = '';
    listElement.classList.add('active');

    if (items.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'autocomplete-no-results';
        noResults.textContent = 'Brak wyników';
        listElement.appendChild(noResults);
        return;
    }

    items.slice(0, 50).forEach(item => { // Limit to 50 for performance
        const div = document.createElement('div');
        div.className = 'autocomplete-item';
        
        if (type === 'street') {
            div.textContent = item.street;
        } else {
            // Logika dla punktów adresowych
            const primary = document.createElement('span');
            primary.textContent = item.buildingNumber;
            div.appendChild(primary);

            const secondaryParts = [];
            if (item.buildingType === 'NIEMIESZKALNA') secondaryParts.push('niemieszkalna');
            if (item.name) secondaryParts.push(item.name);

            if (secondaryParts.length > 0) {
                const secondary = document.createElement('span');
                secondary.className = 'autocomplete-secondary';
                secondary.textContent = secondaryParts.join(' - ');
                div.appendChild(secondary);
            }
        }

        div.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevent focus loss before click
            onSelect(item);
        });
        listElement.appendChild(div);
    });
}

async function selectStreet(street) {
    selectedStreet = street;
    streetInput.value = street.street;
    streetList.classList.remove('active');
    
    // Reset address selection
    addressInput.disabled = true;
    addressInput.value = '';
    selectedAddress = null;
    downloadBtn.disabled = true;
    
    showStatus('Ładowanie numerów domów...', 'loading');
    try {
        const response = await fetch(`${API_BASE_URL}/address-points/${street.id}`);
        if (!response.ok) throw new Error('Nie udało się pobrać numerów.');
        addresses = await response.json();
        addresses.sort((a, b) => a.buildingNumber.localeCompare(b.buildingNumber, undefined, { numeric: true, sensitivity: 'base' }));
        
        addressInput.disabled = false;
        addressInput.placeholder = "Wybierz numer domu...";
        showStatus('');
    } catch (error) {
        showStatus('Błąd podczas ładowania adresów.', 'error');
    }
}

function selectAddress(address) {
    selectedAddress = address;
    addressInput.value = address.buildingNumber;
    addressList.classList.remove('active');
    downloadBtn.disabled = false;
}

// Close lists when clicking outside
document.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.custom-select-wrapper')) {
        streetList.classList.remove('active');
        addressList.classList.remove('active');
    }
});

// Pobieranie harmonogramu i generowanie ICS
downloadBtn.addEventListener('click', async () => {
    if (!selectedAddress) return;
    
    showStatus('Generowanie harmonogramu...', 'loading');
    downloadBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/trash-schedule/${selectedAddress.id}`);
        if (!response.ok) throw new Error('Błąd pobierania danych.');
        const data = await response.json();
        
        const icsContent = generateICS(data.trashSchedule);
        downloadFile(icsContent, `harmonogram_${selectedStreet.street.replace(/\s+/g, '_')}_${selectedAddress.buildingNumber}.ics`);
        
        showStatus('Gotowe! Harmonogram został pobrany.', '');
        downloadBtn.disabled = false;
    } catch (error) {
        showStatus('Nie udało się wygenerować pliku.', 'error');
        downloadBtn.disabled = false;
    }
});

function generateICS(trashSchedule) {
    const year = new Date().getFullYear();
    let icsLines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Waste Collection Schedule//pronatura//PL',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:Wywóz Odpadów ProNatura',
        'X-WR-TIMEZONE:Europe/Warsaw'
    ];

    trashSchedule.forEach(monthData => {
        const monthIndex = monthMap[monthData.month];
        if (monthIndex === undefined) return;

        monthData.schedule.forEach(item => {
            const wasteType = item.type;
            const days = item.days;

            days.forEach(day => {
                const dayNum = parseInt(day);
                if (isNaN(dayNum)) return;

                // Bezpieczne tworzenie daty (bez przesunięć stref czasowych)
                const monthStr = String(monthIndex + 1).padStart(2, '0');
                const dayStr = String(dayNum).padStart(2, '0');
                const dateStr = `${year}${monthStr}${dayStr}`;
                
                // Dla wydarzeń całodniowych DTEND musi być kolejnym dniem
                const nextDate = new Date(year, monthIndex, dayNum + 1);
                const nextMonthStr = String(nextDate.getMonth() + 1).padStart(2, '0');
                const nextDayStr = String(nextDate.getDate()).padStart(2, '0');
                const nextDateStr = `${nextDate.getFullYear()}${nextMonthStr}${nextDayStr}`;

                const uid = Math.random().toString(36).substring(2) + Date.now().toString(36);

                icsLines.push('BEGIN:VEVENT');
                icsLines.push(`UID:${uid}@pronatura-exporter`);
                icsLines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
                icsLines.push(`DTSTART;VALUE=DATE:${dateStr}`);
                icsLines.push(`DTEND;VALUE=DATE:${nextDateStr}`);
                icsLines.push(`SUMMARY:${wasteType.charAt(0).toUpperCase() + wasteType.slice(1)}`);
                icsLines.push(`DESCRIPTION:Odbiór odpadów: ${wasteType}`);
                
                // Przypomnienie 1: Dzień wcześniej o 18:00
                icsLines.push('BEGIN:VALARM');
                icsLines.push('ACTION:DISPLAY');
                icsLines.push('DESCRIPTION:Wystaw odpady: ' + wasteType);
                icsLines.push('TRIGGER:-PT6H'); // 6 godzin przed północą = 18:00 dnia poprzedniego
                icsLines.push('END:VALARM');

                // Przypomnienie 2: W dniu wywozu o 07:00
                icsLines.push('BEGIN:VALARM');
                icsLines.push('ACTION:DISPLAY');
                icsLines.push('DESCRIPTION:Dzisiaj wywóz: ' + wasteType);
                icsLines.push('TRIGGER:PT7H'); // 7 rano w dniu wydarzenia
                icsLines.push('END:VALARM');

                icsLines.push('END:VEVENT');
            });
        });
    });

    icsLines.push('END:VCALENDAR');
    return icsLines.join('\r\n');
}

function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function showStatus(text, type = '') {
    statusMessage.textContent = text;
    statusMessage.className = 'status-message';
    if (type) statusMessage.classList.add(`status-${type}`);
}

init();
