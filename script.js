const translations = {
    en: {
        subtitle: "Generate beautiful, customized QR codes instantly.",
        dataLabel: "Data (URL or Text)",
        patternLabel: "Dot Pattern",
        optRounded: "Rounded",
        optDots: "Dots",
        optClassy: "Classy",
        optClassyRounded: "Classy Rounded",
        optSquare: "Square",
        optExtraRounded: "Extra Rounded",
        cornerSqLabel: "Corner Square",
        optCornerSqExtraRounded: "Extra Rounded",
        optCornerSqDot: "Dot",
        optCornerSqSquare: "Square",
        cornerDotLabel: "Corner Dot",
        optCornerDotDot: "Dot",
        optCornerDotSquare: "Square",
        fgColorLabel: "Foreground Color",
        bgColorLabel: "Background Color",
        addLogoLabel: "Add Logo",
        chooseImage: "Choose Image",
        noFile: "No file chosen",
        downloadPng: "Download PNG",
        downloadSvg: "Download SVG",
        toastSuccess: "QR Code Copied to Clipboard!",
        toastFail: "Failed to copy. Try downloading instead.",
        clickToCopy: "Click to copy"
    },
    ko: {
        subtitle: "아름답고 맞춤화된 QR 코드를 즉시 생성하세요.",
        dataLabel: "데이터 (URL 또는 텍스트)",
        patternLabel: "점 모양 (패턴)",
        optRounded: "둥글게",
        optDots: "점",
        optClassy: "클래식",
        optClassyRounded: "클래식 둥글게",
        optSquare: "사각형",
        optExtraRounded: "매우 둥글게",
        cornerSqLabel: "모서리 외곽선",
        optCornerSqExtraRounded: "매우 둥글게",
        optCornerSqDot: "점",
        optCornerSqSquare: "사각형",
        cornerDotLabel: "모서리 내부 점",
        optCornerDotDot: "점",
        optCornerDotSquare: "사각형",
        fgColorLabel: "전경색 (QR 색상)",
        bgColorLabel: "배경색",
        addLogoLabel: "로고 추가",
        chooseImage: "이미지 선택",
        noFile: "파일 선택 안 됨",
        downloadPng: "PNG 다운로드",
        downloadSvg: "SVG 다운로드",
        toastSuccess: "QR 코드가 클립보드에 복사되었습니다!",
        toastFail: "복사 실패. 다운로드를 시도해 주세요.",
        clickToCopy: "클릭하여 복사"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const qrContainer = document.getElementById('qr-code');
    const dataInput = document.getElementById('qr-data');
    const dotsStyleSelect = document.getElementById('dots-style');
    const cornersSquareSelect = document.getElementById('corners-square-style');
    const cornersDotSelect = document.getElementById('corners-dot-style');
    
    const fgColorInput = document.getElementById('qr-color');
    const fgColorHex = document.getElementById('qr-color-hex');
    const bgColorInput = document.getElementById('qr-bg-color');
    const bgColorHex = document.getElementById('qr-bg-color-hex');
    
    const logoInput = document.getElementById('qr-logo');
    const uploadBtn = document.getElementById('upload-btn');
    const fileNameDisplay = document.getElementById('file-name');
    const clearLogoBtn = document.getElementById('clear-logo');
    
    const downloadPngBtn = document.getElementById('download-png');
    const downloadSvgBtn = document.getElementById('download-svg');

    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIconMoon = document.getElementById('theme-icon-moon');
    const themeIconSun = document.getElementById('theme-icon-sun');

    const langToggleBtn = document.getElementById('lang-toggle');
    const langText = document.getElementById('lang-text');

    // Language Management
    const getSystemLang = () => navigator.language.startsWith('ko') ? 'ko' : 'en';
    const getSavedLang = () => localStorage.getItem('lang');
    
    let currentLang = getSavedLang() || getSystemLang();
    
    const applyLanguage = (lang) => {
        // Toggle button shows the OTHER language option (if en, show KO to switch to Korean)
        langText.textContent = lang === 'en' ? 'KO' : 'EN';
        
        const t = translations[lang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                el.textContent = t[key];
            }
        });

        // Update CSS variable for the "click to copy" pseudo element
        document.documentElement.style.setProperty('--copy-text', `"${t.clickToCopy}"`);
        
        // Update placeholder or specific states if needed
        if (logoInput.value === '') {
            fileNameDisplay.textContent = t.noFile;
        }
    };

    // Initialize Language
    applyLanguage(currentLang);

    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ko' : 'en';
        localStorage.setItem('lang', currentLang);
        applyLanguage(currentLang);
    });


    // Default settings
    let qrOptions = {
        width: 300,
        height: 300,
        type: "svg",
        data: "https://github.com",
        image: "",
        margin: 10,
        qrOptions: {
            typeNumber: 0,
            mode: "Byte",
            errorCorrectionLevel: "Q"
        },
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 5,
            crossOrigin: "anonymous",
        },
        dotsOptions: {
            color: "#ffffff",
            type: "rounded"
        },
        backgroundOptions: {
            color: "#121212",
        },
        cornersSquareOptions: {
            color: "#ffffff",
            type: "extra-rounded"
        },
        cornersDotOptions: {
            color: "#ffffff",
            type: "dot"
        }
    };

    let userChangedColors = false;

    // Initialize QR Code Styling instance
    const qrCode = new QRCodeStyling(qrOptions);
    qrCode.append(qrContainer);

    // Update function
    const updateQR = () => {
        qrCode.update(qrOptions);
    };

    // Theme Management
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const getSystemTheme = () => prefersDark.matches ? 'dark' : 'light';
    const getSavedTheme = () => localStorage.getItem('theme');
    
    let currentTheme = getSavedTheme() || getSystemTheme();

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            themeIconMoon.style.display = 'none';
            themeIconSun.style.display = 'block';
        } else {
            themeIconMoon.style.display = 'block';
            themeIconSun.style.display = 'none';
        }
        
        // Update QR colors based on theme if user hasn't manually overridden them
        if (!userChangedColors) {
            const fg = theme === 'dark' ? '#ffffff' : '#000000';
            const bg = theme === 'dark' ? '#121212' : '#ffffff';
            
            qrOptions.dotsOptions.color = fg;
            qrOptions.cornersSquareOptions.color = fg;
            qrOptions.cornersDotOptions.color = fg;
            qrOptions.backgroundOptions.color = bg;
            
            fgColorInput.value = fg;
            fgColorHex.textContent = fg;
            bgColorInput.value = bg;
            bgColorHex.textContent = bg;
            
            qrContainer.parentElement.style.backgroundColor = bg;
            updateQR();
        }
    };

    // Initialize theme
    applyTheme(currentTheme);

    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            currentTheme = e.matches ? 'dark' : 'light';
            applyTheme(currentTheme);
        }
    });

    themeToggleBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        applyTheme(currentTheme);
    });

    // Event Listeners for standard inputs
    dataInput.addEventListener('input', (e) => {
        qrOptions.data = e.target.value || " ";
        updateQR();
    });

    dotsStyleSelect.addEventListener('change', (e) => {
        qrOptions.dotsOptions.type = e.target.value;
        updateQR();
    });

    cornersSquareSelect.addEventListener('change', (e) => {
        qrOptions.cornersSquareOptions.type = e.target.value;
        updateQR();
    });

    cornersDotSelect.addEventListener('change', (e) => {
        qrOptions.cornersDotOptions.type = e.target.value;
        updateQR();
    });

    // Color Pickers
    fgColorInput.addEventListener('input', (e) => {
        userChangedColors = true;
        const color = e.target.value;
        fgColorHex.textContent = color;
        qrOptions.dotsOptions.color = color;
        qrOptions.cornersSquareOptions.color = color;
        qrOptions.cornersDotOptions.color = color;
        updateQR();
    });

    bgColorInput.addEventListener('input', (e) => {
        userChangedColors = true;
        const color = e.target.value;
        bgColorHex.textContent = color;
        qrOptions.backgroundOptions.color = color;
        qrContainer.parentElement.style.backgroundColor = color;
        updateQR();
    });

    // Logo Upload Logic
    uploadBtn.addEventListener('click', () => {
        logoInput.click();
    });

    logoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            fileNameDisplay.textContent = file.name;
            clearLogoBtn.style.display = 'inline-flex';
            
            const reader = new FileReader();
            reader.onload = (event) => {
                qrOptions.image = event.target.result;
                updateQR();
            };
            reader.readAsDataURL(file);
        }
    });

    clearLogoBtn.addEventListener('click', () => {
        logoInput.value = '';
        fileNameDisplay.textContent = translations[currentLang].noFile;
        clearLogoBtn.style.display = 'none';
        qrOptions.image = '';
        updateQR();
    });

    // Toast Notification
    const toast = document.getElementById('toast');
    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    // Copy to Clipboard
    qrContainer.addEventListener('click', async () => {
        const t = translations[currentLang];
        try {
            // Some browsers (like Safari) lose the user gesture context if we await before writing to clipboard.
            // Passing the promise directly into ClipboardItem solves this issue.
            const blobPromise = qrCode.getRawData("png").then(blob => {
                if (!blob) throw new Error("Failed to generate image data");
                return blob;
            });

            await navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': blobPromise
                })
            ]);
            showToast(t.toastSuccess);
        } catch (err) {
            console.error('Failed to copy image: ', err);
            showToast(t.toastFail);
        }
    });

    // Downloads
    downloadPngBtn.addEventListener('click', () => {
        qrCode.download({ name: "qr-code", extension: "png" });
    });

    downloadSvgBtn.addEventListener('click', () => {
        qrCode.download({ name: "qr-code", extension: "svg" });
    });
});
