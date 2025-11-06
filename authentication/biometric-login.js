document.addEventListener('DOMContentLoaded', () => {
    const biometricBtn = document.getElementById('biometricBtn');
    const cameraView = document.getElementById('cameraView');
    const videoElement = document.getElementById('videoElement');
    const cancelBtn = document.getElementById('cancelBtn');
    let stream = null;

    // Function to start the camera (requires a trusted user gesture)
    async function startCamera(evt) {
        // Only allow when triggered by a real user action (trusted event)
        if (!evt || (evt instanceof Event && !evt.isTrusted)) {
            console.warn('startCamera bloqueado: é necessário um gesto do usuário (clique).');
            return;
        }

        try {
            // Request camera access
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user' // Use front camera if available
                }
            });
            
            // Show the camera view
            videoElement.srcObject = stream;
            cameraView.style.display = 'block';
            biometricBtn.style.display = 'none';
            
        } catch (err) {
            console.error('Erro ao acessar a câmera:', err);
            alert('Não foi possível acessar a câmera. Por favor, verifique se você concedeu as permissões de acesso à câmera.');
        }
    }

    // Function to stop the camera
    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            videoElement.srcObject = null;
            cameraView.style.display = 'none';
            biometricBtn.style.display = 'block';
        }
    }

    // Event listeners
    biometricBtn.addEventListener('click', (e) => {
        startCamera(e);
    });

    cancelBtn.addEventListener('click', () => {
        stopCamera();
    });

    // Clean up when the page is closed
    window.addEventListener('beforeunload', () => {
        stopCamera();
    });
});