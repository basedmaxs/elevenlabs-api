// Muat konfigurasi dari localStorage saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    const apiKey = localStorage.getItem('apiKey');
    const voiceId = localStorage.getItem('voiceId');
    const modelId = localStorage.getItem('modelId') || 'eleven_multilingual_v2';
    const outputFormat = localStorage.getItem('outputFormat') || 'mp3_44100_128';

    if (apiKey) document.getElementById('apiKey').value = apiKey;
    if (voiceId) document.getElementById('voiceId').value = voiceId;
    document.getElementById('modelId').value = modelId;
    document.getElementById('outputFormat').value = outputFormat;
});

// Simpan API Key
function saveApiKey() {
    const apiKey = document.getElementById('apiKey').value;
    const apiStatus = document.getElementById('apiStatus');

    if (!apiKey) {
        apiStatus.textContent = 'Masukkan API Key!';
        return;
    }

    localStorage.setItem('apiKey', apiKey);
    apiStatus.textContent = 'API Key disimpan!';
}

// Simpan pengaturan suara
function saveVoiceConfig() {
    const voiceId = document.getElementById('voiceId').value;
    const modelId = document.getElementById('modelId').value;
    const outputFormat = document.getElementById('outputFormat').value;
    const voiceStatus = document.getElementById('voiceStatus');

    if (!voiceId) {
        voiceStatus.textContent = 'Masukkan Voice ID!';
        return;
    }

    localStorage.setItem('voiceId', voiceId);
    localStorage.setItem('modelId', modelId);
    localStorage.setItem('outputFormat', outputFormat);
    voiceStatus.textContent = 'Pengaturan suara disimpan!';
}

// Konversi teks ke suara
async function convertTextToSpeech() {
    const textInput = document.getElementById('textInput').value;
    const apiKey = localStorage.getItem('apiKey');
    const voiceId = localStorage.getItem('voiceId');
    const modelId = localStorage.getItem('modelId');
    const outputFormat = localStorage.getItem('outputFormat');
    const audioPlayer = document.getElementById('audioPlayer');
    const ttsStatus = document.getElementById('ttsStatus');

    console.log('API Key:', apiKey);
    console.log('Voice ID:', voiceId);
    console.log('Model ID:', modelId);
    console.log('Output Format:', outputFormat);
    console.log('Text:', textInput);

    if (!textInput) {
        ttsStatus.textContent = 'Masukkan teks!';
        return;
    }

    if (!apiKey || !voiceId || !modelId || !outputFormat) {
        ttsStatus.textContent = 'Simpan API Key dan pengaturan suara terlebih dahulu!';
        return;
    }

    ttsStatus.textContent = 'Mengonversi...';

    try {
        const response = await fetch('https://elevenlabs-api.pages.dev//api/text-to-speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: textInput,
                apiKey,
                voiceId,
                model_id: modelId,
                output_format: outputFormat,
                apply_language_text_normalization: modelId === 'eleven_flash_v2_5'
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gagal mengonversi teks: ${errorText}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        audioPlayer.src = url;
        audioPlayer.play();
        ttsStatus.textContent = 'Berhasil! Memutar audio...';
    } catch (error) {
        ttsStatus.textContent = `Error: ${error.message}`;
        console.error('Error converting text:', error);
    }
}
