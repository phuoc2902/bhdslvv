const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

function obfuscateHtml(filePath) {
    console.log(`=== Bắt đầu làm mờ file: ${filePath} ===`);
    let content = fs.readFileSync(filePath, 'utf8');

    // Tìm thẻ <script> không có thuộc tính src
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;

    content = content.replace(scriptRegex, (match, scriptContent) => {
        // Bỏ qua nếu là thẻ liên kết file bên ngoài (có src)
        if (match.includes(' src=') || match.includes(' src="') || match.includes(" src='")) {
            return match;
        }
        // Bỏ qua các thẻ module import nếu có
        if (scriptContent.trim().startsWith('import')) {
            return match;
        }

        try {
            console.log(`Đã phát hiện khối mã JS inline (độ dài: ${scriptContent.length} ký tự). Tiến hành trộn mã...`);
            const obfuscated = JavaScriptObfuscator.obfuscate(scriptContent, {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 0.75,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 0.4,
                debugProtection: false, // Tạm thời để false để tránh gây lag trình duyệt của khách hàng
                stringArray: true,
                stringArrayRotate: true,
                stringArrayShuffle: true,
                stringArrayThreshold: 0.75
            }).getObfuscatedCode();
            
            return `<script>${obfuscated}</script>`;
        } catch (e) {
            console.error(`❌ Lỗi khi trộn mã trong file ${filePath}:`, e);
            return match;
        }
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`=== Hoàn thành làm mờ file: ${filePath} ===\n`);
}

function obfuscateJsFile(filePath) {
    console.log(`=== Bắt đầu làm mờ file JS: ${filePath} ===`);
    let content = fs.readFileSync(filePath, 'utf8');
    try {
        console.log(`Tiến hành trộn mã cho ${filePath} (độ dài: ${content.length} ký tự)...`);
        const obfuscated = JavaScriptObfuscator.obfuscate(content, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.4,
            debugProtection: false,
            stringArray: true,
            stringArrayRotate: true,
            stringArrayShuffle: true,
            stringArrayThreshold: 0.75
        }).getObfuscatedCode();
        
        fs.writeFileSync(filePath, obfuscated, 'utf8');
        console.log(`=== Hoàn thành làm mờ file JS: ${filePath} ===\n`);
    } catch (e) {
        console.error(`❌ Lỗi khi trộn mã trong file JS ${filePath}:`, e);
    }
}

const htmlFiles = ['index.html', 'admin.html'];
htmlFiles.forEach(file => {
    const p = path.join(__dirname, file);
    if (fs.existsSync(p)) {
        obfuscateHtml(p);
    }
});

const jsFiles = [
    path.join(__dirname, 'js', 'index.js'),
    path.join(__dirname, 'js', 'admin.js')
];
jsFiles.forEach(p => {
    if (fs.existsSync(p)) {
        obfuscateJsFile(p);
    }
});
