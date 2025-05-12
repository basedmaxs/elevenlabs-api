// Muat konfigurasi dari localStorage saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    const apiKey = localStorage.getItem('apiKey');
    const voiceId = localStorage.getItem('voiceId');
    if (apiKey) document.getElementById('apiKey').value = apiKey;
    if (voiceId) document.getElementById('voiceId').value = voiceId;
});

// Simpan API Key dan Voice ID ke localStorage
function saveApiConfig() {
    const apiKey = document.getElementById('apiKey').value;
    const voiceId = document.getElementById('voiceId').value;
    const status = document.getElementById('status');

    if (!apiKey || !voiceId) {
        status.textContent = 'Masukkan API Key dan Voice ID!';
        return;
    }

    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('PsEYifg5ra2YMbPGwhb3', voiceId);
    status.textContent = 'Konfigurasi disimpan!';
}

// Konversi teks ke suara
async function convertTextToSpeech() {
    const textInput = document.getElementById('textInput').value;
    const apiKey = localStorage.getItem('apiKey');
    const voiceId = localStorage.getItem('voiceId');
    const audioPlayer = document.getElementById('audioPlayer');
    const status = document.getElementById('status');

    console.log('API Key:', apiKey);
    console.log('Voice ID:', voiceId);
    console.log('Text:', textInput);

    if (!textInput) {
        status.textContent = 'Masukkan teks!';
        return;
    }

    if (!apiKey || !voiceId) {
        status.textContent = 'Simpan API Key dan Voice ID terlebih dahulu!';
        return;
    }

    status.textContent = 'Mengonversi...';

    try {
        const response = await fetch('https://elevenlabs-api.pages.dev//api/text-to-speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: textInput,
                apiKey,
                voiceId,
                model_id: 'eleven_multilingual_v2',
                output_format: 'mp3_44100_128'
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
        status.textContent = 'Berhasil! Memutar audio...';
    } catch (error) {
        status.textContent = `Error: ${error.message}`;
        console.error('Error details:', error);
    }
}
